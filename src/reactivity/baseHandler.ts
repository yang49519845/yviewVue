import { extend, isObject } from "../shared/index";
import { tigger, track } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

const set = createSetter();

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      console.log('调用了 isReactive API')
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      console.log('调用了 isReadonly API')
      return isReadonly;
    }
    console.log('设置getter')
    const res = Reflect.get(target, key);

    if (shallow) {
      console.log('浅响应对象')
      return res;
    }

    if (isObject(res)) {
      console.log(isReadonly ? '是一个只读的响应式对象' : '是一个响应式对象')
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      console.log('%c开始依赖收集', 'color:green;')
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
