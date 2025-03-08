// Libraries
require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

// Variables
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// SQL Server Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
};

// Connect to SQL Server
sql
  .connect(dbConfig)
  .then(() => console.log("✅ Connected to SQL Server"))
  .catch((err) => console.error("❌ Database Connection Failed:", err));

// Route: Execute a Custom Query
app.post("/query", async (req, res) => {
  const { sqlQuery } = req.body;
  if (!sqlQuery) {
    return res.status(400).json({ error: "SQL query is required!" });
  }

  try {
    const result = await sql.query(sqlQuery);
    res.status(201).json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(port, () =>
  console.log(`🚀 API running on http://localhost:${port}`)
);
