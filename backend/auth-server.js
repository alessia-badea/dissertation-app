// app.js (ESM style)
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "./config/auth.js";
require('dotenv').config();

const app = express();
app.use(express.json());

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // TODO: fetch user from DB by email
//   const userFromDb = {
//     id: 1,
//     email: "test@example.com",
//     passwordHash: await bcrypt.hash("password123", 10),
//   };
//it needs change for an actual DB call, we will see the mechanisms explained

  const isMatch = await bcrypt.compare(password, userFromDb.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: userFromDb.id, email: userFromDb.email },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  res.json({ token });
});

app.listen(3000, () => console.log("Server running on port 3000"));

