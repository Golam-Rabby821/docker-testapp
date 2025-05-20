const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");

const PORT = 8050;
const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);
let db;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // required for JSON POST
app.use(express.static("public"));

async function startServer() {
  try {
    await client.connect();
    db = client.db("apnacollege-db");
    console.log("Connected successfully to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1);
  }
}

startServer();

app.get("/getUsers", async (req, res) => {
  try {
    const data = await db.collection("users").find({}).toArray();
    res.send(data);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

app.post("/addUser", async (req, res) => {
  try {
    const userObj = req.body;
    const result = await db.collection("users").insertOne(userObj);
    res.send({ message: "User inserted successfully", result });
  } catch (err) {
    res.status(500).send("Error adding user");
  }
});
