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
    const age = 18;

    // this.$slots
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age
      }),
      foo,
      renderSlots(this.$slots, 'footer'),
    ])
  }
}
