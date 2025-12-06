import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/async-handler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
// import { JsonWebTokenError } from "jsonwebtoken";
import { emailVerificationMailGenContent } from "../utils/mail.js";
import { sendEmail } from "../utils/mail.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with Email Or Username Already Exist", []);
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });
  // await sendEmail({
  //   email: user?.email,
  //   subject: "please verify you email",
  //   mailgenContent: emailVerificationMailGenContent(
  //     user.username,
  //     `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
  //   ),
  // });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "user registered successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email) {
    throw new apiError(400, "email is  required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(400, "User doen't exist");
  }

  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    throw new apiError(400, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  const loggedIn = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerficationExpiry",
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedIn,
          accessToken,
          refreshToken,
        },
        "user loggedin successfully",
      ),
    );
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(1);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    console.log(accessToken);
    console.log(refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new apiError(
      500,
      "something went wrong while generating the access token",
    );
  }
};

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const getCurrentUser = asyncHandler((req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "data sent successfully"));
});

const verifyEmail = asyncHandler(async(req,res)=>{
  const {verificationToken} = req.params;

  if(!verificationToken){
    throw new apiError(200,"Email verification token is misssing")
  }
  
  let hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest("hex")

    const user = await User.findOne({
      emailVerificationToken :  hashedToken,
      emailVerificationExpiry : {$gt : Date.now()}
    })

    if(!user){
      throw new apiError(400,"Token is invalid or expired")
    }

})
// const  changeCurrentPassword = asyncHandler((req,res)=>{
//     const {oldPassword, newPassword} = req.body;
//         await User.findById( )
// })

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  // changeCurrentPassword
};
