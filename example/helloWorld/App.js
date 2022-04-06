import {
  h
} from '../../lib/guide-mini-vue.esm.js'
import {
  Foo
} from './Foo.js';

window.self = null;


export const App = {
  // 主要是模拟一个 .vue 文件的基本实现内容
  render() {
    window.self = this;
    return h(
      'div', {
        id: 'root',
        class: ['red', 'hard'],
      },
      [
        h('div', {
          onClick: () => console.log('click'),
        }, 'hi, ' + this.msg),
        h(Foo, {
          count: 1,
          onAdd(a, b) {
            console.log('add', a, b)
          },
          onAddFoo(a, b) {
            console.log('addFoo', a, b)
          }
        })
      ]
      // 'hello, ' + this.msg
      // [
      //   h('p', {
      //     class: 'red'
      //   }, 'sec'),
      //   h('p', {
      //     class: 'blue'
      //   }, [h('p', {
      //     class: 'blue'
      //   }, [h('p', {
      //     class: 'blue'
      //   }, 'thr')])])
      // ]
    ); // --> <template> <div>hello, {{msg}}</div> </template>
  },
  setup() {
    return {
      msg: 'vue view'
    }
  }
}
