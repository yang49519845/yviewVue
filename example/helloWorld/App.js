import {
  h
} from '../../lib/guide-mini-vue.esm.js'

export const App = {
  // 主要是模拟一个 .vue 文件的基本实现内容
  render() {
    return h('div', 'hello, ', this.msg); // --> <template> <div>hello, {{msg}}</div> </template>
  },
  setup() {
    return {
      msg: 'vue'
    }
  }
}
