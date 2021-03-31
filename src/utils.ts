import { ForwardedRef, MutableRefObject } from "react";

export const range = (stop: number) => [
  ...(function* () {
    for (let i = 0; i < stop; i++) {
      yield i;
    }
  })(),
];

/**
 * Takes advantage of JSON.stringify to use objects as keys while comparing by
 * value
 */
export class JSONMap<K, V> {
  private stringMap = new Map<string, V>();

  get(key: K): V {
    return this.stringMap.get(JSON.stringify(key));
  }

  set(key: K, value: V): this {
    this.stringMap.set(JSON.stringify(key), value);
    return this;
  }
}
