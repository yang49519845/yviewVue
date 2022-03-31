import { computed } from "../computed";
import { reactive } from "../reactive";

describe("reactivity/computed", () => {
  it("happy path", () => {
    const value = reactive({
      foo: 1,
    });
    const cValue = computed(() => {
      return value.foo;
    });

    expect(cValue.value).toBe(1);
    // value.foo = 2;
    // expect(cValue.value).toBe(2);
  });

  it("should computed lazily", () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // // // should not computed again
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // // // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    cValue.value;
    expect(getter).toBeCalledTimes(2);
  });
});
