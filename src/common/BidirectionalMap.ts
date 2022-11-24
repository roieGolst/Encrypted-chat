//Reserved credit for https://github.com/educastellano/bidirectional-map
export default class BidirectionalMap<K, V> {
    private readonly map: Map<K, V> = new Map();
    private readonly reverse: Map<V, K> = new Map();

    constructor() {
      this.map = new Map();
      this.reverse = new Map();
    }

    get size (): number {
      return this.map.size;
    }

    set(key: K, value: V) {
      this.map.set(key, value);
      this.reverse.set(value, key);
    }

    get(key: K): V | undefined {
      return this.map.get(key);
    }

    getKey(value: V): K | undefined {
      return this.reverse.get(value);
    }

    clear() {
      this.map.clear();
      this.reverse.clear();
    }

    delete(key: K): boolean {
      const value = this.map.get(key);

      if(!value) {
        return false;
      }
      return this.reverse.delete(value) && this.map.delete(key);
    }

    deleteValue(value: V): boolean {
      let key = this.reverse.get(value)
      
      if(!key) {
        return false;
      }
      
      return this.reverse.delete(value) && this.map.delete(key);
    }

    entries(): IterableIterator<[K, V]> {
      return this.map.entries();
    }

    has(key: K): boolean {
      return this.map.has(key);
    }

    hasValue(value: V): boolean {
      return this.reverse.has(value)
    }

    keys(): IterableIterator<K> {
      return this.map.keys();
    }

    values(): IterableIterator<V> {
      return this.map.values();
    }
}