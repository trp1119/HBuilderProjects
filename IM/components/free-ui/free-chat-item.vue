<template>
		<view>
			<!-- 时间显示 -->
			<view v-if="showTime" class="flex align-center justify-center pb-4 pt-2">
				<text class="font-sm text-light-muted">{{showTime}}</text>
			</view>
			<!-- 撤回消息 -->
			<view v-if="item.isremove" class="flex align-center justify-center pb-4 pt-1">
				<text class="font-sm text-light-muted">你撤回了一条消息</text>
			</view>
			<!-- 聊天内容 -->
			<view
				v-else
				class="flex align-start position-relative mb-3"
				:class="!isSelf ? 'justify-start' : 'justify-end' "
			>
				<!-- 好友 -->
				<template v-if="!isSelf">
					<!-- 头像 -->
					<freeAvatar size="80" :src="item.avatar" clickType="navigate" />
					<!-- 箭头 -->
					<text
						v-if="hasLabelClass"
						class="iconfont font-md text-white position-absolute chat-left-icon">&#xe609;</text>
				</template>
				<!-- 聊天内容 -->
				<view
					class="p-2 rounded "
					:class="labelClass"
					style="max-width: 500rpx;"
					:style="labelStyle"
					@longpress="long"
				>
					<!-- 文字 -->
					<text
						class="font-md"
						v-if="item.type === 'text'"
					>{{item.data}}</text>
					<!-- 表情包 | 图片 -->
					<freeImage
						v-else-if="item.type === 'emoticon' || item.type === 'image'"
						:src="item.data"
						:maxWidth="500"
						:maxHeight="350"
						imageClass="rounded"
						@click="preview(item.data)"
					/>
					<!-- 音频 -->
					<view
						class="flex align-center"
						:class="isSelf ? 'justify-end' : 'justify-start'"
						v-else-if="item.type === 'audio'"
						@click="openAudio"
					>
						<image
						  v-if="!isSelf"
							class="mx-1"
							style="width: 50rpx; height: 50rpx;"
							:src="audioPlaying ? '/static/audio/play.gif' : '/static/audio/pause.png'"
						></image>
						<text class="font">{{item.options.time}}'</text>
						<image
							v-if="isSelf"
							class="mx-1"
							style="width: 50rpx; height: 50rpx;"
							:src="audioPlaying ? '/static/audio/play.gif' : '/static/audio/pause.png'"
						></image>
					</view>
					<!-- 视频 -->
					<view
						class="position-relative rounded flex justify-center align-center flex-column"
						v-if="item.type === 'video'"
						style="align-items: center;"
					>
						<freeImage
							:src="item.options.poster"
							:maxWidth="500"
							:maxHeight="350"
							imageClass="rounded"
							@click="openVideo"
						/>
						<text
							class="iconfont text-light-muted position-absolute"
							style="font-size: 80rpx;"
						>&#xe737;</text>
					</view>
				</view>
				<!-- 本人 -->
				<template v-if="isSelf">
					<!-- 箭头 -->
					<text
						v-if="hasLabelClass"
						class="iconfont font-md text-chat-item position-absolute chat-right-icon">&#xe640;</text>
					<freeAvatar size="80" src="/static/images/mail/friend.png" clickType="navigate" />
				</template>
			</view>
		</view>
</template>

<script>
	import freeAvatar from './free-avatar.vue'
	import freePopup from './free-popup.vue'
	import freeImage from './free-image.vue'
	import $Time from '@/common/free-lib/time.js'
	import { mapState, mapActions } from 'vuex'
	
	export default {
		components: {
			freeAvatar,
			freePopup,
			freeImage
		},
		props: {
			item: Object,
			index: Number,
			// 上一条消息的时间戳
			pretime: [Number, String]
		},
		data() {
			return {
				w: 100,
				h: 100,
				innerAudioContext: null,
				audioPlaying: false
			}
		},
		computed: {
			// 是否是本人
			isSelf () {
				// 获取本人 id
				const id = 1
				return this.item.user_id === id
			},
			// 显示的时间
			showTime () {
				return $Time.getChatTime(this.item.create_time, this.pretime)
			},
			// 是否需要气泡样式
			hasLabelClass () {
				return this.item.type === 'text' || this.item.type === 'audio'
			},
			// 气泡样式
			labelClass () {
				let selfLabelClass = this.hasLabelClass ? 'bg-chat-item mr-3' : 'mr-3'
				return this.isSelf ? selfLabelClass : 'bg-white ml-3'
			},
			labelStyle () {
				if (this.item.type === 'audio') {
					const time = this.item.options.time || 0
					let width = 500 * (time / 60)
					width = width < 150 ? 150 : width
					return `width: ${width}rpx;`
				}
			}
		},
		mounted () {
			// 注册全局事件
			if (this.item.type === 'audio') this.audioOn(this.onPlayAudio)
		},
		deactivated () {
			// 销毁全局事件
			if (this.item.type === 'audio') this.audioOff(this.onPlayAudio)
			return
			// 销毁音频
			if (this.innerAudioContext) {
				this.innerAudioContext.destroy()
				this.innerAudioContext = null
			}
		},
		methods: {
			...mapActions(['audioOn', 'audioEmit', 'audioOff']),
			// 预览图片
			preview (url) {
				this.$emit('preview', url)
			},
			// 长按事件
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
			},
			// 监听播放音频全局事件
			onPlayAudio (index) {
				if (this.innerAudioContext) {
					if (this.index !== index) {
						this.innerAudioContext.stop()
					}
				}
			},
			// 播放音频
			openAudio () {
				// 通知停止其他音频
				this.audioEmit(this.index)
				// 播放
				if (!this.innerAudioContext) {
					this.innerAudioContext = uni.createInnerAudioContext()
					this.innerAudioContext.src = this.item.data
					this.innerAudioContext.play()
					// 监听播放
					this.innerAudioContext.onPlay(() => {
						this.audioPlaying = true
					})
					// 监听暂停
					this.innerAudioContext.onPause(() => {
						this.audioPlaying = false
					})
					// 监听停止
					this.innerAudioContext.onStop(() => {
						this.audioPlaying = false
					})
					// 监听播放
					this.innerAudioContext.onError(() => {
						this.audioPlaying = false
					})
				} else {
					this.innerAudioContext.stop()
					this.innerAudioContext.play()
				}
			},
			// 打开视频
			openVideo () {
				uni.navigateTo({
					url: `/pages/chat/video/video?url=${this.item.data}`,
					animationType: 'zoom-fade-out'
				})
			}
		}
	}
</script>

<style scoped>
	.chat-left-icon {
		left: 80rpx;
		top: 20rpx;
	}
	.chat-right-icon {
		right: 80rpx;
		top: 20rpx;
	}
</style>
