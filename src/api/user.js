import fetch from "./fetch";

//修改自己密码
export const apiUserPass = data => {
	return fetch.patch("/api/v1/user/passwd", data);
};
//修改自己信息
export const apiUserEdit = data => {
	return fetch.patch("/api/v1/user", data);
};
