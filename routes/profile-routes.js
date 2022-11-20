import { Router } from "express";

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

// logged-in
router.get("/", (req, res) => {
  res.send("you are logged in and this is your profile - " + req.user);
  //   res.render('profile', { user: req.user });
});

export default router;
