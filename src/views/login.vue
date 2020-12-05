<style lang="less" scoped>
@import "./login.less";
</style>
<template>
	<div class="login" @keydown.enter="submit">
		<div class="top">
			<div class="header">
				<a>
					<img src="/head.png" class="logo" alt="logo">
					<span class="title">欢迎登陆</span>
				</a>
			</div>
			<div class="siteUrl">{{siteUrl}}</div>
		</div>
		<div class="main">
			<Form class="loginForm" ref="loginForm" :model="dataForm" :rules="rules">
				<FormItem prop="name">
					<Input size="large" prefix="ios-person-outline" type="text" v-model="dataForm.name" placeholder="请输入账号">
					</Input>
				</FormItem>
				<FormItem prop="passwd">
					<Input size="large" prefix="ios-lock-outline" type="password" v-model="dataForm.passwd" placeholder="请输入密码"/>
				</FormItem>
				<FormItem>
					<Button size="large" @click="submit" type="primary" style="width: 100%;" class="submitBtn">登录</Button>
				</FormItem>
			</Form>
		</div>
		<div class="footer">
			<div class="copyright">
				Copyright &copy; {{new Date().getFullYear()}}&nbsp;<a target="_blank" href="https://himura.xyz">himura.xyz</a>
			</div>
		</div>
	</div>
</template>
<script>
import { apiLogin, apiVcode } from "@/api/auth";
import Utils from "@/utils";
export default {
	data() {
		return {
			siteUrl: process.env.VUE_APP_ADMIN_SRV,
			dataForm: { name: "", passwd: "" },
			rules: {
				name: [{ required: true, message: "账号不能为空", trigger: "blur" }],
				passwd: [{ required: true, message: "密码不能为空", trigger: "blur" }]
			}
		};
	},
	methods: {
		submit() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					let data = {
						name: this.dataForm.name,
						passwd: this.dataForm.passwd
					};
					apiLogin(data).then(resp => {
						if (resp.code == 200) {
							this.$Message.success({
								content: "登陆成功",
								onClose: () => {
									Utils.setToken(resp.data);
									this.$router.push({ name: "home" });
								}
							});
						} else {
							this.reload();
							this.$Message.warning("登录失败，请核对用户名/密码！");
						}
					});
				}
			});
		}
	}
};
</script>