import databaseClient from "../../../../database/client";
import type { Result, Rows } from "../../../../database/client";

export type user = {
  id: number;
  username: string;
  email: string;
  password: string;
  amount: string;
};

class UserRepository {
  async create(user: Omit<user, "id">) {
    const connection = await databaseClient.getConnection();
    try {
      const [result] = await connection.execute<Result>(
        "INSERT INTO user (username, email, password, amount) VALUES (?, ?, ?, ?)",
        [user.username, user.email, user.password, user.amount],
      );

      return result.insertId; // Retourne l'ID du nouvel utilisateur
    } finally {
      connection.release(); // Libère toujours la connexion
    }
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from user where id = ?",
      [id],
    );

    return rows[0] as user;
  }

  async readAll() {
    const [rows] = await databaseClient.execute<Rows>("select * from user");

    return rows as user[];
  }

  async update(id: number, user: Omit<user, "id">) {
    const [result] = await databaseClient.execute<Result>(
      "update user set username = ?, email = ?, password = ?, amount = ? where id = ?",
      [user.username, user.email, user.password, user.amount, id],
    );

    return result.affectedRows > 0;
  }
  async delete(id: number) {
    const [result] = await databaseClient.execute<Result>(
      "delete from user where id = ?",
      [id],
    );

    return result.affectedRows > 0;
  }
}

export default new UserRepository();
