import {
  h
} from '../../lib/guide-mini-vue.esm.js'

export const App = {
  // 主要是模拟一个 .vue 文件的基本实现内容
  render() {
    return h(
      'div', {
        id: 'root',
        class: ['red', 'hard']
      },
      // 'hello, ' + this.msg
      [
        h('p', {
          class: 'red'
        }, 'sec'),
        h('p', {
          class: 'blue'
        }, [h('p', {
          class: 'blue'
        }, [h('p', {
          class: 'blue'
        }, 'thr')])])
      ]
    ); // --> <template> <div>hello, {{msg}}</div> </template>
  },
  setup() {
    return {
      msg: 'vue'
    }
  }
}
