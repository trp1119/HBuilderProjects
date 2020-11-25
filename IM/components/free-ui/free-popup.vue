<template>
	<view style="z-index: 9999; overflow: hidden;" v-if="status">
		<!-- 蒙版 -->
		<view
			class="position-fixed top-0 left-0 right-0 bottom-0"
			:style="getMaskColor"
			v-if="mask"
			@click="hide"
		></view>
		<!-- 弹出框内容 -->
		<view
			class="position-fixed free-animated"
			:class="getBodyClass"
			:style="getBodyStyle"
			ref="popup"
		>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-PLUS-NVUE
	const animation = weex.requireModule('animation')
	// #endif
	
	export default {
		props: {
			// 蒙版颜色是否开启
			maskColor: {
				type: Boolean,
				default: false
			},
			// 是否开启蒙版
			mask: {
				type: Boolean,
				default: true
			},
			// 是否居中
			center: {
				type: Boolean,
				default: false
			},
			// 是否处于底部
			bottom: {
				type: Boolean,
				default: false
			},
			// 弹出层内容宽度
			bodyWidth: {
				type: Number,
				default: 0
			},
			// 弹出层内容高度
			bodyHeight: {
				type: Number,
				default: 0
			},
			// 弹出层背景色
			bodyBgColor: {
				type: String,
				default: 'bg-white'
			},
			transformOrigin: {
				type: String,
				default: 'left top'
			},
			// tabbar 高度
			tabbarHeight: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				status: false,
				x: -1,
				y: -1,
				maxX: 0,
				maxY: 0
			}
		},
		computed: {
			getMaskColor () {
				const i = this.maskColor ? 0.5 : 0
				return `background-color: rgba(0, 0, 0, ${i});`
			},
			getBodyClass () {
				if (this.center) return 'left-0 right-0 top-0 bottom-0 flex align-center justify-center'
				const bottom = this.bottom ? 'left-0 right-0 bottom-0' : 'rounded border'
				return `${bottom} ${this.bodyBgColor}`
			},
			getBodyStyle () {
				const left = this.x > -1 ? `left: ${this.x}px;` : ''
				const top = this.y > -1 ? `top: ${this.y}px;` : ''
				return left + top
			}
		},
		mounted () {
			try {
				const res = uni.getSystemInfoSync()
				this.maxX = res.windowWidth - uni.upx2px(this.bodyWidth)
				this.maxY = res.windowHeight - uni.upx2px(this.bodyHeight) - uni.upx2px(this.tabbarHeight)
			} catch (e) {
				
			}
		},
		methods: {
			show (x, y) {
				this.x = x > this.maxX ? this.maxX : x
				this.y = y > this.maxY ? this.maxY : y
				this.status = true
				// #ifdef APP-PLUS-NVUE
				this.$nextTick(() => {
					animation.transition(this.$refs.popup, {
						styles: {
							transform: 'scale(1, 1)',
							transformOrigin: this.transformOrigin,
							opacity:  1
						},
						duration: 100,
						timingFunction: 'ease'
						}, () => {
							
						}
					)
				})
				// #endif
			},
			hide () {
				this.$emit('hide')
				// #ifdef APP-PLUS-NVUE
				animation.transition(this.$refs.popup, {
					styles: {
						transform: 'scale(0, 0)',
						transformOrigin: this.transformOrigin,
						opacity:  0
					},
					duration: 100,
					timingFunction: 'ease'
					}, () => {
						this.status = false
					}
				)
				// #endif
				// #ifndef APP-PLUS-NVUE
				this.status = false
				// #endif
			}
		}
	}
</script>

<style scoped>
	.free-animated {
		/* #ifdef APP-PLUS-NVUE */
		transform: scale(0, 0);
		opacity: 0;
		/* #endif */
	}
</style>
