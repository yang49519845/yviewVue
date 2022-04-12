import { isObject } from "../shared/index";
import {
  mutableHanlders,
  readonlyHanlders,
  shallowOnlyHandlers,
} from "./baseHandler";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  console.log('传入的参数', raw)
  return createReactiveObject(raw, mutableHanlders);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHanlders);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowOnlyHandlers);
}

/////////////////////////////////创建响应式对象开始/////////////////////////////////
function createReactiveObject(target: any, baseHandler) {
  if (!isObject(target)) {
    console.warn('target'.concat(target).concat('必须是一个对象'))
    return
  }

  return new Proxy(target, baseHandler);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
