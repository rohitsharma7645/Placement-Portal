import database from "../config/firebase.js";

export const registerUser = async (request, response, next) => {
  try {
    await database.ref("users").push(request.body);
    response.json({ success: true, message: "User Registered" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (request, response, next) => {
  try {
    const users = await database.ref("users").get();
    if (!users.exists()) {
      return response.json({ success: false, message: "No user found" });
    }

    const { email, password } = request.body || {};
    const matchedUser = Object.values(users.val()).find(
      (user) => user?.email === email && user?.password === password,
    );

    if (matchedUser) {
      return response.json({
        success: true,
        message: "Login Successful",
        user: matchedUser,
      });
    }

    return response.json({ success: false, message: "Invalid Credentials" });
  } catch (error) {
    return next(error);
  }
};
