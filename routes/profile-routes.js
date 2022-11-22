import { Router } from "express";
// import token from "../server.js";
import fetch from "node-fetch";
import { User } from "../db/userModel.js";
// import mongoose from "mongoose";

const router = Router();

// AUTH RECHECK
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/api/auth/login");
  } else {
    next();
  }
};

// router.get('/', authCheck, (req, res) => {
// 	res.render('profile', { user: req.user });
// });

// logged-in TEMP ENDPOINT
router.get("/", (req, res) => {
  res.send("you are logged in and this is your profile - " + req.user);
  //   res.render('profile', { user: req.user });
});

router.get("/myProfile", async (req, res) => {
  console.log("REQUSER:", req.user);
  const basecampId = req.query.userId;
  console.log("BASECAMP USER ID: ", basecampId);
  console.log(typeof basecampId);
  let token;

  await User.findOne({ basecampId: basecampId }).then((currentUser) => {
    if (currentUser) {
      console.log("User found!");
      token = currentUser.accessToken;
      // currentUser.save().then(console.log("user is: ", currentUser));
      // done(null, currentUser);
    }
  });

  // TODO: fetch user from DB using basecampID
  console.log("TOKEN: ", token);
  const response = await fetch(
    `https://3.basecampapi.com/${process.env.INCEPTIONU_ACCOUNT}/my/profile.json`, //InceptionU account
    {
      headers: {
        "User-Agent": "iYou app (inceptionu.com)",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    },
  );
  if (response.ok) {
    const userInfo = await response.json();
    console.log("RESPONSE OK: ", userInfo);
    res.send(userInfo);
    return;
  } else {
    console.log(response);
    res.status(500).end();
  }
  // res.send("you are logged in and this is your profile - " + req.user);
  //   res.render('profile', { user: req.user });
});

export default router;
