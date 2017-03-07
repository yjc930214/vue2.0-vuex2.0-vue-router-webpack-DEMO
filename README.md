# vue2.0-project
一、介绍Vuex

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化，适合于构建中大型单页应用。

1、什么是状态管理模式？

看个简单的例子：

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Vuex Demo 01</title>
<script src="http://cdn.bootcss.com/vue/1.0.26/vue.min.js"></script>
<script src="http://cdn.bootcss.com/vuex/0.8.2/vuex.min.js"></script>
</head>
<body>
  <!-- 2、view，映射到视图的数据counterValue； -->
  <h3>Count is {{ counterValue }}</h3>
  <div>
    <button @click="increment">Increment +1</button>
    <button @click="decrement">Decrement -1</button>
  </div>
</body>
<script>
var app = new Vue({
  el: 'body',
  store: new Vuex.Store({
    // 1、state，驱动应用的数据源；
    state: {
      count: 0
    },
    mutations: {
      INCREMENT: function(state, amount) {
        state.count = state.count + amount
      },
      DECREMENT: function(state, amount) {
        state.count = state.count - amount
      }
    }
  }),
  vuex: {
    getters: {
      counterValue: function(state) {
        return state.count
      }
    },
    // 3、actions，响应在view上的用户输入导致的状态变化。
    actions: {
      increment: function({ dispatch, state }){
        dispatch('INCREMENT', 1)
      },
      decrement: function({ dispatch, state }){
        dispatch('DECREMENT', 1)
      }
    }
  }
})
</script>
</html>
代码中标识了：

 1、state，驱动应用的数据源；
2、view，映射到视图的数据counterValue；
3、actions，响应在view上的用户输入导致的状态变化。
用简单示意图表示他们之间的关系：



我们知道，中大型的应用一般会遇到多个组件共享同一状态的情况：

1、多个视图依赖于同一状态
2、来自不同视图的行为需要变更同一状态
于是需要把组件的共享状态抽取出来，以一个全局单例模式管理，另外，需要定义和隔离状态管理中的各种概念并强制遵守一定的规则。

这就是 Vuex 背后的基本思想，借鉴了 Flux、Redux、和 The Elm Architecture。与其他模式不同的是，Vuex 是专门为 Vue.js 设计的状态管理库，以利用 Vue.js 的细粒度数据响应机制来进行高效的状态更新。



2、Vuex的核心概念

1、State: 单一状态树，用一个对象包含了全部的应用层级状态，作为一个『唯一数据源(SSOT)』而存在，每个应用将仅仅包含一个 store 实例。
2、Getters: Vuex 允许我们在 store 中定义『getters』（可以认为是 store 的计算属性）。
3、Mutations: Vuex 中的 mutations 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数。
4、Actions: 类似于 mutation，不同在于：①Action 提交的是 mutation，而不是直接变更状态；②Action 可以包含任意异步操作。
5、Modules: 为解决单一状态树导致应用的所有状态集中在一个store对象的臃肿问题，Vuex将store分割到模块（module）。每个模块拥有自己的 state、mutation、action、getters、甚至是嵌套子模块——从上至下进行类似的分割。
接着我们开始构建备忘录应用，在以下构建过程的介绍中，再加深理解上述概念。

二、环境安装

1.安装 vue-cli



2.初始化应用

vue init webpack vue-notes-demo
cd vue-notes-demo
npm install // 安装依赖包
npm run dev // 启动服务


结果为：



目录结构为：



三、功能模块

先看下我们要做的demo的效果为：



主要功能模块为：

新增计划，新增一个计划，编辑区显示空的计划内容。

移除计划，删除一个计划之后，计划列表少了该计划。

所有计划的总时长，将所有的计划时间加起来。

四、项目组件划分

在原来的目录结构的调整下，最终的目录结构为：



下面详细介绍下：

1、组件部分

1.首页组件：Home.vue

<template>
  <div class="jumbotron">
    <h1>我的备忘录</h1>
    <p>
      <strong>
        <router-link to="/time-entries">创建一个计划</router-link>
      </strong>
    </p>
  </div>
</template>
2.计算计划总时长组件：Sidebar.vue


<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="text-center">所有计划的总时长: {{ time }} 小时</h3>
    </div>

  </div>
</template>

<script>
  export default {
    computed: {
        time() {
          return this.$store.state.totalTime
        }
      }
  }
</script>
View Code
3.计划列表组件：TimeEntries.vue


<template>
  <div>
    <router-link
      v-if="$route.path !== '/time-entries/log-time'"
      to="/time-entries/log-time"
      class="btn create-plan">
      创建
    </router-link>

    <div v-if="$route.path === '/time-entries/log-time'">
      <h3>新的计划</h3>
    </div>

    <hr>

    <router-view></router-view>

    <div class="time-entries">
      <p v-if="!plans.length"><strong>还没有任何计划(┬＿┬)，快去创建吧ヽ(●-`Д´-)ノ</strong></p>

      <div class="list-group">
        <a class="list-group-item" v-for="(plan,index) in plans">
          <div class="row">
            <div class="col-sm-2 user-details">
              <img :src="plan.avatar" class="avatar img-circle img-responsive" />
              <p class="text-center">
                <strong>
                  {{ plan.name }}
                </strong>
              </p>
            </div>

            <div class="col-sm-2 text-center time-block">
              <p class="list-group-item-text total-time">
                <span class="glyphicon glyphicon-time">计划总时间：</span>
                {{ plan.totalTime }}
              </p>
              <p class="label label-primary text-center">
                <span class="glyphicon glyphicon-calendar">开始时间：</span>
                {{ plan.date }}
              </p>
            </div>

            <div class="col-sm-7 comment-section">
              <p>备注信息：{{ plan.comment }}</p>
            </div>
              <button
                class="btn btn-xs delete-button"
                @click="deletePlan(index)">
              X
              </button>
          </div>
        </a>

      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name : 'TimeEntries',
        computed : {
          plans () {
            return this.$store.state.list
          }
        },
        methods : {
          deletePlan(idx) {
            // 减去总时间
            this.$store.dispatch('decTotalTime',this.plans[idx].totalTime)
            // 删除该计划
            this.$store.dispatch('deletePlan',idx)
          }
        }
    }
</script>
View Code
4.新增计划组件：LogTime.vue


<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>开始日期:</label>
        <input
          type="date"
          class="form-control"
          v-model="date"
          placeholder="Date"
        />
      </div>
      <div class="col-sm-6">
        <label>总时间&nbsp;:</label>
        <input
          type="number"
          class="form-control"
          v-model="totalTime"
          placeholder="Hours"
        />
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <label>备注&nbsp;&nbsp;:</label>
        <input
          type="text"
          class="form-control"
          v-model="comment"
          placeholder="Comment"
        />
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <router-link to="/time-entries" class="btn btn-danger">取消</router-link>
    <hr>
  </div>
</template>

<script>
  export default {
        name : 'LogTime',
        data() {
            return {
                date : '',
                totalTime : '',
                comment : ''
            }
        },
        methods:{
          save() {
            const plan = {
              name : 'eraser',
              image : 'https://pic.cnblogs.com/avatar/504457/20161108225210.png',
              date : this.date,
              totalTime : this.totalTime,
              comment : this.comment
            };
            this.$store.dispatch('savePlan', plan)
            this.$store.dispatch('addTotalTime', this.totalTime)
            this.$router.go(-1)
          }
        }
    }
</script>
View Code
2、vuex中用来存储数据的划分为：

1.初始化vuex.Store: index.js

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

const state = {
  totalTime: 0,
  list: []
};

export default new Vuex.Store({
  state,
  mutations,
  actions
})
State: 单一状态树，用一个state对象包含了全部的应用层级状态，代码中只new 了一次store实例 Vuex.Store。

2.负责触发事件和传入参数：actions.js


import * as types from './mutation-types'

export default {
  addTotalTime({ commit }, time) {
    commit(types.ADD_TOTAL_TIME, time)
  },
  decTotalTime({ commit }, time) {
    commit(types.DEC_TOTAL_TIME, time)
  },
  savePlan({ commit }, plan) {
    commit(types.SAVE_PLAN, plan);
  },
  deletePlan({ commit }, plan) {
    commit(types.DELETE_PLAN, plan)
  }
};
View Code
实践中，我们会经常会用到 ES2015 的 参数解构 来简化代码（特别是我们需要调用 commit 很多次的时候）：

actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
3.注册各种数据变化的方法: mutations.js


import * as types from './mutation-types'

export default {
    // 增加总时间
  [types.ADD_TOTAL_TIME] (state, time) {
    state.totalTime = state.totalTime + time
  },
  // 减少总时间
  [types.DEC_TOTAL_TIME] (state, time) {
    state.totalTime = state.totalTime - time
  },
  // 新增计划
  [types.SAVE_PLAN] (state, plan) {
    // 设置默认值，未来我们可以做登入直接读取昵称和头像
    const avatar = 'https://pic.cnblogs.com/avatar/504457/20161108225210.png';

    state.list.push(
      Object.assign({ name: 'eraser', avatar: avatar }, plan)
    )
  },
  // 删除某计划
  [types.DELETE_PLAN] (state, idx) {
    state.list.splice(idx, 1);
  }
};
View Code
使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：

// mutation-types.js 
export const SOME_MUTATION = 'SOME_MUTATION'

mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
4.记录所有的事件名: mutation-types.js


// 增加总时间或者减少总时间
export const ADD_TOTAL_TIME = 'ADD_TOTAL_TIME';
export const DEC_TOTAL_TIME = 'DEC_TOTAL_TIME';

// 新增和删除一条计划
export const SAVE_PLAN = 'SAVE_PLAN';
export const DELETE_PLAN = 'DELETE_PLAN';
View Code
配合上面常量替代 mutation 事件类型的使用

3、初始化部分

入口文件渲染的模版index.html比较简单：

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>vue-notes-demo</title>
  </head>
  <body>
    <div id="app">
      <router-view></router-view>
    </div>
  </body>
</html>
入口文件main.js的代码：


import Vue from 'vue';
import App from './App';
import Home from './components/Home';
import TimeEntries from './components/TimeEntries.vue'

import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import store from './vuex/index';


// 路由模块和HTTP模块
Vue.use(VueResource);
Vue.use(VueRouter);

 const routes = [
  { path: '/home', component: Home },
  {
    path : '/time-entries',
    component : TimeEntries,
    children : [{
      path : 'log-time',
      // 懒加载
      component : resolve => require(['./components/LogTime.vue'],resolve),
    }]
  },
  { path: '*', component: Home }
]
const router = new VueRouter({
      routes // short for routes: routes
});
// router.start(App, '#app');
const app = new Vue({
      router,
      store,
       ...App,
}).$mount('#app');
View Code
代码中 ...App 相当于 render:h => h(App)
初始化组件App.vue为：


<!-- // src/App.vue -->
<template>
  <div id="wrapper">
    <nav class="navbar navbar-default">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="glyphicon glyphicon-time"></i>
          备忘录
        </a>
        <ul class="nav navbar-nav">
          <li><router-link to="/home">首页</router-link></li>
          <li><router-link to="/time-entries">计划列表</router-link></li>
        </ul>
      </div>
    </nav>
    <div class="container">

      <div class="col-sm-9">
        <router-view></router-view>
      </div>
       <div class="col-sm-3">
         <sidebar></sidebar>
      </div>
    </div>
  </div>
</template>

<script>
  import Sidebar from './components/Sidebar.vue'

  export default {
    components: { 'sidebar': Sidebar },
  }
</script>
<style>
.router-link-active {
  color: red;
}
body {
  margin: 0px;
}
.navbar {
  height: 60px;
  line-height: 60px;
  background: #333;

}
.navbar a {
  text-decoration: none;
}
.navbar-brand {
  display: inline-block;
  margin-right: 20px;
  width: 100px;
  text-align: center;
  font-size: 28px;
  text-shadow: 0px 0px 0px #000;
  color: #fff;
  padding-left: 30px;
}
  .avatar {
    height: 75px;
    margin: 0 auto;
    margin-top: 10px;
    /* margin-bottom: 10px; */
  }

  .text-center {
    margin-top: 0px;
    /* margin-bottom: 25px; */
  }

  .time-block {
    /* padding: 10px; */
    margin-top: 25px;
  }
  .comment-section {
    /* padding: 20px; */
    /* padding-bottom: 15px; */
  }

  .col-sm-9 {
    float: right;
    /* margin-right: 60px; */
    width: 700px;
    min-height: 200px;
    background: #ffcccc;
    padding: 60px;
  }
  .create-plan {
    font-size: 26px;
    color: #fff;
    text-decoration: none;
    display: inline-block;
    width: 100px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    background: #99cc99;
  }
  .col-sm-6 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .col-sm-12 {
    margin-bottom: 10px;
  }
  .btn-primary {
    width: 80px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    background: #99cc99;
    border-radius: 4px;
    border: none;
    color: #fff;
    float: left;
    margin-right: 10px;
    font-size: 14px;
  }
  .btn-danger {
    display: inline-block;
    font-size: 14px;
    width: 80px;
    text-align: center;
    height: 30px;
    line-height: 30px;
    background: red;
    border-radius: 4px;
    text-decoration: none;
    color: #fff;
    margin-bottom: 6px;
  }
  .row {
    padding-bottom: 20px;
    border-bottom: 1px solid #333;
    position: relative;
    background: #f5f5f5;
    padding: 10px;
    /* padding-bottom: 0px; */
  }
  .delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .panel-default {
    position: absolute;
    top: 140px;
    right: 60px;
  }
</style>
View Code
至此，实践结束，一些原理性的东西我还需要多去理解^_^

源代码：【vuex2.0实践】

参考：

vue2.0构建单页应用最佳实战

vuex2.0文档

http://www.cnblogs.com/lvyongbo/p/5946271.html
