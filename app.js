require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const mainRoutes = require("./server/routes/index");
const authRoutes = require("./server/routes/auth");
const dashboardRoutes = require("./server/routes/dashboard");
const connectDB = require("./server/config/db");
// const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser(process.env.COOKIE_SIGN));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGODB_URL,
    // }),
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(flash());
connectDB();

// Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", mainRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
