import {
  h
} from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  // props is Readonly
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo');

    return h('div', {}, [foo, this.$slots])
  }
}
