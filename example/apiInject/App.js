import {
  h,
  provide,
  inject
} from '../../lib/guide-mini-vue.esm.js'


window.self = null;

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal');
    provide('bar', 'barVal');
  },
  render() {
    return h('div', {}, [
      h('p', {}, "Provider Demo"),
      h(ProviderTwo)
    ])
  },
}

const ProviderTwo = {
  name: 'ProviderTwo',
  setup() {
    provide('foo', 'fooTwo')

    const foo = inject('foo')

    return {
      foo
    }
  },
  render() {
    return h('div', {}, [
      h('p', {}, "Provider Two Demo: " + this.foo),
      h(Consumer)
    ])
  },
}

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo');
    const bar = inject('bar');
    // const baz = inject('baz', 'baz Default');
    const baz = inject('baz', () => 'baz Default');
    return {
      foo,
      bar,
      baz
    }
  },
  render() {
    return h('div', {}, 'Consumer: -' + this.foo + ' - ' + this.bar + ' --- ' + this.baz)
  }
}

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [
      h('p', {}, 'api inject'),
      h(Provider)
    ])
  }
}
