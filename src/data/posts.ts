"use server";
import pool from "./database";

export async function getPosts(offset: number=0, userid=0): Promise<any> {
    let userFilter = userid ? " AND userid = ?" : "";
    let params = userid ? [userid, offset] : [offset];

    let [result]: any = await pool.query(`SELECT postid, publishdate, title FROM posts WHERE deleted = 0${userFilter} ORDER BY publishdate DESC LIMIT 16 OFFSET ?`, params);

    return result;
}

export async function getPost(postid: number): Promise<any> {
    let [result]: any = await pool.query("SELECT postid, publishdate, userid, title, description, category FROM posts WHERE postid = ?", [postid]);
    return result[0];
}

export async function createPost(userid: number, title: string, description: string, category: string): Promise<number> {
    let [result]: any = await pool.query("INSERT INTO posts (publishdate, userid, title, description, category) VALUES((SELECT NOW()), ?, ?, ?, ?)", [userid, title, description, category]);
    return result?.insertId ?? 0;
}

export async function getCategories(): Promise<any[]> {
    let [result]: any = await pool.query("SELECT DISTINCT category FROM posts WHERE deleted = 0 AND category IS NOT NULL AND category != ''");
    return result;
}

export async function searchPosts(query: string, offset: number=0): Promise<any[]> {
    let [result]: any = await pool.query("SELECT postid, publishdate, title FROM posts WHERE deleted = 0 AND title LIKE ? ORDER BY publishdate DESC LIMIT 20 OFFSET ?", [`%${query}%`, offset]);
    return result;
}