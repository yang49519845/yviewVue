import { isObject } from "../shared/index";
import {
  mutableHanlders,
  readonlyHanlders,
  shallowOnlyHandlers,
} from "./baseHandler";

export const enum ReactiveFlas {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHanlders);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHanlders);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowOnlyHandlers);
}

///////////////////////////////////////////////////////////////////
function createReactiveObject(target: any, baseHandler) {

  if (!isObject(target)) {
    console.warn('target'.concat(target).concat('必须是一个对象'))
    return
  }

  return new Proxy(target, baseHandler);
}

export function isReactive(value) {
  return !!value[ReactiveFlas.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlas.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
