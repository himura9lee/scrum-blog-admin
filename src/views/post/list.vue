<template>
	<Card dis-hover>
		<Form inline ref="searchCond" :model="searchCond">
			<FormItem>
				<Select v-model="searchCond.cate_id" placeholder="请选择文章类别" style="width:200px">
					<Option v-for="item in cateAll" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem>
				<Button type="primary" @click="search()">查询</Button>
			</FormItem>
			<FormItem>
				<Input type="text" v-model="searchCond.fzTitle" placeholder="标题关键词" :rules="fzRules"></Input>
		    </FormItem>
			<FormItem>
				<Button type="primary" @click="searchFuzzy()">查询</Button>
			</FormItem>
		</Form>
		<Table size="small" stripe :columns="colPost" :data="dataPost"></Table>
		<br>
		<Page :total="total" :current.sync="page.pi" :page-size="page.ps" :page-size-opts="[10,12,15,20,30]" @on-change="piChange" @on-page-size-change="psChange" show-sizer show-elevator show-total></Page>
	</Card>
</template>
<script>
import { apiCateAll } from "@/api/cate";
import { apiPostByCateID, apiPostDrop, apiPostGetFuzzy } from "@/api/post";
export default {
	data() {
		return {
			searchCond: { cate_id: 0, fzTitle: "" },
			fzRules: {
				fzTitle: [{ required: true, message: "请输入关键字", trigger: "blur" },
							{ min: 1, message: "请至少输入1个字符", trigger: "blur" }]
			},
			cateAll: [],
			post: {},
			page: { pi: 1, ps: 15 },
			total: 0,
			colPost: [
				{ type: "index", width: 60, align: "center" },
				{
					title: "标题",
					ellipsis: true,
					tooltip: true,
					render: (h, data) => {
						return h("div", data.row.title);
					}
				},
				{
					title: "分类",
					ellipsis: true,
					render: (h, data) => {
						return h("div", data.row.cate_name);
					}
				},
				{
					title: "密码",
					ellipsis: true,
					render: (h, data) => {
						if (data.row.passwd == "") {
							return h("div", "无密码");
						} else {
							return h("div", data.row.passwd);
						}
					}
				},
				{
					title: "状态",
					width: 80,
					align: "center",
					render: (h, data) => {
						if (data.row.status == 1) {
							return h("div", "已发布");
						} else {
							return h("div", "草稿");
						}
					}
				},
				{
					title: "创建时间",
					width: 180,
					align: "center",
					render: (h, data) => {
						return h("div", data.row.created_at.replace(/T|\+08:00/g, " "));
					}
				},
				{
					title: "更新时间",
					width: 180,
					align: "center",
					render: (h, data) => {
						return h("div", data.row.updated_at.replace(/T|\+08:00/g, " "));
					}
				},
				{
					title: "操作",
					key: "action",
					width: 150,
					align: "center",
					render: (h, data) => {
						return h("a", [
                             h("Icon", {
								props: { type: "md-eye", size: "20", color: "#5FB878" },
								attrs: { title: "查看" },
								style: { marginRight: "15px" },
								on: {
									click: () => {
										let url = process.env.VUE_APP_VISITOR_SRV + "/views/" + data.row.filename + ".html";
										window.open(url);
									}
								}
							}),
							h("Icon", {
								props: { type: "md-create", size: "20", color: "#FFB800" },
								attrs: { title: "修改" },
								style: { marginRight: "15px" },
								on: {
									click: () => {
										this.$router.push({
											name: "post-edit",
											params: { id: data.row.id }
										});
									}
								}
							}),
							h(
								"Poptip",
								{
									props: { confirm: true, title: "确定要删除吗？" },
									on: {
										"on-ok": () => {
											this.delete(data);
										}
									}
								},
								[
									h("Icon", {
										props: { type: "ios-trash", size: "20", color: "#FF5722" },
										attrs: { title: "删除" }
									})
								]
							)
						]);
					}
				}
			],
			dataPost: []
		};
	},
	methods: {
		init_() {
			apiCateAll().then(resp => {
				if (resp.code == 200) {
					resp.data.unshift({id: 0, name: " all "});
					this.cateAll = resp.data;
				} else {
					this.cateAll = [];
					this.$Message.warning("未查询到数据，请重试！");
				}
			});
		},
		init() {
			apiPostByCateID(this.searchCond.cate_id, this.page).then(resp => {
				if (resp.code == 200) {
					this.dataPost = resp.data.items;
					this.total = resp.data.count;
				} else {
					this.dataPost = [];
					this.total = 0;
					this.$Message.warning("未查询到数据，请重试！");
				}
			});
		},
		init_fuzzy() {
			apiPostGetFuzzy({ fz_title: this.searchCond.fzTitle, page: this.page }).then(resp => {
				if (resp.code == 200) {
					this.dataPost = resp.data.items;
					this.total = resp.data.count;
				} else {
					this.dataPost = [];
					this.total = 0;
					this.$Message.warning("未查询到数据，请重试！");
				}
			});
		},
		search() {
			this.page.pi = 1;
			this.init();
		},
		searchFuzzy() {
			this.page.pi = 1;
			this.init_fuzzy();
		},
		piChange(pi) {
			this.page.pi = pi;
			this.init();
		},
		psChange(ps) {
			this.page.ps = ps;
			this.init();
		},
		//删除
		delete(data) {
			apiPostDrop(data.row.id).then(resp => {
				if (resp.code == 200) {
					this.$Message.success({
						content: "删除成功",
						onClose: () => {
							this.dataPost.splice(data.index, 1);
						}
					});
				} else {
					this.$Message.error("删除失败,请重试！");
				}
			});
		}
	},
	mounted() {
		this.init_();
		this.init();
	}
};
</script>
