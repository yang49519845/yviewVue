import { shapeFlags } from "../shared/SharpeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container, null);
}

export function patch(vnode, container, parentComponent) {
  // shapeFlags
  // debugger;
  // 分析组件，将组件强化后输出
  // 区分 Components 类型与 Element 类型
  const { type, shapeFlag } = vnode;

  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container)
      break;
    default:
      if (shapeFlag & shapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent)
      } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }
  }
}

function processText(vnode, container) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode)
}

function processFragment(vnode, container, parentComponent) {
  mountChildren(vnode, container, parentComponent)
}

function processElement(vnode, container, parentComponent) {
  mountElement(vnode, container, parentComponent)
}

function processComponent(vnode, container, parentComponent) {
  mountComponent(vnode, container, parentComponent)
}

function mountElement(vnode, container, parentComponent) {
  const { children, shapeFlag, props } = vnode
  const el = (vnode.el = document.createElement(vnode.type));
  // // string array
  if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
    el.textContent = children; // 'hi mini vue';
  } else if (shapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
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

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent)
  })
}

function mountComponent(initialVNode: any, container: any, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent);

  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container);
}


function setupRenderEffect(instance: any, initialVNode, container: any) {
  const { proxy } = instance;
  // vnode Tree
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> mountElement -> dom
  patch(subTree, container, instance)

  // element -> mounted
  initialVNode.el = subTree.el
}
