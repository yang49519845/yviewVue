import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {

  patch(vnode, container);

}

export function patch(vnode, container) {

  // 区分 Components 类型与 Element 类型

  // 分析组件，将组件强化后输出
  processComponent(vnode, container)



}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance)

  setupRenderEffect(instance, container);
}


function setupRenderEffect(instance: any, container: any) {
  // vnode Tree
  const subTree = instance.render();

  // vnode -> patch
  //  vnode -> element -> mountElement -> dom
  patch(subTree, container)

}
