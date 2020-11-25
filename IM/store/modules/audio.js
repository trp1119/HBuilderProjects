export default {
	state: {
		// 录音管理器
		RECORD: null,
		// 存放全局事件
		events: []
	},
	mutations: {
		// 初始化录音管理器
		initRECORD (state) {
			state.RECORD = uni.getRecorderManager()
		},
		// 注册全局事件
		regEvent (state, event) {
			state.events.push(event)
		},
		// 执行全局事件
		doEvent (state, params) {
			state.events.forEach(e => {
				e(params)
			})
		},
		// 注销全局事件
		offEvent (state, event) {
			const index = state.events.findIndex(e => {
				return e === event
			})
			if (index !== -1) state.events.splice(index, 1)
		}
	},
	actions: {
		// 分发注册全局事件
		audioOn ({commit}, event) {
			commit('regEvent', event)
		},
		// 分发执行全局事件
		audioEmit ({commit}, params) {
			commit('doEvent', params)
		},
		// 分发注销全局事件
		audioOff ({commit}, event) {
			commit('offEvent', event)
		}
	}
}