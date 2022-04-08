import {
  h
} from "../../lib/guide-mini-vue.esm.js"
import {
  Foo
} from './Foo.js'

export const App = {
  setup() {
    return {
      msg: 'fei miao'
    }
  },
  render() {

    const app = h('div', {}, 'App init content');
    const foo = h(Foo, {}, h('p', {}, '123'));
    // const foo = h(Foo, {}, [h('p', {}, '123'), h('p', {}, '456a')]);

    /**
     * // 情景1
     * <template name="App">
     *  <div>
     *    <Foo>
     *       <p>123</p>
     *    </Foo>
     *  </div>
     * </template>
     * 
     * // 情景2
     * <template name="App">
     *  <div>
     *    <Foo>
     *       <p>123</p>
     *       <p>123</p>
     *       <p>123</p>
     *    </Foo>
     *  </div>
     * </template>
     * 
     *  */
    return h('div', {}, [app, foo])
  }
}
