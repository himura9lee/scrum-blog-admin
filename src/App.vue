<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
export default {}
</script>
<style>
	html,body {
		width: 100%;
		height: 100%;
	}
#app {
	width: 100%;
	height: 100%;
	background-image: url(/background.svg);
	background-size:100% 100%;
	background-repeat:no-repeat;
	overflow: hidden;
	font-family: "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial,sans-serif;
}
</style>
