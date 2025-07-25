import db from "../config/database.config.js";

export const updateProfile = async (req, res) => {
  const { defaultMilkQuantity, defaultMilkPrice } = req.body;
  const userId = req.user.user_id;

  if (!userId || !defaultMilkQuantity || !defaultMilkPrice) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query =
      "UPDATE users SET milk_quantity_def = $1, milk_price_default = $2 WHERE user_id = $3";
    const values = [defaultMilkQuantity, defaultMilkPrice, userId];
    await db.query(query, values);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addData = async (req, res) => {
  const { milkQuantity, date } = req.body;
  const userId = req.user.user_id;

  if (!userId || !milkQuantity || !date) {
    return res
      .status(400)
      .json({ error: "All fields are required (userId, milkQuantity, date)" });
  }

  // Validate date format
  const parsedDate = new Date(date);
  if (isNaN(parsedDate) || date !== parsedDate.toISOString().split('T')[0]) {
    return res.status(400).json({ error: "Invalid date format, use YYYY-MM-DD" });
  }

  try {
    const query = `
      INSERT INTO logs (userid, quantity, date)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, milkQuantity, date];
    const result = await db.query(query, values);
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
  const userId = req.user.user_id;

  if (!milkQuantity || !date) {
    return res
      .status(400)
      .json({ error: "Milk quantity and date are required" });
  }

  // Validate date format
  const parsedDate = new Date(date);
  if (isNaN(parsedDate) || date !== parsedDate.toISOString().split('T')[0]) {
    return res.status(400).json({ error: "Invalid date format, use YYYY-MM-DD" });
  }

  try {
    const query = `
      UPDATE logs
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP
      WHERE userid = $2 AND date = $3
      RETURNING *
    `;
    const values = [milkQuantity, userId, date];
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
  const userId = req.user.user_id;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  // Validate date format
  const parsedDate = new Date(date);
  if (isNaN(parsedDate) || date !== parsedDate.toISOString().split('T')[0]) {
    return res.status(400).json({ error: "Invalid date format, use YYYY-MM-DD" });
  }

  try {
    const query = `
      SELECT * FROM logs
      WHERE userid = $1 AND date = $2
    `;
    const values = [userId, date];
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
  const userId = req.user.user_id;

  if (!year) {
    return res.status(400).json({ error: "Year is required" });
  }

  // Validate year
  const parsedYear = parseInt(year, 10);
  if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > 9999) {
    return res.status(400).json({ error: "Invalid year format" });
  }

  try {
    const query = `
      SELECT * FROM logs
      WHERE userid = $1 AND EXTRACT(YEAR FROM date) = $2
      ORDER BY date DESC
    `;
    const values = [userId, parsedYear];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No entries found for this year" });
    }

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching all entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};