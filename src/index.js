const express = require("express");
require("./db/mongoose");
const userRouter = require("./router/user");
const contactRouter = require("./router/contact");

const app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bodyparser = require("body-parser");
const port = process.env.PORT;
app.use(bodyparser.json());

app.use(userRouter);
app.use(contactRouter);

app.listen(port, () => {
  console.log("server is open on port" + port);
});
