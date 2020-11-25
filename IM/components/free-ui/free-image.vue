<template>
	<view>
		<image
			:class="imageClass"
			:style="imageStyle"
			:src="src"
			lazy-load
			@click="$emit('click')"
			@load="loadImage"
		></image>
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: ''
			},
			imageClass: {
				type: String,
				default: ''
			},
			maxWidth: {
				type: Number,
				default: 500 // rpx
			},
			maxHeight: {
				type: Number,
				default: 350 // rpx
			}
		},
		data() {
			return {
				w: 100,
				h: 100
			}
		},
		computed: {
			imageStyle () {
				return `width: ${this.w}px; height: ${this.h}px;`
			}
		},
		methods: {
			// 图片加载
			loadImage (e) {
				const w = e.detail.width
				const h = e.detail.height
				// 最大宽度
				const maxW = uni.upx2px(this.maxWidth)
				// if (w <= maxW) {
				// 	// 使用原始宽高
				// 	this.w = w
				// 	this.h = h
				// } else {
				// 	this.w = maxW
				// 	this.h = maxW * (h/w)
				// }
				// 最大高度
				const maxH = uni.upx2px(this.maxHeight)
				if (h <= maxH) {
					// 使用原始宽高
					this.w = w
					this.h = h
				} else {
					this.h = maxH
					this.w = maxH * (w / h)
				}
				
				// if (w <= maxW && h <= maxH) {
				// 	// 使用原始宽高
				// 	this.w = w
				// 	this.h = h
				// } else if (w > maxW && h <= maxH) {
				// 	this.w = maxW
				// 	this.h = maxW * (h/w)
				// } else if (w <= maxW && h > maxH) {
				// 	this.w = maxH * (w/h)
				// 	this.h = maxH
				// } else {
				// 	this.w = maxW
				// 	this.h = maxH
				// }
				// if (h <= maxH) {
				// 	this.w = w <= maxW ? w : maxW
				// 	this.h = h
				// } else {
				// 	this.h = maxH
				// 	const w2 = maxH * (w / h)
				// 	this.w = w2 <= maxW ? w2 : maxW
				// }
			}
		}
	}
</script>

<style>

</style>
