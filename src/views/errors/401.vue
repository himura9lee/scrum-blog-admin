<template>
	<error code="401" desc="Oh~~嘿呀没有权限啦~" :src="src" />
</template>

<script>
import error401 from "@/assets/401.svg";
import error from "./error.vue";
export default {
	name: "err401",
	components: {
		error
	},
	data() {
		return {
			src: error401
		};
	}
};
</script>
