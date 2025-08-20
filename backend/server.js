const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"], // Added port 5173 for Vite frontend
    credentials: true,
  }),
)

// Environment variables (in production, use proper env file)
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "b6988a8cf2c141fdb68443a64d0c096b3a21038f96fe82a1f04e6b69b0a9841727de4d78e2af09517bfe5210451b64b1b2ba876f7e749c5510519093cdad854c"
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lostandfound"

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))
db.once("open", () => console.log("✅ Connected to MongoDB"))

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

const User = mongoose.model("User", userSchema)

// Item Schema
const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["LOST", "FOUND"], required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    posted_by: { type: String, required: true },
    claimed_by: { type: String, default: null },
  },
  { timestamps: true },
)

const Item = mongoose.model("Item", itemSchema)

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    const usernameField = username || email

    // Check if user exists
    const existingUser = await User.findOne({ username: usernameField })
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      username: usernameField,
      email: email,
      password: hashedPassword,
    })

    await user.save()

    // Generate token
    const token = jwt.sign({ username: usernameField }, JWT_SECRET, { expiresIn: "24h" })

    res.json({ message: "User created successfully", token, user: { username: usernameField } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, email, password } = req.body

    const usernameField = username || email

    // Find user
    const user = await User.findOne({ username: usernameField })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ username: usernameField }, JWT_SECRET, { expiresIn: "24h" })

    res.json({ message: "Login successful", token, user: { username: usernameField } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json({ username: user.username, email: user.email })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Item Routes
app.post("/api/items", authenticateToken, async (req, res) => {
  try {
    const { type, title, desc } = req.body
    const item = new Item({
      type,
      title,
      desc,
      posted_by: req.user.username,
    })

    await item.save()
    res.json({ message: "Item added successfully", item })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ✅ Claim Route
app.post("/api/items/:id/claim", authenticateToken, async (req, res) => {
  try {
    console.log("Claim request for item:", req.params.id, "by", req.user);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.posted_by === req.user.username) {
      return res.status(400).json({ error: "You cannot claim your own item" });
    }

    if (item.claimed_by) {
      return res.status(400).json({ error: "Item already claimed" });
    }

    // ✅ Update claim + move to FOUND, skip validators
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        claimed_by: req.user.username,
        claimed_at: new Date(),
        type: "found", // <-- added to move item to FOUND
      },
      { new: true, runValidators: false }
    );

    res.json({ message: "Item claimed successfully", item: updatedItem });
  } catch (error) {
    console.error("Error in claim route:", error);
    res.status(500).json({ error: error.message });
  }
});


// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})
