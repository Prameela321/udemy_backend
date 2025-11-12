import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/async-handler";
import { apiError } from "../utils/apiError";
import User from "../models/user.model";
import { TokenExpiredError } from "jsonwebtoken";

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

    await user.save({validateBeforeSave: false})
});


const generateAccessAndRefreshTokens  = async(userId)=>{
  try{ 
      const user = await  User.findById(userId);

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({validateBeforeSave : false});
      return {accessToken, refreshToken}
  }catch(err){
      throw new apiError(500,
        "something went wrong while generating the access token"
      )
  }
}
const  changeCurrentPassword = asyncHandler((req,res)=>{
    const {oldPassword, newPassword} = req.body;
        await User.findById( )
})

export {
  registerUser,
  changeCurrentPassword
}
