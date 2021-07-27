const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const movieRoute = require("./routes/movie");
const listRoute = require("./routes/list");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.use("/server/auth", authRoute);
app.use("/server/users", userRoute);
app.use("/server/movie", movieRoute);
app.use("/server/lists", listRoute);

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
