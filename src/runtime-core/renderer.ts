import { createAppAPI } from "./createApp";
import { shapeFlags } from "../shared/SharpeFlags";
import { Fragment, Text } from "./vnode";
import { createComponentInstance, setupComponent } from "./component";
import { effect } from "../reactivity";

// 使用闭包进行封装
export function createRender(options) {

  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options;

  function render(vnode, container) {
    patch(null, vnode, container, null);
  }

  function patch(n1, n2, container, parentComponent) {
    // shapeFlags
    // debugger;
    // 分析组件，将组件强化后输出
    // 区分 Components 类型与 Element 类型
    const { type, shapeFlag } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & shapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode)
  }

  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2, container, parentComponent)
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }

  function patchElement(n1, n2, container) {
    console.log(n1, n2)
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountElement(vnode, container, parentComponent) {
    // 默认是针对DOM进行操作。
    // 可封装针对 Canvas 进行封装，因为实现过程基本相似 
    // DOM过程 -> document.createElement -> setTextContent -> setAttribute -> body.append()
    // Canvas -> new Element() -> setProps -> append
    const { children, shapeFlag, props } = vnode
    const el = (vnode.el = hostCreateElement(vnode.type));
    // // string array
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      el.textContent = children; // 'hi mini vue';
    } else if (shapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key];

      hostPatchProp(el, key, val)
    }

    hostInsert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children?.forEach(v => {
      patch(null, v, container, parentComponent)
    })
  }

  function mountComponent(initialVNode: any, container: any, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);

    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container);
  }


  function setupRenderEffect(instance: any, initialVNode, container: any) {
    effect(() => {
      // 抽离出更新逻辑
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));

        patch(null, subTree, container, instance)

        initialVNode.el = subTree.el
        instance.isMounted = true
      } else {
        console.log('update')
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}
