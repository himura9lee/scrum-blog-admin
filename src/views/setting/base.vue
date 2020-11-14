
<template>
	<Card dis-hover>
		<p slot="title">
			<Icon type="ios-settings-outline" /> 基本设置
		</p>
		<div style="max-width:600px">
			<Form ref="base" :model="base" label-position="top" :rules="base">
				<FormItem label="站点名称" prop="title">
					<Input v-model="base.title"></Input>
				</FormItem>
				<FormItem label="站点描述" prop="description">
					<Input v-model="base.description"></Input>
				</FormItem>
				<FormItem>
					<Button type="warning" :loading="loadingSaveInfo" @click="saveBase">提交保存</Button>
					<Button type="success" @click="resetEdit()" style="margin-left: 8px">重置填写</Button>
				</FormItem>
			</Form>
		</div>
	</Card>
</template>
<script>
import { apiInfoBase, apiInfoEdit } from "@/api/info";
export default {
	data() {
		return {
			base: { title: "", description: "" },
			loadingSaveInfo: false
		};
	},
	methods: {
		resetEdit() {
			this.init();
		},
		saveBase() {
			this.loadingSaveInfo = true;
			apiInfoEdit(this.base).then(resp => {
				this.loadingSaveInfo = false;
				if (resp.code == 200) {
					this.$Message.success({ content: "更新成功" });
				} else {
					this.$Message.error({
						content: `更新失败`,
						duration: 3,
						onClose() {
							this.init();
						}
					});
				}
			});
		},
		init() {
			apiInfoBase().then(resp => {
				if (resp.code == 200) {
					this.base = resp.data;
				} else {
					this.base = {};
				}
			});
		}
	},
	mounted() {
		this.init();
	}
};
</script>
