export const extend = Object.assign;

export function isObject(val) {
  return val !== null && typeof val === "object";
}

export const hasChanged = (newValue, val) => !Object.is(newValue, val);

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => { return c ? c.toUpperCase() : '' })
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}
