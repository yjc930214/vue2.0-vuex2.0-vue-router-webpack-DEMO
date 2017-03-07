/**
 * Created by 515515 on 2017/3/6.
 */
//import * as types from './mutation-types'
//
//export default {
//    addTotalTime({ commit }, time) {
//        commit(types.ADD_TOTAL_TIME, time)
//    },
//    decTotalTime({ commit }, time) {
//        commit(types.DEC_TOTAL_TIME, time)
//    },
//    savePlan({ commit }, plan) {
//        commit(types.SAVE_PLAN, plan);
//    },
//    deletePlan({ commit }, plan) {
//        commit(types.DELETE_PLAN, plan)
//    }
//};
import * as types from './mutation-types'
export default{
    decTotalTime({commit},totalTime){
        commit(types.DEC_TOTAL_TIME,totalTime)
    },
    deletePlan({commit},index){
        commit(types.DELETE_PLAN,index)
    },
    savePlan({commit},plan){
        commit(types.SAVE_PLAN,plan)
    },
    addTotalTime({commit},totalTime){
        commit(types.ADD_TOTAL_TIME,totalTime)
    }
}