import mongoose from "mongoose";

const userCareerProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  current_skills: { type: [String], default: [] },
  experience: { type: String, default: "" },
  volunteer_work: { type: String, default: "" },
  education_history: { type: String, default: "" },

  programme: { type: String },
  education_level: {
    type: String,
    enum: [
      "first_year",
      "second_year",
      "third_year",
      "fourth_year",
      "fifth_year",
      "sixth_year",
    ],
  },
  education_duration: { type: Number, min: 1, max: 10 }, // Duration in years

  dream_job: { type: String },
  resume_url: { type: String },
  resume_text: { type: String, default: "" },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userCareerProfileSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model("UserCareerProfile", userCareerProfileSchema);
