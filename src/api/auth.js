import fetch from "./fetch";

export const apiLogin = data => {
	return fetch.post("/api/v1/login", data);
};
export const apiAuth = () => {
	return fetch.get("/api/v1/auth");
};
export const apiCollect = () => {
	return fetch.get("/api/v1/collect");
};
export const apiSys = () => {
	return fetch.get("/api/v1/sys");
};
