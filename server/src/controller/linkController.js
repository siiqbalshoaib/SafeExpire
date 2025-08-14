import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Link } from "../models/linkModel.js";
//import { ApiResponse } from "../utils/ApiResponse.js";

import validator from "validator"; // For extra validation
// import mime from "mime-types";
// import axios from 'axios';

import { nanoid } from "nanoid";
//import { promisify } from "util";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// getting form data for creating link
const generateLinkText = asyncHandler(async (req, res) => {
  const { text, maxClicks, expiresAt, password, restrictedIp } = req.body;

  if (
    [text, maxClicks, expiresAt].some(
      (field) => String(field).trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userId = req.user?._id || null;
  const createdUrl = nanoid(9);

  // changing expire in
  const calculateExpiryDate = (duration) => {
    const now = new Date();
    const durations = {
      "5 Minutes": 5 * 60 * 1000,
      "10 Minutes": 10 * 60 * 1000,
      "30 Minutes": 30 * 60 * 1000,
      "1 Hour": 60 * 60 * 1000,
      "1 Day": 24 * 60 * 60 * 1000,
    };
    return durations[duration] ? new Date(now.getTime() + durations[duration]) : null;
  };

  let originalText;
  console.log("Received file:", req.file);
  if (req.file) {
    const documentLocalFilePath = req.file.path;
   

    const uploadedFile = await uploadOnCloudinary(documentLocalFilePath);
    console.log("Uploaded file:", uploadedFile);
    if (!uploadedFile) {
      throw new ApiError(500, "Something went wrong on uploading file");
    }

    originalText = uploadedFile.url;
  } else if (text){
    originalText = text;
  }else{
    throw new ApiError(400, "Text or file is required");
  }

  const newLink = await Link.create({
    userId,
    createdUrl,
    originalText,
    maxClicks: Number(maxClicks),
    expiresAt: calculateExpiryDate(expiresAt),
    password: password || null,
    restrictedIp: restrictedIp || null,
  });

  if (!newLink) {
    throw new ApiError(500, "Something went wrong while creating the link");
  }

  return res.status(201).json({
    success: true,
    message: "Link Created Successfully",
    data: {
      // link: `${process.env.BASE_URL}/s/${createdUrl}`,
      link: createdUrl,
      id: createdUrl,
    },
  });
});




 const viewLink = asyncHandler(async (req, res) => {
  const {createdUrl} = req.params;

  // Client IP extraction (supporting proxies)
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.connection?.remoteAddress ||
    req.ip;

  // Validate linkId format
  if (!validator.isAlphanumeric(createdUrl)) {
    throw new ApiError(400, "Invalid link identifier");
  }

  // Fetch link securely
  const link = await Link.findOne(createdUrl).lean();
  if (!link) {
    throw new ApiError(404, "Link not found");
  }

  // Check expiry date
  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    throw new ApiError(410, "Link expired");
  }

  // Check maximum click limit
  if (link.maxClicks && link.maxClicks > 0 && link.clicks >= link.maxClicks) {
    throw new ApiError(429, "Maximum click limit reached");
  }

  // Check IP restriction
  if (link.restrictedIp && link.restrictedIp !== clientIp) {
    throw new ApiError(403, "Access denied for this IP");
  }

  // Check password protection
  if (link.passwordHash) {
    const providedPassword = req.body.password || req.query.password;
    if (!providedPassword) {
      return res.status(401).json({
        success: false,
        passwordRequired: true,
        message: "Password required to access this link",
      });
    }
    const bcrypt = await import("bcrypt");
    const isPasswordValid = await bcrypt.compare(
      providedPassword,
      link.passwordHash
    );
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }
  }

  // Increment click count securely
  await Link.updateOne({  createdUrl }, { $inc: { clicks: 1 } });

  // Hide sensitive fields before sending response
  const safeLink = {
    content: link.content,
    contentType: link.contentType,
    createdAt: link.createdAt,
    expiresAt: link.expiresAt || null,
    remainingClicks:
      link.maxClicks > 0 ? link.maxClicks - link.clicks - 1 : null,
  };

  res.status(200).json({
    success: true,
    data: safeLink,
  });
});




export {
    generateLinkText,
    viewLink}
