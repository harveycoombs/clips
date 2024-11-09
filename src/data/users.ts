import jwt from "jsonwebtoken";
import argon2 from "argon2";

import { connectionPool } from "./database";

const pool = connectionPool();

export class Users {
    static async getUsers(offset: number=0): Promise<any> {
        let [result]: any = await pool.query("SELECT userid, firstname, lastname, (SELECT COUNT(*) FROM posts WHERE userid = users.userid AND deleted = 0) AS totalposts FROM users ORDER BY firstname ASC, lastname ASC LIMIT 20 OFFSET ?", [offset]);

        let connection = await pool.getConnection();
        connection.release();

        return result;
    }

    static async getUser(identifier: number|string): Promise<any> {
        let field = (typeof identifier == "number") ? "userid" : "email";

        let [result]: any = await pool.query(`SELECT userid, creationdate, firstname, lastname, biography, location FROM users WHERE ${field} = ? AND deleted = 0`, [identifier]);

        let connection = await pool.getConnection();
        connection.release();

        return result[0];
    }

    static async createUser(firstName: string, lastName: string, email: string, password: string): Promise<number> {
        let passwordHash = await Passwords.generateHash(password);

        let [result]: any = await pool.query("INSERT INTO users (creationdate, firstname, lastname, email, password) VALUES((SELECT NOW()), ?, ?, ?, ?)", [firstName, lastName, email, passwordHash]);

        let connection = await pool.getConnection();
        connection.release();

        return result?.insertId ?? 0;
    }

    static async getTotalUsers(): Promise<number> {
        let [result]: any = await pool.query("SELECT COUNT(*) AS total FROM users");

        let connection = await pool.getConnection();
        connection.release();

        return result[0].total;
    }

    static async getPasswordHash(identifier: string|number): Promise<string> {
        let field = (typeof identifier == "number") ? "userid" : "email";

        let [result]: any = await pool.query(`SELECT password FROM users WHERE ${field} = ?`, [identifier]);

        let connection = await pool.getConnection();
        connection.release();

        return result[0]?.password;
    }

    static async verifyCredentials(email: string, password: string): Promise<boolean> {
        let hash = await this.getPasswordHash(email);

        if (!hash?.length) return false;

        let valid = await Passwords.verify(password, hash);
        return valid;
    }

    static async emailExists(email: string): Promise<boolean> {
        let [result]: any = await pool.query("SELECT COUNT(*) AS total FROM users WHERE email = ?", [email]);

        let connection = await pool.getConnection();
        connection.release();

        return result[0].total;
    }
}

export class JWT {
    static async authenticate(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!token) {
                resolve(null);
            }

            jwt.verify(token, process.env.JWT_SECRET as string, async (ex: any, user: any) => {
                if (ex) {
                    reject(ex.message);
                }

                user = await Users.getUser(user.userid);
                resolve(user);
            });
        });
    }

    static create(user: any) {
        let now = new Date();
        return { token: jwt.sign(JSON.stringify(user), process.env.JWT_SECRET as string), timestamp: now.getTime() };
    }

    static destroy() {
        //to-do
    }
}

class Passwords {
    static async generateHash(raw: string): Promise<string> {
        try {
            let hash = await argon2.hash(raw);
            return hash;
        } catch (ex) {
            throw ex;
        }
    }

    static async verify(password: string, hash: string): Promise<boolean> {
        try {
            let result = await argon2.verify(hash, password);
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}