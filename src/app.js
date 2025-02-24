import express from "express";
import cors from "cors";
import { httpLogger } from "./utils/logger.js";
import routes from "./routes/router.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import CustomError from "./utils/CustomError.js";
import ResponseHandler from "./utils/CustomResponse.js";

const app = express();

// Define allowed origins for production
const allowedOrigins = [
 'http://localhost:3000',
 'http://localhost:5173',
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new CustomError("Not allowed by CORS", 403));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies if needed
  optionsSuccessStatus: 204, // Handles preflight requests better
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(httpLogger);

// Default forbidden route
app.get("/", (req, res) => ResponseHandler.forbidden(res));

// All routes prefixed with /api
app.use("/api", routes);

// Handle 404 Not Found
app.use((req, res, next) => {
  next(new CustomError("Route Not Found", 404));
});

// Global error handler middleware
app.use(errorMiddleware);

export default app;
