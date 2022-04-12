import { createRender } from '../runtime-core'

// NOTE: 将DOM层创建过程从Core中抽离出来
function createElement(type) {
  return document.createElement(type)
}

function patchProp(el, key, val) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, val)
  } else {
    el.setAttribute(key, val)
  }
}

function insert(el, parent) {
  parent.append(el)
}


const renderer: any = createRender({
  createElement,
  patchProp,
  insert
})


export function createApp(...arg) {
  return renderer.createApp(...arg);
}

export * from '../runtime-core';
