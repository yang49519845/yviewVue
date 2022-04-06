import { extend, isObject } from "../shared/index";
import { tigger, track } from "./effect";
import { isReadonly, reactive, ReactiveFlas, readonly } from "./reactive";

const get = createGetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlas.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlas.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);

    if (shallow) {
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    tigger(target, key);
    return res;
  };
}

export const mutableHanlders = {
  get,
  set,
};

export const readonlyHanlders = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key：${key} 不可被set`);
    return true;
  },
};

export const shallowOnlyHandlers = extend({}, readonlyHanlders, {
  get: shallowReadonlyGet,
});
