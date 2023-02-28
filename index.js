const express = require("express");
const cors = require("cors");
const User = require("./config");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const snapshot = await User.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});
// app.post("/create", async (req, res) => {
//   const data = req.body;
//   //   console.log("data of user", data);
//   await User.add(data);
//   res.send({ msg: "User Added" });
// });
app.post("/post", async (req, res) => {
  try {
    const data = req.body;

    // Save the data to Firebase
    const result = await User.add(data);
    // Send a success response to the client
    res.status(200).send(`Post created with ID: ${result.id}`);
  } catch (error) {
    // Handle errors and send an error response to the client
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
app.post("/delete", async (req, res) => {
  const id = req.body.id;
  await User.doc(id).delete();
  res.send({ msg: "Deleted" });
});
app.post("/update", async (req, res) => {
  const id = req.body.id;
  delete req.body.id;
  const data = req.body;
  await User.doc(id).update(data);
  res.send({ msg: "Updated" });
});

app.listen(4000, () => console.log("Up and running *4000"));
