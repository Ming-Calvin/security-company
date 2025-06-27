/**
 * 功能完善的深拷贝函数，支持循环引用、Map、Set、Date、RegExp 等。
 * @param obj - 需要进行深拷贝的对象。
 * @param hash - 用于存储已拷贝对象的 WeakMap，防止循环引用。
 * @returns - 拷贝后的新对象。
 */
export function deepClone<T>(obj: T, hash = new WeakMap()): T {
  // 1. 如果是 null、undefined 或非对象类型（原始类型），直接返回值
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 2. 检查缓存，如果已经拷贝过，直接返回缓存中的对象，防止循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 3. 处理特殊的对象类型
  if (obj instanceof Date) {
    // 日期对象
    return new Date(obj) as any;
  }
  if (obj instanceof RegExp) {
    // 正则表达式对象
    return new RegExp(obj) as any;
  }
  if (obj instanceof Map) {
    // Map 对象
    const newMap = new Map();
    hash.set(obj, newMap); // 提前设置缓存
    obj.forEach((value, key) => {
      newMap.set(deepClone(key, hash), deepClone(value, hash));
    });
    return newMap as any;
  }
  if (obj instanceof Set) {
    // Set 对象
    const newSet = new Set();
    hash.set(obj, newSet); // 提前设置缓存
    obj.forEach(value => {
      newSet.add(deepClone(value, hash));
    });
    return newSet as any;
  }

  // 4. 处理数组和普通对象
  //    创建一个新的数组或对象，并保留其原型链
  const clone = Object.create(Object.getPrototypeOf(obj));

  // 5. 关键步骤：在递归拷贝属性之前，先将新创建的克隆对象存入缓存
  hash.set(obj, clone);

  // 6. 使用 Reflect.ownKeys 获取所有类型的键（包括 Symbol 和不可枚举的）
  for (const key of Reflect.ownKeys(obj)) {
    if (typeof key === 'string' || typeof key === 'symbol') {
      clone[key] = deepClone((obj as any)[key], hash);
    }
  }

  return clone;
}
