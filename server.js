import express from "express";
import cors from "cors";
import earthquakeRoute from "./earthquake.js";

const app = express();
app.use(cors());
app.use(express.json());

// Mount earthquake route
app.use("/api/earthquake", earthquakeRoute);

// Root
app.get("/", (req, res) => res.send("Earthquake API Running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Earthquake API running on port ${PORT}`));
