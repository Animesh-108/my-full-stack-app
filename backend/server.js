import express from "express";
import cors from "cors";
import client from 'prom-client'; // 1. Import prom-client

const app = express();
app.use(cors());
app.use(express.json());

// --- 2. Add Prometheus Metrics ---
// Create a Registry to collect default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// Create a histogram to track HTTP request durations
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // Define buckets for response times
});
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to track request duration
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    // Use req.route.path to get the parameterized route (e.g., /api/hello)
    const route = req.route ? req.route.path : 'unknown_route';
    end({ method: req.method, route: route, status_code: res.statusCode });
  });
  next();
});

// 3. Create the /metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});
// --- End of Prometheus Metrics ---


app.get("/api/health", (req, res) => {
  res.send("Backend is healthy!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});