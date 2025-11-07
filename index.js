const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const bidRoutes = require("./routes/bidRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/auctions", auctionRoutes);

app.get("/", (req, res) => {
  res.send("Backend Express en marche !");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
