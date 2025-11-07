// This is the content from your index.js, now named server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send("Backend is healthy!");
});

// ✅ Add this route so frontend fetch works
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});

// ✅ Add this route so frontend fetch works