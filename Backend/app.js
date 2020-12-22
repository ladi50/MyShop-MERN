const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const HttpError = require("./utils/ErrorHandler/errorHandler");
const usersRoutes = require("./routes/users");
const productsRoutes = require("./routes/shop");

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", [
    "Content-Type",
    "Authorization"
  ]);
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);

app.use((req, res, next) => {
  const error = new HttpError({ message: "Page not found!" });
  next(error);
});

app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(path.join(__dirname, req.file.path), () => {
      if (err) {
        console.log(err);
      }
    });
  }

  if (res.headerSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || "An error occured!";
  res.status(status).json({ message });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@myshop.3hotx.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => app.listen(process.env.PORT || 5000))
  .catch((err) => {
    throw new Error(err);
  });
