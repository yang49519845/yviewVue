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
  return createActiveObject(raw, mutableHanlders);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHanlders);
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowOnlyHandlers);
}

///////////////////////////////////////////////////////////////////
function createActiveObject(raw: any, baseHandler) {
  return new Proxy(raw, baseHandler);
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
