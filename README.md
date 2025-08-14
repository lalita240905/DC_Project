
# 🕵️‍♂️ Lost & Found MERN App

A simple **3-tier architecture** demo built with the MERN stack (MongoDB, Express, React, Node.js).  
The app allows users to **post lost or found items** and **claim items**, with a rule to prevent claiming your own post.

---

## 📌 Features
- User login (auto-register if username doesn’t exist)
- Post a lost or found item
- View all items in a card list
- Claim items (cannot claim your own)
- JWT authentication for secure requests
- Clear **three-tier separation** for learning purposes

---

## 🏗 3-Tier Architecture

### **1️⃣ Data Tier (MongoDB)**
- Stores user details and item records
- Database: `lostfound`
- Collections:
  - `users`: `{ _id, username, passwordHash }`
  - `items`: `{ _id, type, title, desc, posted_by, claimed_by }`

### **2️⃣ Application Tier (Node.js + Express)**
- Handles API requests and business logic
- Enforces rules (e.g., cannot claim your own post)
- Communicates with MongoDB using Mongoose
- Authentication with JWT

### **3️⃣ Presentation Tier (React)**
- Displays items in cards
- Login form for authentication
- Claim button for unclaimed items
- Uses `fetch()` to call backend APIs

---
