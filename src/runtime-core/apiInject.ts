import { getCurrentInstance } from "./component";

// # 与 react Context 相似 都是用来跨组件传参.

export function provide(key, value) {
  const currentIstance: any = getCurrentInstance();
  // instance.providers
  if (currentIstance) {
    let { provides } = currentIstance;
    const parentProvides = currentIstance.parent.provides;

    // init 
    if (provides === parentProvides) {
      provides = currentIstance.provides = Object.create(parentProvides);
    }


    provides[key] = value;
  }
}

export function inject(key, defaultValue) {
  const currentIstance: any = getCurrentInstance();
  if (currentIstance) {
    const parentProvides = currentIstance.parent.provides;

    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      }
      return defaultValue;
    }

  }
}
