import { render } from './renderer'
import { createVNode } from './vnode'

export function createApp(rootComponent) {
  return {
    mount: function (rootContainer) {
      // rootComponent -> vnode
      // 全都基于vnode进行下一步处理

      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    }
  }
}


