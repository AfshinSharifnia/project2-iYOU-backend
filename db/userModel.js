import mongoose from "mongoose";

// the info we will store for our users
// please add more fields as needed below
const userSchema = new mongoose.Schema({
  firstName: String,
  // lastName: String,
  displayName: String,
  basecampId: String,
  linkedInURL: String,
});

export const User = mongoose.model("user", userSchema);
