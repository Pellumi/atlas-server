import UserCareerProfile from "../models/UserCareerProfile.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { extractContentFromFile } from "../utils/fileMethods.js";

const createOrUpdateCareerProfile = async (req, res, next) => {
  const {
    current_skills,
    experience,
    volunteer_work,
    education_history,
    programme,
    education_level,
    education_duration,
    dream_job,
  } = req.body;

  const user_id = req.user._id; // assuming you're using middleware to attach user

  let resume_url = null;
  let resume_text = null;

  if (req.uploadedFile) {
    const { fileUrl, fileExtension } = req.uploadedFile;

    resume_url = fileUrl;
    resume_text = await extractContentFromFile(
      fileUrl,
      fileExtension.toString()
    );
  }

  const updateData = {
    current_skills,
    experience,
    volunteer_work,
    education_history,
    programme,
    education_level,
    education_duration,
    dream_job,
    resume_url,
    resume_text,
    updated_at: new Date(),
  };

  const existing = await UserCareerProfile.findOne({ user_id });
  const profile = existing
    ? await UserCareerProfile.findOneAndUpdate(
        { user_id },
        { $set: updateData },
        { new: true }
      )
    : await UserCareerProfile.create({ user_id, ...updateData });

  res.status(200).json({ success: true, profile });
};

const getUserCareerProfile = async (req, res, next) => {
  const user_id = req.user._id;

  const profile = await UserCareerProfile.findOne({ user_id });

  if (!profile) {
    return next(ErrorHandler.NotFound("Career profile"));
  }

  res.status(200).json(profile);
};

const testUpload = async (req, res) => {
  const { fileName, fileExtension, fileUrl } = req.uploadedFile;

  const fileSummary = await extractContentFromFile(
    fileUrl,
    fileExtension.toString()
  );

  res.status(200).json({ fileName, fileExtension, fileUrl, fileSummary });
};

export { createOrUpdateCareerProfile, testUpload, getUserCareerProfile };
