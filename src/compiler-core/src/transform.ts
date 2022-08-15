import { NodeTypes } from "./ast";

export function transform(root, options) {

  const context = createTransformContext(root, options)
  // 1. 深度优先搜索
  traverseNode(root, context)
  // 2. 修改 content text
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || []
  }

  return context
}

function traverseNode(node: any,context) {

  const nodeTransforms = context.nodeTransforms

  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node);
  }

  console.log(node)

  // if(node.type === NodeTypes.TEXT) {
  //   node.content = node.content + 'mini-vue'
  // }

  traverseChildren(node, context);
}


function traverseChildren(node: any, context: any) {
  const children = node.children;

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseNode(node, context);
    }
  }
}

