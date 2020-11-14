import fetch from "./fetch";
// 分类文章列表
export const apiPostByCateID = (cid, data) => {
	return fetch.get(`/api/v1/cate/${cid}/posts`, { params: data });
};
// 页面信息
export const apiPostAll = () => {
	return fetch.get("/api/v1/posts");
};
// 一条信息
export const apiPostGet = id => {
	return fetch.get(`/api/v1/post/${id}`);
};
export const apiPostGetFuzzy = data => {
	return fetch.get(`/api/v1/posts`, { params: data });
};
// 一条文章的tag信息列表
export const apiPostTagGet = id => {
	return fetch.get(`/api/v1/post/${id}/tags`);
};
//删除
export const apiPostDrop = id => {
	return fetch.delete(`/api/v1/post/${id}`);
};
//文章操作
export const apiPostAddOrEdit = data => {
	return fetch.post(`/api/v1/post`, data);
};
