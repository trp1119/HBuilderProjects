<template>
	<view
		class="flex align-stretch"
		:class="item.istop ? 'bg-light' : 'bg-white'"
		hover-class="bg-light"
		@click="onClick"
		@longpress="long"
	>
		<!-- 左侧头像 -->
		<view
			class="flex align-center justify-center position-relative"
			style="width: 145rpx;"
		>
			<freeAvatar :src="item.avatar" size="92" />
			<freeBadge
				badgeClass="position-absolute"
				badgeStyle="top: 15rpx; right: 15rpx;"
				v-if="item.noreadnum"
				:value="item.noreadnum" />
		</view>
		<!-- 右侧内容 -->
		<view class="flex flex-column border-bottom flex-1 py-3 pr-3 border-light-secondary">
			<view class="flex align-center justify-between mb-1">
				<text class="font-md">{{item.nickname}}</text>
				<text class="font-sm text-light-muted">{{item.update_time | formatTime}}</text>
			</view>
			<text class="font text-ellipsis text-light-muted">{{item.data}}</text>
		</view>
	</view>
</template>

<script>
	import freeAvatar from './free-avatar.vue'
	import freeBadge from './free-badge.vue'
	import freeBase from '@/common/mixin/free-base.js'
	
	export default {
		mixins: [freeBase],
		components: {
			freeAvatar,
			freeBadge
		},
		props: {
			item: Object,
			index: Number
		},
		data() {
			return {

			}
		},
		methods: {
			onClick () {
				uni.navigateTo({
					url: '/pages/chat/chat/chat'
				})
			},
			long (e) {
				let x = 0, y = 0
				// #ifdef APP-PLUS-NVUE
				if (Array.isArray(e.touches) && e.touches.length > 0) {
					x = e.touches[0].screenX
					y = e.touches[0].screenY
				}
				// #endif
				// #ifdef MP
				x = e.detail.x
				y = e.detail.y
				// #endif
				this.$emit('long', {
					x,
					y,
					index: this.index
				})
				
			}
		}
	}
</script>

<style>

</style>
