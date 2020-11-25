<template>
	<view
		class="bg-white flex align-stretch"
		hover-class="bg-light"
		@click="$emit('click')"
	>
		<!-- 左侧图标 -->
		<view
			class="flex align-center justify-center py-2 pl-3"
			v-if="showLeftIcon"
		>
			<slot name="icon"></slot>
			<image
				v-if="cover"
				:src="cover"
				mode="widthFix"
				:style="coverStyle"
			></image>
		</view>
		<!-- 右侧内容 -->
		<view
			class="flex-1 flex align-center justify-between pr-3 py-3 pl-3"
			:class="border ? 'border-bottom' : ''"
		>
			<!-- 左 -->
			<slot>
				<text class="font-md text-dark">{{title}}</text>
			</slot>
			<!-- 右 -->
			<view class="flex align-center" v-if="showRight">
				<slot name="right"></slot>
				<!-- 右箭头 -->
				<text class="iconfont text-light-muted font-md" v-if="showRightIcon">&#xe60c;</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 封面
			cover: {
				type: String,
				default: ''
			},
			// 封面大小
			coverSize: {
				type: [Number, String],
				default: 75
			},
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 显示右箭头
			showRight: {
				type: Boolean,
				default: false
			},
			// 显示左图标
			showLeftIcon: {
				type: Boolean,
				default: true
			},
			// 显示右图标
			showRightIcon: {
				type: Boolean,
				default: true
			},
			// 显示下边线
			border: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			coverStyle () {
				return `width: ${this.coverSize}rpx; height: ${this.coverSize}rpx;`
			}
		}
	}
</script>

<style>
</style>
