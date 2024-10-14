import { connectionPool } from "./database";

const pool = connectionPool();

export class Users {
    static async getUsers(offset: number=0): Promise<any> {
        let [result]: any = await pool.query("SELECT userid, firstname, lastname, (SELECT COUNT(*) FROM posts WHERE userid = users.userid AND deleted = 0) AS totalposts FROM users ORDER BY firstname ASC, lastname ASC LIMIT 20 OFFSET ?", [offset]);

        let connection = await pool.getConnection();
        connection.release();

        return result;
    }

    static async getUser(userid: number): Promise<any> {
        let [result]: any = await pool.query("SELECT userid, creationdate, firstname, lastname, biography, location FROM users WHERE userid = ?", [userid]);

        let connection = await pool.getConnection();
        connection.release();

        return result[0];
    }

    static async getUserDetails(): Promise<any> {
        let result = await pool.query("");
    }

    static async getTotalUsers(): Promise<number> {
        let [result]: any = await pool.query("SELECT COUNT(*) AS total FROM users");

        let connection = await pool.getConnection();
        connection.release();

        return result[0].total;
    }
}