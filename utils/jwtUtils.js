import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      user_id: user.user_id,
      username: user.username,
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};