import {
  h,
  renderSlots
} from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  // props is Readonly
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo-init component conent');

    // this.$slots
    return h('div', {}, [foo, renderSlots(this.$slots)])
  }
}
