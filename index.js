import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

const KEY = "random";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

mongoose.connect(
  "mongodb+srv://rudrakshnile:nilerudra064@cluster0.caaeero.mongodb.net/user"
);

app.post("/users/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User Already Exists!!" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully!!", token });
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && user.password === password) {
    const token = jwt.sign({ username, role: "user" }, KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully...", token });
  } else {
    res.status(403).json({ message: "Invalid username or password !!" });
  }
});

app.post("/users/forgot-password", async (req, res) => {
  const { username, password, newpassword } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password === password) {
    user.password = newpassword;
    await user.save();
    return res.status(200).json({ message: "Password Updated Successfully" });
  } else {
    return res.status(403).json({ message: "Invalid username or password" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
