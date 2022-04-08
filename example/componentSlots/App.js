import {
  h
} from "../../lib/guide-mini-vue.esm.js"

export const App = {
  setup() {
    return {
      msg: 'fei miao'
    }
  },
  render() {

    const app = h('div', {}, 'App');
    const foo = h('div', {}, 'Foo')

    return h('div', {
      id: 'root'
    }, [app, foo])
  }
}
