import jwt from "jsonwebtoken";
import * as Users from "./users";

export async function authenticate(token: string): Promise<any> {
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

export function createJWT(user: any) {
	let now = new Date();
	return {
		token: jwt.sign(JSON.stringify(user), process.env.JWT_SECRET as string),
		timestamp: now.getTime(),
	};
}

export function destroy() {
	//to-do
}
