import databaseClient from "../../../../database/client";
import type { Result, Rows } from "../../../../database/client";

export type Expense = {
  id: number;
  amount: string;
  description: string;
  category: string;
  date: string;
  user_id: number;
};

class ExpenseRepository {
  async create(expense: Omit<Expense, "id">) {
    const connection = await databaseClient.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute<Result>(
        "insert into expense (amount, description, category, date, user_id) values (?, ?, ?, ?, ?)",
        [
          expense.amount,
          expense.description,
          expense.category,
          expense.date,
          expense.user_id,
        ],
      );
      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from expense where id = ?",
      [id],
    );

    return rows[0] as Expense;
  }

  async readAll() {
    const [rows] = await databaseClient.execute<Rows>("select * from expense");

    return rows as Expense[];
  }

  async update(id: number, expense: Omit<Expense, "id">) {
    const [result] = await databaseClient.execute<Result>(
      "update expense set amount = ?, description = ?,category = ?, date = ?, user_id = ? where id = ?",
      [
        expense.amount,
        expense.description,
        expense.category,
        expense.date,
        expense.user_id,
        id,
      ],
    );

    return result.affectedRows > 0;
  }

  async delete(id: number) {
    const [result] = await databaseClient.execute<Result>(
      "delete from expense where id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }
}
export default new ExpenseRepository();
