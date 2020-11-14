<template>
	<error code="500" desc="Oh~~服务器休息了~" :src="src" />
</template>
<script>
import error500 from "@/assets/500.svg";
import error from "./error.vue";
export default {
	name: "err500",
	components: {
		error
	},
	data() {
		return {
			src: error500
		};
	}
};
</script>
