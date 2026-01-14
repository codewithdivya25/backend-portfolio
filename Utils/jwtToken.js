
export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateToken(); // ✅ function call

    res
      .status(statusCode)
      .cookie("token", token, {
          expires: new Date(
              Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
          secure: false,      // localhost
          sameSite: "lax"
      })
      .json({
          success: true,
          message,
          user,
      });
};
