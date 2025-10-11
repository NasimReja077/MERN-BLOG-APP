// Backend/src/controllers/auth.controller.js
import { User } from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";
import {deleteFromCloudinary, uploadToCloudinary} from "../middleware/uploadHandler.js";
import { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";

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
    });
    
    await user.save();


    // Generate and set JWT token
    const token = generateToken(user._id, res);

    res.status(201).json({
      message: "User registered successfully",
      user: user.toJSON(), // Removes password via toJSON method
      token,
    });

  } catch (error) {
    res.status(500).json({
      error: 'Registration failed',
      message: error.message,
    });
  }
};



// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate and set JWT token
    const token = generateToken(user._id, res);

    res.json({
      message: 'Login successful',
      user: user.toJSON(), // Remove password
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
};




// Logout user
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0});
    res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    res.status(500).json({
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
    res.json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
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
      return res.status(401).json({ error: "Unauthorized", message: "User not authenticated" });
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
      return res.status(404).json({ error: "User not found"});
    }

     res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
  } catch (error) {
    res.status(500).json({
      error: 'Profile update failed',
      message: error.message
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
        error: "No file uploaded",
        message: "Please select an image file to upload",
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

      res.json({
      message: "Avatar uploaded successfully",
      user: user.toJSON(),
    });

  } catch (error) {
    console.error("Error in uploadAvatarHandler:", error.message);
    res.status(500).json({
      error: "Failed to upload avatar",
      message: error.message,
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
        error: "No file uploaded",
        message: "Please select an image file to upload",
      });
    }

    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({ error: "User not Found" });
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

    
    res.json({
      message: "Cover image uploaded successfully",
      user: user.toJSON(),
    });

  } catch (error) {
    console.error("Error in uploadAvatarHandler:", error.message);
    res.status(500).json({
      error: "Failed to upload avatar",
      message: error.message,
    });
  }
}

