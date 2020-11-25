<template>
		<view>
			<view :class="getClass">
				<!-- 状态栏 -->
				<view :style="`height:${statusBarHeight}px`"></view>
				<!-- 导航 -->
				<view class="w-100 flex align-center justify-between" style="height: 90rpx;">
					<!-- 左边 -->
					<view class="flex align-center">
						<!-- 返回按钮 -->
						<freeIconButton v-if="showBack" :icon="'\ue60d'" @click="back"></freeIconButton>
						<!-- 标题 -->
						<text v-if="title" class="font-md ml-3">{{getTitle}}</text>
					</view>
					<!-- 右边 -->
					<view class="flex align-center" v-if="showRight">
						<slot name="right">
							<freeIconButton :icon="'\ue6e3'" @click="search"></freeIconButton>
							<freeIconButton :icon="'\ue682'" @click="openEextend"></freeIconButton>
						</slot>
					</view>
				</view>
			</view>
			<!-- 占位 -->
			<view v-if="fixed" :style="fixedStyle"></view>
			<!-- 扩展菜单 -->
			<freePopup
				ref="extend"
				bodyWidth="320"
				:bodyHeight="getMenusHeight"
				bodyBgColor="bg-dark"
				transformOrigin="right top"
			>
				<view
					class="flex flex-column"
					style="width: 320rpx"
					:style="getMenusStyle"
				>
					<view
						class="flex-1 flex align-center"
						hover-class="bg-hover-dark"
						v-for="(item, index) in menus"
						:key="index"
						@click="clickEvent(item.event)"
					>
						<text class="pl-3 pr-2 iconfont font-md text-white">{{item.icon}}</text>
						<text class="font-md text-white">{{item.name}}</text>
					</view>
				</view>
			</freePopup>
		</view>
</template>

<script>
  import freeIconButton from './free-icon-button.vue'
	import freePopup from './free-popup.vue'
	
	export default {
		components: {
			freeIconButton,
			freePopup
		},
		props: {
			showBack: {
				type: Boolean,
				default: false
			},
			title: {
				type: [String, Boolean],
				default: false
			},
			fixed: {
				type: Boolean,
				default: true
			},
			noreadnum: {
				type: Number,
				default: 0
			},
			bgColor: {
				type: String,
				default: 'bg-light'
			},
			showRight: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				statusBarHeight: 0,
				navBarHeight: 0,
				menus: [
					{
						name: '发起群聊',
						events: '',
						icon: '\ue633'
					},
					{
						name: '添加好友',
						events: '',
						icon: '\ue65d'
					},
					{
						name: '扫一扫',
						events: '',
						icon: '\ue614'
					},
					{
						name: '收付款',
						events: '',
						icon: '\ue66c'
					},
					{
						name: '帮助与反馈',
						events: '',
						icon: '\ue66c'
					}
				]
			}
		},
		computed: {
			fixedStyle () {
				return `height: ${this.navBarHeight}px;`
			},
			getTitle () {
				const noreadnum = this.noreadnum > 0 ? `(${this.noreadnum})` : ''
				return this.title + noreadnum
			},
			// 动态获取菜单高度
			getMenusHeight () {
				const H = 100
				return this.menus.length * H
			},
			// 获取菜单样式
			getMenusStyle () {
				return `height: ${this.getMenusHeight}rpx;`
			},
			getClass () {
				const fixed = this.fixed ? 'fixed-top' : ''
				return `${fixed} ${this.bgColor}`
			}
		},
		mounted() {
			// #ifdef APP-PLUS-NVUE
			this.statusBarHeight = plus.navigator.getStatusbarHeight()
			// #endif
			this.navBarHeight = this.statusBarHeight + uni.upx2px(90)
		},
		methods: {
			search () {
				
			},
			openEextend () {
				this.$refs.extend.show(uni.upx2px(415), uni.upx2px(150))
			},
			back () {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>
