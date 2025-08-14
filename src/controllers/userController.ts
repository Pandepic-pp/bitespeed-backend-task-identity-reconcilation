import { Request, Response } from "express";
import pool from "../db";

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Database error" });
  }
};
