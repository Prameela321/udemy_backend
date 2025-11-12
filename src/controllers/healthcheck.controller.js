import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/async-handler.js";

// const healthCheck = (req, res, next) => {
//   try {
//     res.status(200).json(new ApiResponse(200, { message: "Server Running" }));
//   } catch (err) {
//     next(err);
//   }
// };

// updated with improvements

const healthCheck = asyncHandler((req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "server running" }));
});
export { healthCheck };
