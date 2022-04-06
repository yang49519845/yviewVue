import { isObject } from "../sharde/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

export function patch(vnode, container) {
  // debugger;
  // 分析组件，将组件强化后输出
  // 区分 Components 类型与 Element 类型
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const { children, props } = vnode
  const el = document.createElement(vnode.type);
  // // string array
  if (typeof children === 'string') {
    el.textContent = children; // 'hi mini vue';
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }

  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const val = props[key];
      el.setAttribute(key, val)
    }
  }

  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
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
