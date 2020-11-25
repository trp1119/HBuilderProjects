<template>
	<freePopup ref="confirm" maskColor center transformOrigin="center center">
		<view class="bg-white rounded flex flex-column" style="width: 600rpx;">
			<!-- 头部 -->
			<view class="p-4 flex flex-column">
				<text class="font-md font-weight-bold mb-3">{{title}}</text>
				<slot></slot>
			</view>
			<!-- 底部 -->
			<view
				class="flex align-stretch border-top"
				style="height: 100rpx;"
			>
				<view
					class="flex align-center justify-center flex-1 border-right"
					@click="cancel"
					>
					<text class="font-md text-muted">取消</text>
				</view>
				<view
					class="flex align-center justify-center flex-1"
					@click="confirm"
				>
					<text class="font-md main-text-color">确定</text>
				</view>
			</view>
		</view>
	</freePopup>
</template>

<script>
	import freePopup from './free-popup.vue'
	
	export default {
		components: {
			freePopup
		},
		props: {
			title: {
				type: String,
				default: '提示'
			}
		},
		data () {
			return {
				callback: false
			}
		},
		methods: {
			// 显示
			show (callback = false) {
				this.callback = callback
				this.$refs.confirm.show()
			},
			// 取消
			cancel () {
				this.$refs.confirm.hide()
			},
			// 确定
			confirm () {
				if (typeof this.callback === 'function') {
					this.callback(() => {
						this.cancel()
					})
				}
			}
		}
	}
</script>

<style>
</style>
