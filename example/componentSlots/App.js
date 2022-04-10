import {
  h,
  createTextNode
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
    /**
     * 场景 1
     * <template name="App">
     *  <div>
     *    <Foo>
     *       <p>123</p>
     *    </Foo>
     *  </div>
     * </template>
     */
    // const foo = h(Foo, {}, h('p', {}, '123'));
    /**
     * 场景 2
     * <template name="App">
     *  <div>
     *    <Foo>
     *       <p>123</p>
     *       <p>123</p>
     *       <p>123</p>
     *    </Foo>
     *  </div>
     * </template>
     */
    /**
     * 场景 3 具名插槽
     * <template name="App">
     *  <div>
     *    <Foo>
     *      <template #header>
     *        <p>header</p>
     *      </template>
     *       <p>123</p>
     *      <template #footer>
     *        <p>footer</p>
     *      </template>
     *    </Foo>
     *  </div>
     * </template>
     */
    // const foo = h(Foo, {}, [
    //   h('p', {}, 'header'),
    //   h('p', {}, '456a'),
    //   h('p', {}, 'footer')
    // ]);
    // const foo = h(Foo, {}, {
    //   header: h('p', {}, 'header'),
    //   footer: h('p', {}, 'footer'),
    // });
    /**
     * 场景 3 作用域插槽
     * <template name="App">
     *  <div>
     *    <Foo>
     *      <template #header={ age }>
     *        <p>header {{age}}</p>
     *      </template>
     *       <p>123</p>
     *      <template #footer>
     *        <p>footer</p>
     *      </template>
     *    </Foo>
     *  </div>
     * </template>
     */
    // const foo = h(Foo, {}, {
    //   header: ({
    //     age
    //   }) => h('p', {}, 'header' + age),
    //   footer: () => h('p', {}, 'footer'),
    // });

    const foo = h(Foo, {}, {
      header: ({
        age
      }) => [h('p', {}, 'header' + age), createTextNode('你好')],
      footer: () => h('p', {}, 'footer'),
    });

    return h('div', {}, [app, foo])
  }
}
