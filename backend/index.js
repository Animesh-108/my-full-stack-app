import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.send("Backend is healthy!");
});

// Catch-all route (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
