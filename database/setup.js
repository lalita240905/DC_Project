// MongoDB Database Setup Script
// Run this script to initialize your database with sample data

const { MongoClient } = require("mongodb")

// Connection URL - change this to your MongoDB server IP when running on separate devices
const url = "mongodb://localhost:27017"
const dbName = "lostandfound"

async function setupDatabase() {
  const client = new MongoClient(url)

  try {
    // Connect to MongoDB
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db(dbName)

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((col) => col.name)

    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      console.log("📁 Created users collection")
    }

    if (!collectionNames.includes("items")) {
      await db.createCollection("items")
      console.log("📁 Created items collection")
    }

    // Create indexes for better performance
    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    await db.collection("items").createIndex({ type: 1 })
    await db.collection("items").createIndex({ posted_by: 1 })
    await db.collection("items").createIndex({ createdAt: -1 })

    console.log("📊 Created database indexes")

    // Insert sample data (optional)
    const sampleItems = [
      {
        type: "LOST",
        title: "Black Leather Wallet",
        desc: "Lost near the university library. Contains ID and credit cards.",
        posted_by: "demo_user",
        claimed_by: null,
        createdAt: new Date(),
      },
      {
        type: "FOUND",
        title: "iPhone 13 Pro",
        desc: "Found in the park near the fountain. Has a blue case.",
        posted_by: "demo_user",
        claimed_by: null,
        createdAt: new Date(),
      },
      {
        type: "LOST",
        title: "Red Bicycle",
        desc: "Mountain bike, red color, stolen from bike rack.",
        posted_by: "demo_user",
        claimed_by: null,
        createdAt: new Date(),
      },
    ]

    // Only insert sample data if items collection is empty
    const itemCount = await db.collection("items").countDocuments()
    if (itemCount === 0) {
      await db.collection("items").insertMany(sampleItems)
      console.log("📝 Inserted sample items")
    }

    console.log("🎉 Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
  } finally {
    await client.close()
  }
}

// Run the setup
setupDatabase()
