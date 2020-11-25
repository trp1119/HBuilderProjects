<template>
	<text
		class="bg-danger text-white rounded-circle font-sm free-badge"
		:class="badgeClass"
		:style="badgeStyle"
	>{{value}}</text>
</template>

<script>
	export default {
		props: {
			badgeClass: {
				type: String,
				default: ''
			},
			badgeStyle: {
				type: String,
				default: ''
			},
			value: {
				type: [Number, String],
				default: ''
			}
		}
	}
</script>

<style scoped>
	.free-badge {
		padding-top: 6rpx;
		padding-right: 14rpx;
		padding-bottom: 6rpx;
		padding-left: 14rpx;
	}
</style>
