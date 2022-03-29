# vue

```js
    /** 
     * 
     * 获取依赖的过程
     * 
     * target ---> key ---> dep
     * 
     * */

    // 目标映射 (全局变量)
    const targetMap = new Map();
    // 依赖映射
    const depsMap = targetMap.get(target)
    // 依赖
    const dep = depsMap.get(key)


```