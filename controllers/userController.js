import db from "../config/database.config.js";

export const getuser = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

  try {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}