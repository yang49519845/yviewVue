import { extend } from "../shared/index";
let activeEffect;
let shouldTrack;
export class ReactiveEffect {
  private _fn: any;
  deps: any = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;

    const result = this._fn();

    shouldTrack = false;

    return result;
  }
  stop() {
    if (this.active) {
      cleanUpEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanUpEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

/////////////////////////////////收集依赖/////////////////////////////////
let targetMap = new Map();
console.log(
  `%c初始依赖集合`,
  'color: blue',
  targetMap, // Console Message
);
export function track(target, key) {
  if (!isTracking()) return;

  let depsMap = targetMap.get(target);
  // 初始化 depsMap
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
    console.log('初始化DepsMap')
  }
  let dep = depsMap.get(key);
  // 初始化dep
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
    console.log('初始化Dep')
  }
  trackEffect(dep);
}

export function trackEffect(dep) {
  console.log('收集Dep')
  if (dep.has(activeEffect)) {
    console.log('已经存在Dep， 跳过收集')

    return
  };

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
  console.log('收集完成', targetMap)
}

export function isTracking() {
  console.log('%c是否需要收集', 'color: green', shouldTrack && activeEffect !== undefined)
  return shouldTrack && activeEffect !== undefined;
}

/////////////////////////////////执行依赖/////////////////////////////////
export function tigger(target, key) {
  console.log('%c执行依赖集合', 'color:#00a0ea')
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  triggerEffect(dep);
}

export function triggerEffect(dep) {
  // console.log('触发依赖')
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  // fn()

  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
