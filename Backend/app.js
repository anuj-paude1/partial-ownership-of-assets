const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongooseConnection = require("./mongoAtlasConnection");
const indexRouter = require("./routes/index");
const gsRouter = require("./routes/gold_silver");
const extraRouter = require("./routes/extra");
const cors = require("cors");
const auth = require("./utils/auth");
const app = express();


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", gsRouter);
app.use("/", extraRouter);
app.use("/login", auth);

app.use((err, req, res, next) => {
  res.status(err.status).send(err.message);
});

module.exports = app;
