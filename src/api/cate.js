import fetch from "./fetch";
// 分类信息
export const apiCateAll = () => {
	return fetch.get("/api/v1/cates");
};
// 添加分类
export const apiCateAdd = data => {
	return fetch.post(`/api/v1/cate`, data);
};
// 修改分类
export const apiCateEdit = data => {
	return fetch.patch(`/api/v1/cate`, data);
};
// 删除分类
export const apiCateDrop = id => {
	return fetch.delete(`/api/v1/cate/${id}`);
};
