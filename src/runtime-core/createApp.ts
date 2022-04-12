import { createVNode } from './vnode'

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount: function (rootContainer) {
        let rootDom = rootContainer;
        // rootComponent -> vnode
        // 全都基于vnode进行下一步处理
        if (typeof rootContainer === 'string') {
          const root = document.createElement('div');
          root.setAttribute('id', rootContainer);
          document.body.childNodes[0].before(root);
          rootDom = root
        }

        const vnode = createVNode(rootComponent)
        render(vnode, rootDom)
      }
    }
  }
}


