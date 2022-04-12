import { createAppAPI } from "./createApp";
import { shapeFlags } from "../shared/SharpeFlags";
import { Fragment, Text } from "./vnode";
import { createComponentInstance, setupComponent } from "./component";

// 使用闭包进行封装
export function createRender(options) {

  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options;

  function render(vnode, container) {
    patch(vnode, container, null);
  }

  function patch(vnode, container, parentComponent) {
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
    // 默认是针对DOM进行操作。
    // 可封装针对 Canvas 进行封装，因为实现过程基本相似 
    // DOM过程 -> document.createElement -> setTextContent -> setAttribute -> body.append()
    // Canvas -> new Element() -> setProps -> append
    const { children, shapeFlag, props } = vnode
    // const el = (vnode.el = document.createElement(vnode.type));
    const el = (vnode.el = hostCreateElement(vnode.type));
    // // string array
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      el.textContent = children; // 'hi mini vue';
    } else if (shapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }


    for (const key in props) {
      const val = props[key];

      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase();
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      hostPatchProp(el, key, val)
    }

    // container.append(el)
    hostInsert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children?.forEach(v => {
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

  return {
    createApp: createAppAPI(render)
  }
}
