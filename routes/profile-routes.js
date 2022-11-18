import { Router } from "express";

const router = Router();

// AUTH RECHECK
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

// router.get('/', authCheck, (req, res) => {
// 	res.render('profile', { user: req.user });
// });

// THANK FOR LOGGING - CLOSE THIS WINDOW - for front end
router.get("/", (req, res) => {
  res.send("you are logged in and this is your profile - " + req.user);
  //   res.render('profile', { user: req.user });
});

export default router;
