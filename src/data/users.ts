"use server";
import pool from "./database";
import * as Passwords from "./passwords";

export async function getUsers(offset: number = 0): Promise<any> {
	let [result]: any = await pool.query("SELECT userid, firstname, lastname, (SELECT COUNT(*) FROM posts WHERE userid = users.userid AND deleted = 0) AS totalposts FROM users ORDER BY firstname ASC, lastname ASC LIMIT 20 OFFSET ?", [offset]);
	return result;
}

export async function getUserByID(userid: number): Promise<any> {
	let [result]: any = await pool.query("SELECT userid, creationdate, username, firstname, lastname, biography, location FROM users WHERE userid= ? AND deleted = 0", [userid]);
	return result[0];
}

export async function getUserByEmailAddress(email: string): Promise<any> {
    let [result]: any = await pool.query("SELECT userid, creationdate, username, firstname, lastname, biography, location FROM users WHERE email= ? AND deleted = 0", [email]);
    return result[0];
}

export async function getUserByUsername(username: string): Promise<any> {
	let [result]: any = await pool.query("SELECT userid, creationdate, username, firstname, lastname, biography, location FROM users WHERE username= ? AND deleted = 0", [username]);
	return result[0];
}

export async function createUser(firstName: string, lastName: string, username: string, email: string, password: string): Promise<number> {
	let passwordHash = await Passwords.generateHash(password);

	let [result]: any = await pool.query("INSERT INTO users (creationdate, firstname, lastname, username, email, password) VALUES((SELECT NOW()), ?, ?, ?, ?, ?)", [firstName, lastName, username, email, passwordHash]);

	return result?.insertId ?? 0;
}

export async function getTotalUsers(): Promise<number> {
	let [result]: any = await pool.query("SELECT COUNT(*) AS total FROM users");
	return result[0].total;
}

export async function getPasswordHash(identifier: string | number): Promise<string> {
	let field = typeof identifier == "number" ? "userid" : "email";

	let [result]: any = await pool.query(`SELECT password FROM users WHERE ${field} = ?`, [identifier]);

	return result[0]?.password;
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
	let hash = await getPasswordHash(email);

	if (!hash?.length) return false;

	let valid = await Passwords.verify(password, hash);
	return valid;
}

export async function emailExists(email: string): Promise<boolean> {
	let [result]: any = await pool.query("SELECT COUNT(*) AS total FROM users WHERE email = ?", [email]);
	return result[0].total;
}

export async function usernameExists(username: string): Promise<boolean> {
    let [result]: any = await pool.query("SELECT COUNT(*) AS total FROM users WHERE username = ?", [username]);
    return result[0].total;
}

export async function searchUsers(query: string, offset: number=0): Promise<any[]> {
    let [result]: any = await pool.query("SELECT userid, username, firstname, lastname, (SELECT COUNT(*) FROM posts WHERE userid = users.userid AND deleted = 0) AS totalposts FROM users WHERE CONCAT(firstname, ' ', lastname) LIKE ? OR username LIKE ? ORDER BY firstname ASC, lastname ASC LIMIT 20 OFFSET ?", [`%${query}%`, `%${query}%`, offset]);
    return result;
}