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

// // logged-in TEMP ENDPOINT
// router.get("/", (req, res) => {
//   res.send("you are logged in and this is your profile - " + req.user);
//   //   res.render('profile', { user: req.user });
// });

// USED BY NAVBAR FOR PROFILE INFO
router.get("/myProfile", async (req, res) => {
  console.log("REQUSER:", req.user);
  const basecampId = req.user.basecampId;
  console.log("BASECAMP USER ID: ", basecampId);
  // console.log(typeof basecampId);
  let token;

  await User.findOne({ basecampId: basecampId }).then((currentUser) => {
    if (currentUser) {
      console.log("User found!");
      token = currentUser.accessToken;
      // currentUser.save().then(console.log("user is: ", currentUser));
      // done(null, currentUser);
    }
  });
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
    // res.send(currentUser);
    return;
  } else {
    console.log(response);
    res.status(500).end();
  }
});

// GET PROFILE DB FOR EDITING
router.get("/myProfileDB", async (req, res) => {
  console.log("REQUSER:", req.user);
  const basecampId = req.user.basecampId;
  console.log("BASECAMP USER ID: ", basecampId);
  // console.log(typeof basecampId);
  await User.findOne({ basecampId: basecampId }).then((currentUser) => {
    if (currentUser) {
      console.log("User found!");
      res.send(currentUser);
      return;
    } else {
      console.log(response);
      res.status(500).end();
    }
  });
});

// GET PROFILE DB FOR PROFILE PAGE
router.get("/profilePage", async (req, res) => {
  console.log("REQUSER:", req.user);
  const basecampId = req.query.userId;
  console.log("BASECAMP USER ID: ", basecampId);
  // console.log(typeof basecampId);
  await User.findOne({ basecampId: basecampId }).then((currentUser) => {
    if (currentUser) {
      console.log("User found!");
      res.send(currentUser);
      return;
    } else {
      console.log(response);
      res.status(500).end();
    }
  });
});

// TO UPDATE DB RECORDS - send query field and fieldData
router.get("/updateProfile", async (req, res) => {
  console.log("field is ", req.query.field);
  let field = req.query.field;
  let fieldData = req.query.fieldData;
  console.log(`field is ${field}, data is ${fieldData}`);
  let basecampID = req.user.basecampId;
  console.log(basecampID);
  User.findOne({ basecampId: basecampID }).then((currentUser) => {
    // console.log(profile);
    if (currentUser) {
      // if already have user
      currentUser[field] = fieldData;
      console.log(currentUser);
      currentUser
        .save()
        .then(console.log(`${field} updated with ${fieldData}`));
      res.send(currentUser);
      return;
    } else {
      // if not, create user in db
      console.log("missing db record, cannot update; please re-login");
      res.error("missing db record, cannot update; please re-login");
    }
  });
});

// GET LIST of PROFILES with IDs
router.get("/getList", async (req, res) => {
  console.log("REQUSER:", req.user);
  const basecampId = req.user.basecampId;
  console.log("BASECAMP USER ID: ", basecampId);
  let token;

  await User.findOne({ basecampId: basecampId }).then((currentUser) => {
    if (currentUser) {
      console.log("User found!");
      token = currentUser.accessToken;
      // currentUser.save().then(console.log("user is: ", currentUser));
      // done(null, currentUser);
    }
  });

  console.log("TOKEN: ", token);
  // console.log(typeof basecampId);

  await User.find({})
    .sort({ displayName: 1 })
    .then(async (userList) => {
      if (userList) {
        console.log("User list: ", userList);
        // FOR LOOP TO GET AVATARS
        for (const person of userList) {
          console.log("personID: ", person.basecampId);
          // console.log(typeof person.id);
          // const ID = person.id.toString();
          // console.log("ID ID ID", ID);
          const response = await fetch(
            `https://3.basecampapi.com/${process.env.INCEPTIONU_ACCOUNT}/people/${person.basecampId}.json`, //InceptionU account
            {
              headers: {
                "User-Agent": "iYou app (inceptionu.com)",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            },
          );
          if (response.ok) {
            const profile = await response.json();
            console.log("profile profile: ", profile);

            // await User.findOne({ basecampId: person.id }).then((currentUser) => {
            await User.findOne({ basecampId: person.id() }).then(
              (currentProfile) => {
                console.log("CURRENT USER: ", currentProfile);
                if (currentProfile) {
                  // if already have user
                  console.log("success for getting person record");
                  currentUser.avatarURL = profile.avatar_url;
                  console.log(currentProfile);
                  currentProfile
                    .save()
                    .then(
                      console.log(
                        person.id,
                        ` updated with `,
                        profile.avatar_url,
                      ),
                    );
                  res.send(currentProfile);
                } else return;
              },
              console.log("FAILED FAILED"),
            );
          }
        }
        res.send(userList);
        return;
      } else {
        //   console.log(response);
        //   res.status(500).end();
      }
    });
});

export default router;
