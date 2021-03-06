import {
  h,
  ref
} from "../../lib/guide-mini-vue.esm.js";

const nextChildren = 'newChildren';
const prevChildren = [
  h('div', {
    class: 'child-component'
  }, "A"),
  h('div', {
    class: 'child-component'
  }, "B")
]

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange
    }
  },
  render() {
    const self = this;
    return self.isChange === true ?
      h('div', {}, nextChildren) :
      h('div', {}, prevChildren)
  }
}
