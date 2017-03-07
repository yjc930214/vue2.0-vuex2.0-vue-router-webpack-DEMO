/**
 * Created by 515515 on 2017/3/6.
 */
//import Vue from 'vue'
//import Vuex from 'vuex'
//import mutations from './mutations'
//import actions from './actions'
//
//Vue.use(Vuex);
//
//const state = {
//    totalTime: 0,
//    list: []
//};
//
//export default new Vuex.Store({
//    state,
//    mutations,
//    actions
//})
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

var state = {
    totalTime:0,
    list:[]
}
export default new Vuex.Store({
    state,
    mutations,
    actions
})