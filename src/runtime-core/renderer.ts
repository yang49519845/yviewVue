import { shapeFlags } from "../shared/SharpeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container);
}

export function patch(vnode, container) {
  // shapeFlags
  // debugger;
  // 分析组件，将组件强化后输出
  // 区分 Components 类型与 Element 类型
  const { type, shapeFlag } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container)
      break;
    default:
      if (shapeFlag & shapeFlags.ELEMENT) {
        processElement(vnode, container)
      } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
      }
  }
}

function processText(vnode, container) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode)
}

function processFragment(vnode, container) {
  mountChildren(vnode, container)
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountElement(vnode, container) {
  const { children, shapeFlag, props } = vnode
  const el = (vnode.el = document.createElement(vnode.type));
  // // string array
  if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
    el.textContent = children; // 'hi mini vue';
  } else if (shapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  const isOn = (key: string) => /^on[A-Z]/.test(key);

  for (const key in props) {
    const val = props[key];

    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val)
    } else {
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

function mountComponent(initialVNode: any, container: any) {
  const instance = createComponentInstance(initialVNode);

  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container);
}


function setupRenderEffect(instance: any, initialVNode, container: any) {
  const { proxy } = instance;
  // vnode Tree
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> mountElement -> dom
  patch(subTree, container)

  // element -> mounted
  initialVNode.el = subTree.el
}
