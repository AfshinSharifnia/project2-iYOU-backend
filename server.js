import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport"; //using v.5 to work with cookie-session
import cookieSession from "cookie-session";
import passportStrategy from "passport-37signals";

const Thirty7SignalsStrategy = passportStrategy.Strategy;

// for PASSPORT
import { User } from "./db/userModel.js";

// authorization endpoints
import authRoute from "./routes/auth-routes.js";
import profileRoute from "./routes/profile-routes.js";

dotenv.config();

// SERVER PORT
const PORT = process.env.PORT || 4000;

// --------------
// PASSPORT SETUP
// --------------

// cookies (i think)
passport.serializeUser(function (user, done) {
  console.log("USER:", user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("ID:", id);
  User.findById(id).then((user) => {
    done(null, user);
  });
});

//
passport.use(
  new Thirty7SignalsStrategy(
    {
      clientID: process.env.THIRTY7SIGNALS_CLIENT_ID,
      clientSecret: process.env.THIRTY7SIGNALS_SECRET_ID,
      callbackURL: "/api/auth/37signals/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // check if user already exists in db based on id
      User.findOne({ basecampId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // if already have user
          console.log("user is: ", currentUser);
          done(null, currentUser);
        } else {
          // if not, create user in db
          new User({
            firstName: profile.name.givenName,
            displayName: profile.displayName,
            basecampId: profile.id,
          })
            .save()
            .then((newUser) => {
              console.log("new user created: " + newUser);
              done(null, newUser);
            });
        }
      });
    },
  ),
);

// --------------
// MONGODB SETUP
// --------------

async function main() {
  await mongoose
    .connect(
      process.env.MONGODB_URI,

      {
        dbName: process.env.MONGODB_DBNAME,

        user: process.env.MONGODB_USER,

        pass: process.env.MONGODB_PASSWORD,
      },
    )
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
}

main();

// --------------
// EXPRESS SERVER setup
// --------------
const app = express();

// cookies for authentication
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["keyCatsyJang"], //this string doesn't matter
  }),
);

// Initialize Passport!
app.use(passport.initialize());
app.use(passport.session());

// router for auth routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);

// SERVER - start and listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
