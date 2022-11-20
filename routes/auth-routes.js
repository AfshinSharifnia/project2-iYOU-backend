import { Router } from "express";
import passport from "passport";

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
  function (req, res) {
    res.redirect("http://localhost:3000/"); //TO REACT
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
