import { Router } from "express";
import passport from "passport";
import { User } from "../db/userModel.js";

const router = Router();

// LOGOUT TODO
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000/");
});

// LOGIN AUTH from front end LOGIN page
router.get(
  "/37signals",
  passport.authenticate("37signals", {
    scope: ["profile"],
  }),
);

// REDIRECT after callback
router.get(
  "/37signals/callback",
  passport.authenticate("37signals"),
  async function (req, res) {
    const basecampId = req.user.basecampId;
    let userinfo;
    console.log("BASECAMP USER ID: ", basecampId);
    // console.log(typeof basecampId);
    await User.findOne({ basecampId: basecampId }).then((currentUser) => {
      if (currentUser) {
        console.log("User found!");
        userinfo = currentUser;
        return;
      } else {
        console.log(response);
        res.status(500).end();
      }
    });
    if (userinfo.firstLogin === "true")
      res.redirect("http://localhost:3000/edit");
    else res.redirect("http://localhost:3000/dashboard"); //TO REACT
    // res.send('got here');
    // res.send(req.user);
  },
);

// for FETCH
router.get("/", function (req, res) {
  // router.get("/", passport.authenticate("37signals"), function (req, res) {
  // res.redirect('/profile');
  // res.send('got here');
  console.log("REQ USER:", req.user);
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(401).send(); //unauthenticated
  }
});

export default router;
