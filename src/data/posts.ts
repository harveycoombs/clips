import { connectionPool } from "./database";

const pool = connectionPool();

export class Posts {
    static async getPosts(offset: number=0, userid=0): Promise<any> {
        let userFilter = userid ? " AND userid = ?" : "";
        let params = userid ? [userid, offset] : [offset];

        let [result]: any = await pool.query(`SELECT postid, publishdate, title FROM posts WHERE deleted = 0${userFilter} ORDER BY publishdate DESC LIMIT 16 OFFSET ?`, params);

        let connection = await pool.getConnection();
        connection.release();

        return result;
    }

    static async getPost(postid: number): Promise<any> {
        let [result]: any = await pool.query("SELECT postid, publishdate, userid, title, description, category FROM posts WHERE postid = ?", [postid]);

        let connection = await pool.getConnection();
        connection.release();
    
        return result[0];
    }

    static async createPost(userid: number, title: string, description: string, category: string): Promise<number> {
        let [result]: any = await pool.query("INSERT INTO posts (publishdate, userid, title, description, category) VALUES((SELECT NOW()), ?, ?, ?, ?)", [userid, title, description, category]);

        let connection = await pool.getConnection();
        connection.release();

        return result?.insertId ?? 0;
    }

    static async getCategories(): Promise<any[]> {
        let [result]: any = await pool.query("SELECT DISTINCT category FROM posts WHERE deleted = 0 AND category IS NOT NULL AND category != ''");

        let connection = await pool.getConnection();
        connection.release();

        return result;
    }
}