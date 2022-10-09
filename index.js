import dotenv from "dotenv";
dotenv.config();
import express from "express";
import expressejsLayouts from "express-ejs-layouts";
import ejs from "ejs";
import path from "path";
import initRoutes from "./routes/web";
import mongoose from "mongoose";
import Menu from "./app/models/menu";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import passport from 'passport'
import passportInit from "./app/config/passport";

const app = express();

// static file
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

const dbName = process.env.dbName;
const dbUser = process.env.dbUser;
const dbPassword = process.env.dbPassword;

const url = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.es5vaf2.mongodb.net/${dbName}?retryWrites=true&w=majority`;
console.log(url);
// Database
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("DB Connected successfully");
});



//express-session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 }, //24hrs
    store: MongoStore.create({
      mongoUrl: url,
      collectionName: "sessions",
    }),
  })
);
app.use(flash());
// global middleares

// passport config
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

//set template
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

app.use(expressejsLayouts);

// web Routes
initRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server listenning on port ${PORT}`);
});
