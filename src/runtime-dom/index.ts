import { createRender } from '../runtime-core'

// NOTE: 将DOM层创建过程从Core中抽离出来
function createElement(type) {
  return document.createElement(type)
}

function patchProp(el, key, prevVal, nextVal) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key, nextVal)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}

function insert(child, parent, anchor) {
  // parent.append(child)
  parent.insertBefore(child, anchor || null)
}


function remove(child) {
  const parent = child.parentNode;
  console.log(parent)
  if (parent) {
    console.log(child)
    parent.removeChild(child)
  }
}

function setElementText(el, text) {
  el.textContent = text
}

const renderer: any = createRender({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText
})


export function createApp(...arg) {
  return renderer.createApp(...arg);
}

export * from '../runtime-core';
