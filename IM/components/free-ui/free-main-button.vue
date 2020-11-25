<template>
	<view
		v-else
		class="main-bg-color rounded mr-2 px-2 py-1"
		@click="$emit('click')"
	>
		<text class="font text-white">{{name}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style>
</style>
