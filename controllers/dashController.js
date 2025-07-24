import db from "../config/database.config.js";

export const updateProfile = async (req, res) => {
  const { defaultMilkQuantity, defaultMilkPrice } = req.body;
  const username = req.user.username;

  if (!username || !defaultMilkQuantity || !defaultMilkPrice) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query =
      "UPDATE users SET milk_quantity_def = $1, milk_price_default = $2 WHERE username = $3";
    const values = [defaultMilkQuantity, defaultMilkPrice, username];
    await db.query(query, values);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addData = async (req, res) => {
  const { userId, milkQuantity, date } = req.body;

  if (!userId || !milkQuantity || !date) {
    return res
      .status(400)
      .json({ error: "All fields are required (userId, milkQuantity, date)" });
  }

  try {
    const query = `
      INSERT INTO logs (userid, quantity, date)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, milkQuantity, date];
    const result = await db.query(query, values);
    // console.log(result.rows[0]);
    res
      .status(201)
      .json({ message: "Data added successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateData = async (req, res) => {
  const { milkQuantity, date } = req.body;
  const username = req.user.username;
  if (!milkQuantity || !date) {
    return res
      .status(400)
      .json({ error: "Milk quantity and date are required" });
  }
  try {
    const query = `
            UPDATE logs
            SET quantity = $1
            WHERE username = $2 AND date = $3
            RETURNING *
        `;
    const values = [milkQuantity, username, date];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res
      .status(200)
      .json({ message: "Data updated successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEntry = async (req, res) => {
  const { date } = req.params;
  const username = req.user.username;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  try {
    const query = `
        SELECT * FROM logs
        WHERE username = $1 AND date = $2
        `;
    const values = [username, date];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No entry found for this date" });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching entry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllEntry = async (req, res) => {
  const { year } = req.params;
  const username = req.user.username;

  if (!year) {
    return res.status(400).json({ error: "Year is required" });
  }

  try {
    const query = `
        SELECT * FROM logs
        WHERE username = $1 AND EXTRACT(YEAR FROM date) = $2
        ORDER BY date DESC
        `;
    const values = [username, year];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No entries found for this year" });
    }

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching all entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}