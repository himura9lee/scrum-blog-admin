<style lang="less">
@import "./article.less";
</style>
<template>
	<div>
		<Card dis-hover>
			<Row :gutter="2">
				<Col span="20">
				<Form ref="dataForm" :rules="dataRules" :model="dataForm">
					<FormItem style="margin-bottom:15px" prop="title">
						<Input v-model="dataForm.title" placeholder="请输入标题"></Input>
					</FormItem>
					<FormItem style="margin-bottom:15px">
						<Row>
							<Button type="info" @click="cmtDraft" :loading="draftLoading">
								<Icon type="ios-trash" size="20" />存草稿</Button>&nbsp;
							<Button type="warning" @click="cmtPublish" :loading="publishLoading">
								<Icon type="ios-send" size="20" />发 布</Button>
						</Row>
					</FormItem>
				</Form>
				<div style="min-height: 600px;height: calc(100vh - 145px);">
					<button ref="diy" type="button" @click="diyMore" class="op-icon ivu-icon ivu-icon-md-code" aria-hidden="true" title="更多"></button>
					<mavon-editor ref="md" @imgAdd="imgAdd" :boxShadow="false" :toolbars="toolbars" v-model="dataForm.markdown_content" style="height:100%" :tabSize=4>
					</mavon-editor>
				</div>
				</Col>
				<Col span="4">
				<Card dis-hover :bordered="false">
					<p slot="title">
						<Icon type="ios-settings-outline" />
						设置
					</p>
					<Form ref="optsForm" label-position="top">
						<FormItem label="分类">
							<RadioGroup v-model="dataForm.cate_id">
								<Radio label="cate" v-for="item in cateAll" :label="item.id" :key="item.id">{{item.name}}</Radio>
							</RadioGroup>
						</FormItem>
						<FormItem label="标签">
							<Select v-model="tags" multiple placeholder="请选择文章标签">
								<Option v-for="item in tagAll" :value="item.id" :key="item.id">{{ item.name }}</Option>
							</Select>
						</FormItem>
						<FormItem label="密码">
							<Input v-model="dataForm.passwd" placeholder="请输入文章密码"></Input>
						</FormItem>
						<br><br>
					</Form>
				</Card>
				</Col>
			</Row>
		</Card>
	</div>
</template>
<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import toolbars from "./toolbars";
import { apiCateAll } from "@/api/cate";
import { apiTagAll } from "@/api/tag";
import util from "@/utils.js";
import { apiPostGet, apiPostAddOrEdit, apiPostTagGet } from "@/api/post";
// 通用 文章/页面 + 添加/修改
// 减少js体积
export default {
	components: {
		mavonEditor
	},
	data() {
		return {
			cateAll: [],
			tagAll: [],
			draftLoading: false,
			publishLoading: false,
			dataForm: {
				title: "",
				status: 0,
				cate_id: 1,
				markdown_content: "",
				cate_name: "",
				passwd: "",
				filename: ""
			},
			tags: [],
			toolbars: toolbars,
			dataRules: {
				title: [{ required: true, message: " ", trigger: "blur" }]
			}
		};
	},
	methods: {
		init() {
			this.getCate();
			this.getTag();
			if (this.isEdit) {
				this.getOne();
				apiPostTagGet(this.dataId).then(resp => {
					if (resp.code == 200) {
						this.tags = resp.data;
					}
				});
			}
		},
		getCate() {
			apiCateAll().then(resp => {
				if (resp.code == 200) {
					this.cateAll = resp.data;
					if (this.cateAll == null) {
						this.cateAll = [];
					}
				}
			});
		},
		getTag() {
			apiTagAll().then(resp => {
				if (resp.code == 200) {
					this.tagAll = resp.data;
					if (this.cateAll == null) {
						this.tagAll = [];
					}
				}
			});
		},
		getOne() {
			apiPostGet(this.dataId).then(resp => {
				if (resp.code == 200) {
					this.dataForm = resp.data;
				} else {
					this.dataForm = {
						title: "",
						cate_id: 1,
						status: 0,
						markdown_content: ""
					};
					this.$Message.warning("未查询到信息，请重试！");
				}
			});
		},
		diyMore(val) {
			this.$refs.md.insertText(this.$refs.md.getTextareaDom(), {
				prefix: "",
				subfix: "",
				str: "<!--more-->"
			});
		},
		imgAdd(pos, $file) {
			let formData = new FormData();
			let xhr = new XMLHttpRequest();
			xhr.withCredentials = false;
			xhr.open("POST", process.env.VUE_APP_SRV + "/api/v1/img");
			xhr.onload = () => {
				var json;
				if (xhr.status < 200 || xhr.status >= 300) {
					this.$Message.warning("图片上传失败,HTTP Error: " + xhr.status);
					return;
				}
				json = JSON.parse(xhr.responseText);
				if (!json || json.code != 200) {
					this.$Message.warning("图片上传失败");
					return;
				}
				this.$refs.md.$img2Url(pos, process.env.VUE_APP_VISITOR_SRV + "/static" + json.data);
			};

			formData.append("token", util.getToken());
			formData.append("img", $file);
			xhr.send(formData);
		},
		// 存草稿
		cmtDraft() {
			this.$refs.dataForm.validate(valid => {
				if (valid) {
					if (this.dataForm.content == "") {
						this.$Message.warning("请填写内容");
						return;
					}
					console.log(this.dataForm);
					this.dataForm.status = 0; //草稿
					this.draftLoading = true;
					apiPostAddOrEdit({
						post: this.dataForm,
						edit: this.isEdit,
						tags: this.tags
					}).then(resp => {
						this.draftLoading = false;
						if (resp.code == 200) {
							this.$Message.success({
								content: resp.msg,
								onClose: () => {
									this.$router.push({
										name: "post-list"
									});
								}
							});
						} else {
							this.$Message.error({
								content: resp.msg
							});
						}
					});
				}
			});
		},
		// 发布
		cmtPublish() {
			this.$refs.dataForm.validate(valid => {
				if (valid) {
					if (this.dataForm.content == "") {
						this.$Message.warning("请填写内容");
						return;
					}
					this.dataForm.status = 1; //发布
					this.publishLoading = true;
					apiPostAddOrEdit({
						post: this.dataForm,
						edit: this.isEdit,
						tags: this.tags
					}).then(resp => {
						this.publishLoading = false;
						if (resp.code == 200) {
							this.$Message.success({
								content: resp.msg,
								onClose: () => {
									this.$router.push({
										name: "post-list"
									});
								}
							});
						} else {
							this.$Message.error({
								content: resp.msg
							});
						}
					});
				}
			});
		}
	},
	computed: {
		// 是否编辑
		isEdit() {
			return this.$route.name.indexOf("edit") > -1;
		},
		// 是否添加
		isAdd() {
			return this.$route.name.indexOf("add") > -1;
		},
		// 数据id
		dataId() {
			if (this.isEdit) {
				return parseInt(this.$route.params.id, 10);
			}
			return 0;
		}
	},
	mounted() {
		var md = this.$refs.md;
		var toolbar_left = md.$refs.toolbar_left;
		var diy = this.$refs.diy;
		toolbar_left.$el.append(diy);
		//   beforeRouteUpdate(to, from, next) {
		//     //参数不同才触发
		//     console.log("beforeRouteUpdate");
		//     // don't forget to call
		//     next();
		//   },
		//   watch: {
		//     $route(to, from) {
		//       //刷新参数放到这里里面去触发就可以刷新相同界面了
		//       console.log("watch");
		//     }
		//   }
		this.init();
	}
};
</script>
