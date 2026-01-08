// Backend/src/controllers/auth.controller.js
import { User } from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";
import {deleteFromCloudinary, uploadToCloudinary} from "../middleware/uploadHandler.js";
import { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailer/emailService.js";
import { generateOTP } from "../utils/generateOTP.js";
import crypto from "crypto";
import { error } from "console";


// Register user
export const register = async (req, res) => {
  try {
    const { username, email, password, fullName, bio, address, mobile, aadhar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { aadhar: aadhar && aadhar }],
    });

    if (existingUser) {
      return res.status(400).json({
        succes: false,
        error: 'User already exists',
        message: 'Email, username, or Aadhar number is already taken'
      });
    }

    // Handle avatar and cover image uploads if provided
    let avatarUrl = null;
    let coverImageUrl = null;

    if(req.file?.avatar?.[0]){
      const avatarUpload = await uploadToCloudinary(req.files.avatar[0], CLOUDINARY_FOLDERS.AVATARS);
      avatarUrl = avatarUpload.url;
    }

    if(req.file?.coverImage?.[0]){
      const coverUplod = await uploadToCloudinary(req.files.coverImage[0], CLOUDINARY_FOLDERS.COVERS);
      coverImageUrl = coverUplod.url;
    }

    // Generate OTP
    const verificationCode = generateOTP();
    const verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15min

    // Create new user (password hashing handled by User model pre-save hook)
    const user = new User({
      username,
      email,
      password, // Plaintext password, hashed by pre-save hook
      fullName,
      bio,
      address,
      mobile,
      aadhar,
      avatar: avatarUrl,
      coverImage: coverImageUrl,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
    });
    
    await user.save();

    await sendVerificationEmail(user.email, verificationCode);

    // Generate and set JWT token
    const token = generateToken(user._id, res);

    res.status(201).json({
      succes: true,
      message: "User registered successfully, Check email for OTP.",
      user: user.toJSON(), // Removes password via toJSON method
      token,
    });

  } catch (error) {
    console.error("Rgistur Error:", error);
    res.status(500).json({
      succes: false,
      error: 'Registration failed',
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { code } = req.body;

    if(!code){
      return res.status(400).json({ 
        succes: false, 
        message: "OTP is Requred"
      });
    }
    const user = await User.findOne({
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now()},
    });

    if(!user){
      return res.status(400).json({ 
        succes: false, 
        message: "Invalid or expried OTP code",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user.username, user.email);

    res.status(200).json({
      succes: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    console.log("Error in veryfiey OTP", error);
    res.status(500).json({
      succes: false,
      message: error.message,
    });
  }
}

// Password Reset Request
export const forgotPasswordRequest = async (req, res) =>{
  try {
    const { email } = req.body;
    if(!email){
      return res.status(400).json({ 
        succes: false, 
        message: "Email is required" 
      })
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({
        succes: false,
        message: 'User not found with this email',
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetURL);
    res.status(200).json({
      succes: true,
      message: "Password reset link sent to your email"
    });
  } catch (error) {
    console.error('Forgot Password Resend verification error:', error);
    res.status(500).json({
      succes: false,
      message: "Failed to send password reset link",
      error: error.message,
    })
  }
}

//Reset Password Set
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if(!token || !newPassword){
      return res.status(400).json({
        succes: false,
         message: "Token and new password are required"
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now()},
    });

    if(!user){
      return res.status(400).json({
        succes: false, 
        message: "Invalid or expired token"
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    await sendResetSuccessEmail (user.email, user.username);

    res.status(200).json({
      succes: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("resetPassword error", error);
    res.status(500).json({
      succes: false,
      message: "Password reset failde"
    })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        succes: false,
        message: 'Email or password is incorrect',
        error: error.message,
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        succes: false,
        message: 'Email or password is incorrect',
        error: error.message,
      });
    }

    // Generate and set JWT token
    const token = generateToken(user._id, res);

    res.status(200).json({
      succes: true,
      message: 'Login successful',
      user: user.toJSON(), // Remove password
      token,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: 'Login failed',
      message: error.message
    });
  }
};



// Logout user
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0});
    res.status(200).json({ 
      succes: true, 
      message: "Logged out Successfully" 
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: 'Logout failed',
      message: error.message,
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "User not authenticated" });
    }
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      succes: true, 
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: "Failed to retrieve profile",
      message: error.message,
    });
  }
};



// Update user profile
export const updateProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user); // debag
    if (!req.user) {
      return res.status(401).json({ 
        succes: false,
        error: error.message, 
        message: "User Unauthorized. Please log in first.",
      });
    }
    // const { fullName, bio, avatar, address, mobile, aadhar } = req.body;
    const { fullName, bio, address, mobile, aadhar, avatar, coverImage } = req.body;

    // Check for Aadhar uniqueness if provided
    if (aadhar) {
      const existingUser = await User.findOne({
        aadhar,
        _id: { $ne: req.user._id }
      });
      if (existingUser) {
        return res.status(400).json({
          error: 'Aadhar number already taken'
        });
      }
    }

    // Handle avatar and cover image uploads or URLs
    // let avatarUrl = req.user.avatar; // Error: req.user is undefined
    let avatarUrl = req.user.avatar || null;
    let coverImageUrl = req.user.coverImage || null;

    if (req.files?.avatar?.[0]){
      // Delete old avatar if it exists
      if(req.user.avatar){
        const publicId = req.user.avatar.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`${CLOUDINARY_FOLDERS.AVATARS}/${publicId}`);
      }
      const avatarUpload = await uploadToCloudinary(req.files.avatar[0], CLOUDINARY_FOLDERS.AVATARS);
      
      avatarUrl = avatarUpload.url;
    }else if (avatar){
      avatarUrl = avatar;
    }


    if(req.files?.coverImage?.[0]){
      // Delete old cover image if it exists
      if(req.user.coverImage){
        const publicId = req.user.coverImage.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`${CLOUDINARY_FOLDERS.COVERS}/${publicId}`);
      }
      // const coverUplod = await uploadToCloudinary(req.file.coverImage[0], CLOUDINARY_FOLDERS.COVERS);
      const coverUplod = await uploadToCloudinary(req.files.coverImage[0], CLOUDINARY_FOLDERS.COVERS);

      coverImageUrl = coverUplod.url;
    } else if(coverImage){
      coverImageUrl = coverImage;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio, address, mobile, aadhar, avatar: avatarUrl, coverImage: coverImageUrl },
      { new: true, runValidators: true }
    ).select("-password");

    if(!updatedUser){
      return res.status(404).json({ 
        succes:false, 
        // error: "User not found"
        message: "User not found" 
      });
    }

     res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
        succes: true,      
      });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({
       success: false,
      message: "Profile update failed",
      error: error.message
    });
  }
};


// uplod User Avatar
export const uplodeUserAvatar = async(req, res) =>{
  //file uplod or not
  // Get current user
  // Upload new AvatarImage
  // Delete old Avatar image if exists
  // Update user with new Avatar image URL
  try {
    console.log('req.file:', req.file); //Debag
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image.",
        error: error.message
      });
    }

    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({error: "User not Found"});
    }

    // Delete old avatar if it exists
      if(user.avatar){
        const publicId = user.avatar.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`${CLOUDINARY_FOLDERS.AVATARS}/${publicId}`);
      }
      // Upload new avatar
      const avatarUpload = await uploadToCloudinary(req.file, CLOUDINARY_FOLDERS.AVATARS);

      // Update user with new avatar URL
      user.avatar = avatarUpload.url;
      await user.save();

      res.status(200).json({
        succes: true,
        message: "Avatar uploaded successfully",
        user: user.toJSON(),
    });

  } catch (error) {
    console.error("Upload Avatar Error:", error);
    res.status(500).json({
     success: false,
      message: "Failed to upload avatar",
      error: error.message
    });
  }
}

// Upload Cover Image

export const uploadUserCoverImage = async(req, res) =>{
  //file uplod or not
  // Get current user
  // Upload new CoverImage
  // Delete old cover image if exists
  // Update user with new cover image URL
  try {
    if (!req.file) {
      console.log('req.file:', req.file); //Debag
      return res.status(400).json({
        succes: false,
        message: "Please select an image file to upload",
        error: error.message, 
      });
    }

    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    // Delete old cover image if it exists
    if (user.coverImage) {
      const publicId = user.coverImage.split("/").pop().split(".")[0];
      await deleteFromCloudinary(`${CLOUDINARY_FOLDERS.COVERS}/${publicId}`);
    }
    // Upload new cover image
    const coverUpload = await uploadToCloudinary(req.file, CLOUDINARY_FOLDERS.COVERS);

    // Update user with new cover image URL
    user.coverImage = coverUpload.url;
    await user.save();

    
    res.status(200).json({
      succes: true,
      message: "Cover image uploaded successfully",
      user: user.toJSON(),
    });

  } catch (error) {
    console.error("Error in uploadAvatarHandler:", error.message);
    res.status(500).json({
      succes: false,
      error: "Failed to upload avatar",
      message: error.message,
    });
  }
}

// Get User By ID (Public Profile)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)){
      return res.status(400).json({
        success: false,
        message: "Invalide user ID format",
      });
    }

    // Find user and exclude sensitive fields
    const user = await User.findById(id)
    .select("-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordExpires -aadhar");

    if(!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });

  } catch (error) {
    console.error('Get User By ID Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message,
    })
  }
}