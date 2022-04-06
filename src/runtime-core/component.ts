import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { publicINstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {

  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
  }

  return component;
}

export function setupComponent(instance) {

  initProps(instance, instance.vnode.props)
  // initSlots(instance)

  setupStatefulComponent(instance)

}


function setupStatefulComponent(instance: any) {

  const Component = instance.type;

  // ctx
  instance.proxy = new Proxy({ _: instance }, publicINstanceProxyHandlers)

  const { setup } = Component;

  if (setup) {
    // function | object
    const setupResult = setup(shallowReadonly(instance.props));

    handleSetupResult(instance, setupResult)

  }

}


function handleSetupResult(instance: any, setupResult: any) {

  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  // TODO: 1.0.0 必须写Render
  instance.render = Component.render
}
