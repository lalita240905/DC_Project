const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lostfound"

// Import models to ensure they're registered
const User = require("../models/User")
const Item = require("../models/Item")

async function setupDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB successfully")

    // Create indexes for better performance
    console.log("📊 Creating database indexes...")

    // User indexes
    try {
      await User.collection.createIndex({ email: 1 }, { unique: true })
      console.log("✅ User email index created")
    } catch (error) {
      if (error.code !== 11000) {
        console.log("ℹ️ User email index already exists")
      }
    }

    try {
      await User.collection.createIndex({ username: 1 }, { unique: true })
      console.log("✅ User username index created")
    } catch (error) {
      if (error.code !== 11000) {
        console.log("ℹ️ User username index already exists")
      }
    }

    // Item indexes
    try {
      // Check if text index exists and drop it if it conflicts
      const existingIndexes = await Item.collection.getIndexes()
      const textIndexExists = Object.keys(existingIndexes).some(
        (name) => name.includes("text") && !name.includes("location_text_tags_text"),
      )

      if (textIndexExists) {
        console.log("🔄 Dropping existing conflicting text index...")
        await Item.collection.dropIndex("title_text_description_text")
      }
    } catch (error) {
      console.log("ℹ️ No conflicting text index to drop")
    }

    try {
      await Item.collection.createIndex({
        title: "text",
        description: "text",
        location: "text",
        tags: "text",
      })
      console.log("✅ Item text search index created")
    } catch (error) {
      console.log("ℹ️ Item text search index already exists")
    }

    try {
      await Item.collection.createIndex({ category: 1 })
      console.log("✅ Item category index created")
    } catch (error) {
      console.log("ℹ️ Item category index already exists")
    }

    try {
      await Item.collection.createIndex({ status: 1 })
      console.log("✅ Item status index created")
    } catch (error) {
      console.log("ℹ️ Item status index already exists")
    }

    try {
      await Item.collection.createIndex({ createdAt: -1 })
      console.log("✅ Item createdAt index created")
    } catch (error) {
      console.log("ℹ️ Item createdAt index already exists")
    }

    try {
      await Item.collection.createIndex({ location: 1 })
      console.log("✅ Item location index created")
    } catch (error) {
      console.log("ℹ️ Item location index already exists")
    }

    console.log("✅ Database indexes setup completed")

    // Create sample data (optional)
    const userCount = await User.countDocuments()
    if (userCount === 0) {
      console.log("📝 Creating sample data...")

      // Create sample user
      const sampleUser = new User({
        username: "demo_user",
        email: "demo@example.com",
        password: "password123", // This will be hashed by the pre-save middleware
      })
      await sampleUser.save()

      // Create sample items
      const sampleItems = [
        {
          title: "Lost iPhone 13",
          description: "Black iPhone 13 with blue case, lost near the library",
          category: "Electronics",
          type: "lost",
          location: "University Library",
          contactInfo: "demo@example.com",
          userId: sampleUser._id,
        },
        {
          title: "Found Keys",
          description: "Set of keys with Toyota keychain found in parking lot",
          category: "Keys",
          type: "found",
          location: "Main Parking Lot",
          contactInfo: "demo@example.com",
          userId: sampleUser._id,
        },
      ]

      await Item.insertMany(sampleItems)
      console.log("✅ Sample data created successfully")
    }

    console.log("🎉 Database setup completed successfully!")
    console.log("📊 Database Statistics:")
    console.log(`   Users: ${await User.countDocuments()}`)
    console.log(`   Items: ${await Item.countDocuments()}`)
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log("🔌 Database connection closed")
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
}

module.exports = setupDatabase
