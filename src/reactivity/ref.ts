import { hasChanged, isObject } from "../sharde";
import { tiggerEffect, trackEffect, isTracking } from "./effect";
import { reactive } from "./reactive";

class ResImpl {
  private _value: any;
  private _rawValue: any;
  public dep: any;
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
