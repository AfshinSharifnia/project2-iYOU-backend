import mongoose from "mongoose";

// the info we will store for our users
// please add more fields as needed below
const userSchema = new mongoose.Schema({
  firstName: String,
  // lastName: String,
  displayName: String,
  basecampId: String,
  linkedInURL: String,
  accessToken: String,
  anotherField: String, //TESTING updateProfile endpoint
  q0: String,
  q1: String,
  q2: String,
  q3: String,
  q4: String,
  q5: String,
  q6: String,
  q7: String,
  q8: String,
  q9: String,
  q10: String,
  q11: String,
  githubURL: String,
  careerBlueprint: String,
  hometown: String,
  faveFood: String,
  tagline: String,
  birthDate: Date,
  luminaURL: String,
  avatarURL: String,
  pronouns: String,
});

export const User = mongoose.model("user", userSchema);
