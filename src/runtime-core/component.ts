export function createComponentInstance(vnode) {

  const component = {
    vnode,
  }

  return component;
}

export function setupComponent(instance) {

  // initProps(instance)
  // initSlots(instance)

  setupStatefulComponent(instance)

}


function setupStatefulComponent(instance) {

  const Component = instance.vnode.type;

  const { setup } = Component;

  if (setup) {
    // function | object
    const setupResult = setup();

    handleSetupResult(instance, setupResult)

  }

}


function handleSetupResult(instance: any, setupResult: any) {

  if (typeof setupResult === 'object') {
    instance.setup = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  // TODO: 1.0.0 必须写Render
  instance.render = Component.render
}
