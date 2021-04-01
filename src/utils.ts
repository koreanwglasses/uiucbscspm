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
