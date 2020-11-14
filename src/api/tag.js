import fetch from "./fetch";
// 标签信息
export const apiTagAll = () => {
	return fetch.get("/api/v1/tags");
};
// 添加标签
export const apiTagAdd = data => {
	return fetch.post(`/api/v1/tag`, data);
};
// 修改标签
export const apiTagEdit = data => {
	return fetch.patch(`/api/v1/tag`, data);
};
// 删除标签
export const apiTagDrop = id => {
	return fetch.delete(`/api/v1/tag/${id}`);
};
