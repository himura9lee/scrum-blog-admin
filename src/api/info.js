import fetch from "./fetch";
// 获取基本配置项
export const apiInfoBase = () => {
	return fetch.get(`/api/v1/info`);
};
// 编辑某个配置项
export const apiInfoEdit = data => {
	return fetch.post("/api/v1/info", data);
};
