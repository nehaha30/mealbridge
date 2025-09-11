// server.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection (port 3308, password root)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",   // 👈 password is root
  database: "mealbridge",
  port: 3308
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database on port 3308.");
});


// ---------------- ROUTES ----------------

// Test route
app.get("/", (req, res) => {
  res.send("MealBridge Backend Running");
});

// Register User
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: "User registered successfully", userId: result.insertId });
  });
});

// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (result.length > 0) {
      res.json({ message: "Login successful", user: result[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

// Add Food Post
app.post("/foodposts", (req, res) => {
  const { donor_id, food_name, description, quantity, image_url, pickup_location, expiry_time } = req.body;
  const sql = "INSERT INTO foodposts (donor_id, food_name, description, quantity, image_url, pickup_location, expiry_time) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [donor_id, food_name, description, quantity, image_url, pickup_location, expiry_time], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: "Food post added", foodId: result.insertId });
  });
});

// Get Available Food Posts
app.get("/foodposts", (req, res) => {
  const sql = "SELECT * FROM foodposts WHERE status = 'Available'";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(result);
  });
});

// Request Pickup
app.post("/pickups", (req, res) => {
  const { food_id, receiver_id } = req.body;
  const sql = "INSERT INTO pickups (food_id, receiver_id, status) VALUES (?, ?, 'Requested')";
  db.query(sql, [food_id, receiver_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json({ message: "Pickup requested", pickupId: result.insertId });
  });
});

// Get Pickups (by receiver_id from body)
app.post("/pickups/list", (req, res) => {
  const { receiver_id } = req.body;
  const sql = "SELECT * FROM pickups WHERE receiver_id = ?";
  db.query(sql, [receiver_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(result);
  });
});

// Fetch posts for a donor (expects { donor_id } in body)
app.post("/fetchpost", (req, res) => {
  const { donor_id } = req.body || {};
  if (!donor_id) {
    return res.status(400).json({ error: "donor_id is required" });
  }
  const sql = "SELECT * FROM foodposts WHERE donor_id = ? ORDER BY id DESC";
  db.query(sql, [donor_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(result);
  });
});

// Delete Food Post (expects { id } in body)
app.delete("/deletepost", (req, res) => {
  const { id } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: "Post id is required" });
  }
  const sql = "DELETE FROM foodposts WHERE food_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.sqlMessage });}
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Food post deleted", id });
  });
});


// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
