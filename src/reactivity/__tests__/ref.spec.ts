import { effect } from "../effect";
import { reactive } from "../reactive";
import { ref, isRef, unRef, proxyRefs } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;

    effect(() => {
      calls++;
      dummy = a.value;
    });

    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it("should make nested properties reactive", () => {
    const a = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });

    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  });



  it("Object Value Change", () => {
    const a = ref({
      foo: 'foo',
      bar: 'bar'
    });

    let dummy;
    effect(() => {
      dummy = a.value.foo
    });

    expect(dummy).toBe('foo');
    a.value.foo = 'new-foo';
    expect(dummy).toBe('new-foo');
  });

  // isRef  unRef
  it("isRef", () => {
    const a = ref(1);
    const b = 1;
    const user = reactive({ age: 1 });

    expect(isRef(a)).toBe(true);
    expect(isRef(b)).toBe(false);
    expect(isRef(user)).toBe(false);
  });

  it("unRef", () => {
    const a = ref(1);
    const b = 1;

    expect(unRef(a)).toBe(1);
    expect(unRef(b)).toBe(1);
  });

  it("proxyRefs", () => {
    const user = {
      age: ref(1),
      name: "zhangsan",
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(1);
    expect(proxyUser.age).toBe(1);
    expect(proxyUser.name).toBe("zhangsan");
  });
});
