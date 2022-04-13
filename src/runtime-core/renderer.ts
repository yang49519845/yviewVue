import { createAppAPI } from "./createApp";
import { shapeFlags } from "../shared/SharpeFlags";
import { Fragment, Text } from "./vnode";
import { createComponentInstance, setupComponent } from "./component";
import { effect } from "../reactivity";
import { EMPTY_OBJ } from "../shared";

// 使用闭包进行封装
export function createRender(options) {

  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options;

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

  function processFragment(n1, n2: any, container, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  function patchElement(n1, n2, container, parentComponent) {
    console.log('patchElement')

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el)
    patchChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1: any, n2: any, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag;
    const c1 = n1.children;
    const { shapeFlag } = n2;
    const c2 = n2.children;

    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & shapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlag & shapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
  }

  function patchProps(el, oldProps: any, newProps: any) {

    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (Object.prototype.hasOwnProperty.call(newProps, key)) {
          const prevProps = oldProps[key];
          const nextProps = newProps[key];

          if (prevProps !== nextProps) {
            hostPatchProp(el, key, prevProps, nextProps)
          }
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
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
    } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key];

      hostPatchProp(el, key, null, val)
    }

    hostInsert(el, container);
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach(v => {
      patch(null, v, container, parentComponent)
    })
  }

  function processComponent(n1, n2, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent)
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


