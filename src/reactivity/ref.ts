import { hasChanged, isObject } from "../shared/index";
import { tiggerEffect, trackEffect, isTracking } from "./effect";
import { reactive } from "./reactive";

class ResImpl {
  private _value: any;
  private _rawValue: any;
  public dep: any;
  public __v_isRef = true;
  constructor(value) {
    // 1. value 是否是对象
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }

  get value() {
    trackRefValue(this);

    return this._value;
  }
  set value(newValue) {
    if (!hasChanged(newValue, this._rawValue)) return;
    this._rawValue = newValue;
    this._value = convert(newValue);
    tiggerEffect(this.dep);
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new ResImpl(value);
}

export function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}

/** 判断是否是一个Ref */
export function isRef(ref) {
  return !!ref.__v_isRef;
}

/** 直接取Ref值，不需要使用Ref.value */
export function unRef(ref) {
  if (isRef(ref)) {
    return ref.value;
  } else {
    return ref;
  }
}

// 场景
// setup(() => { return { ref } })
// Template  {{ref}}  而不是 {{ref.value}}
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key] = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
