import {
  h
} from "../../lib/guide-mini-vue.esm.js"

export const Foo = {
  // props is Readonly
  setup(props, {
    emit
  }) {
    const emitAdd = () => {
      emit('add', 1, 2)
      emit('add-foo', 1, 2)
    }

    return {
      emitAdd
    }
  },
  render() {
    return h('button', {
      onClick: this.emitAdd,
    }, 'foo: ' + this.count)
  }
}
