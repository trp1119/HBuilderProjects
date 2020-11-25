<template>
	<view>
		<!-- <view class="intro">本项目已包含uni ui组件，无需import和注册，可直接使用。在代码区键入字母u，即可通过代码助手列出所有可用组件。光标置于组件名称处按F1，即可查看组件文档。</view>
		<text class="intro">详见：</text>
		<uni-link :href="href" :text="href"></uni-link> -->
		<view style="display: flex; justify-content: center; padding: 50rpx;">
			<view class="animate__animated" hover-class="animate__fadeIn" style="border: 1rpx solid #333333; padding: 20rpx;">
				点击测试
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		methods: {

		}
	}
</script>

<style>
	@import '../../common/animate.css'
	/* @import url('../../common/animate.css') */
</style>
