const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const db = require("./config/connection");

// load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize passport (strategy configured in config/passport.js)
require("./config/passport");
app.use(passport.initialize());

// routes
app.use("/api", require("./routes"));

// basic root
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Cheyenne's Secure Web Portal API" });
});

// start server after DB connect
db.once("open", () => {
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
});