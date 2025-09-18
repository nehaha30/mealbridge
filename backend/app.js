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
  // Normalize status to be case-insensitive for 'available'
  const sql = "SELECT * FROM foodposts WHERE LOWER(status) = 'available'";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(result);
  });
});

// Mark a food post as claimed (expects { food_id } in body)
app.post("/claim", (req, res) => {
  const { food_id } = req.body || {};
  if (!food_id) {
    return res.status(400).json({ error: "food_id is required" });
  }
  const sql = "UPDATE foodposts SET status = 'claimed' WHERE food_id = ?";
  db.query(sql, [food_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Food post claimed", food_id });
  });
});

// Mark a food post back to available (expects { food_id } in body)
app.post("/available", (req, res) => {
  const { food_id } = req.body || {};
  if (!food_id) {
    return res.status(400).json({ error: "food_id is required" });
  }
  const sql = "UPDATE foodposts SET status = 'available' WHERE food_id = ?";
  db.query(sql, [food_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Food post set to available", food_id });
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

// Delete a pickup by pickup_id
app.delete("/pickups", (req, res) => {
  const { pickup_id } = req.body || {};
  if (!pickup_id) {
    return res.status(400).json({ error: "pickup_id is required" });
  }
  const sql = "DELETE FROM pickups WHERE pickup_id = ?";
  db.query(sql, [pickup_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pickup not found" });
    }
    res.json({ message: "Pickup deleted", pickup_id });
  });
});

// Get Pickups (by receiver_id from body)
app.post("/pickupslist", (req, res) => {
  const { receiver_id } = req.body;
  const sql = `
    SELECT 
      p.pickup_id,
      p.food_id,
      p.receiver_id,
      p.status,
      f.food_name,
      f.description,
      f.quantity,
      f.expiry_time,
      f.pickup_location,
      f.image_url,
      f.donor_id
    FROM pickups p
    JOIN foodposts f ON f.food_id = p.food_id
    WHERE p.receiver_id = ?
    ORDER BY p.pickup_id DESC`;
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
  const sql = "SELECT * FROM foodposts WHERE donor_id = ? ORDER BY food_id DESC";
  db.query(sql, [donor_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(result);
  });
});

// Get receiver info for a claimed food post (expects { food_id })
app.post("/claimedinfo", (req, res) => {
  const { food_id } = req.body || {};
  if (!food_id) {
    return res.status(400).json({ error: "food_id is required" });
  }
  const sql = `
    SELECT 
      u.user_id as receiver_id,
      u.name as receiver_name,
      u.email as receiver_email
    FROM pickups p
    JOIN users u ON u.user_id = p.receiver_id
    WHERE p.food_id = ?
    ORDER BY p.pickup_id DESC
    LIMIT 1`;
  db.query(sql, [food_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (!Array.isArray(result) || result.length === 0) {
      return res.json(null);
    }
    res.json(result[0]);
  });
});

// Get only the receiver name for a claimed food post (expects { food_id })
app.post("/claimedname", (req, res) => {
  const { food_id } = req.body || {};
  if (!food_id) {
    return res.status(400).json({ error: "food_id is required" });
  }
  console.log("[claimedname] Incoming food_id:", food_id);
  const sql = `
    SELECT 
      u.name AS receiver_name
    FROM pickups p
    JOIN users u ON u.user_id = p.receiver_id
    WHERE p.food_id = ?
    ORDER BY p.pickup_id DESC
    LIMIT 1`;
  db.query(sql, [food_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (!Array.isArray(result) || result.length === 0) {
      return res.json(null);
    }
    const name = result[0].receiver_name;
    console.log("[claimedname] Resolved receiver_name:", name);
    res.json({ receiver_name: name });
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
