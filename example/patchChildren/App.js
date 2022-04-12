import {
  h,
  ref
} from "../../lib/guide-mini-vue.esm.js"

import ArrayToText from './ArrayToText.js'

export const App = {
  name: 'App',
  setup() {},
  render() {
    return h('div', {
      id: 'root',
      ...this.props,
    }, [
      h('div', {
        tId: 1
      }, [
        h('p', {}, '主页'),
        h(ArrayToText)
      ]),
      // h('button', {
      //   onClick: this.onClick
      // }, 'click'),
      // h(
      //   'button', {
      //     onClick: this.onChangePropsDemo1
      //   },
      //   'changeProps - 值改变了 - 修改'
      // ),
      // h(
      //   'button', {
      //     onClick: this.onChangePropsDemo2
      //   },
      //   'changeProps - 值为Undefined'
      // ),
      // h(
      //   'button', {
      //     onClick: this.onChangePropsDemo3
      //   },
      //   'changeProps - onChangePropsDemo3'
      // )
    ])
  }
}
