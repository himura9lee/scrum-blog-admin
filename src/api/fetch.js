import axios from "axios";
import Util from "@/utils.js";
import ViewUI from "view-design";

const fetch = axios.create({
	baseURL: process.env.VUE_APP_SRV,
	timeout: 30000
});
//添加一个请求拦截器
fetch.interceptors.request.use(
	function(config) {
		ViewUI.LoadingBar.start();
		//在请求发出之前进行一些操作
		console.log("send");
		if (config.url.indexOf("/api/v1/login") == -1) {
			config.headers.Authorization = "Bearer " + Util.getItem("bearer"); //Bearer
		}
		return config;
	},
	function(err) {
		//Do something with request error
		return Promise.reject(err);
	}
);
//添加一个响应拦截器
fetch.interceptors.response.use(
	function(res) {
		ViewUI.LoadingBar.finish();
		console.log("recv");
		if (res.data.code == 401) {
			location.href = "/#/401";//没有权限
		}
		if (res.data.code == 403) {
			Util.clearData();
			location.href = "/#/jwt";//需要重新登陆
		}
		if (res.data.code == 404) {
			location.href = "/#/404";//页面不存在
		}
		// if (res.data.code == 400) {
		// 	location.href = "/#/400";//请求错误
		// }
		if (res.data.code == 500) {
			location.href = "/#/500";//服务器异常
		}
		return res.data;
	},
	function(err) {
		ViewUI.Notice.error({
			duration: 5,
			title: "系统提醒",
			desc: "请求失败,请重试"
		});
		return new Promise(() => {});
		//return Promise.reject(err);
	}
);
export default fetch;
