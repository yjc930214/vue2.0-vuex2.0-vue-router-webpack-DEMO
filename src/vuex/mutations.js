/**
 * Created by 515515 on 2017/3/6.
 */
import * as types from './mutation-types'
//
export default {
    // 增加总时间
    [types.ADD_TOTAL_TIME] (state, time) {
        state.totalTime = parseInt(state.totalTime) + parseInt(time)
    },
    // 减少总时间
    [types.DEC_TOTAL_TIME] (state, time) {
        state.totalTime = parseInt(state.totalTime) - parseInt(time)
    },
    // 新增计划
    [types.SAVE_PLAN] (state, plan) {
        // 设置默认值，未来我们可以做登入直接读取昵称和头像
        const avatar = 'https://pic.cnblogs.com/avatar/504457/20161108225210.png';

        state.list.push(
            Object.assign({ name: 'eraser', avatar: avatar }, plan)
        )
        window.localStorage.setItem('state',state)
        console.log(window.localStorage.getItem('state'))
    },
    // 删除某计划
    [types.DELETE_PLAN] (state, idx) {
        state.list.splice(idx, 1);
    }
};