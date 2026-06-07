export class ParallelMap<T> {
      private static readonly DELETED = -1;
      private static readonly MIN_SIZE = 10;
      private size: number = 0;
      private keys: Int32Array;
      private readonly values: T[] = [];

      constructor() {
            this.keys = new Int32Array(ParallelMap.MIN_SIZE).fill(-1);
      }
      private resize() {
            const pool = new Int32Array(this.keys.length * 2).fill(-1);
            for (let i = 0; i < this.keys.length; i++) {
                  pool[i] = this.keys[i];
            }
            this.keys = pool;
      }

      public valuesStream() {
            return this.values.filter((v,i) => this.keys[i] >= 0);
      }
      public stream() {
            return this.values.map((v, i) => [this.keys[i], v] as [number, T]).filter(v => v && v[0] >= 0);
      }
      public keysStream() {
            return this.keys;
      }
      public clear(): void {
            this.keys = new Int32Array(ParallelMap.MIN_SIZE).fill(-1);
            this.values.length = 0;
            this.size = 0;
      }
      public delete(key: number): boolean {
            for (let i = 0; i < this.keys.length; i++) {
                  if (this.keys[i] == key) {
                        this.keys[i] = ParallelMap.DELETED;
                        (this.values as unknown[])[i] = undefined;
                        this.size--;
                        return true;
                  }
            }
            return false;
      }
      public get(key: number): T | undefined {
            if (key < 0) {
                  return undefined;
            }

            for (let i = 0; i < this.keys.length; i++) {
                  if (this.keys[i] == key) {
                        return this.values[i];
                  }
            }
      }
      public has(key: number): boolean {
            for (let i = 0; i < this.keys.length; i++) {
                  if (this.keys[i] == key) {
                        return true;
                  }
            }
            return false;
      }
      public set(key: number, value: T): this {
            let blankSpot = ParallelMap.DELETED;

            for (let i = 0; i < this.keys.length; i++) {
                  if (this.keys[i] == key) {
                        this.values[i] = value;
                        return this;
                  } else if (this.keys[i] < 0) {
                        blankSpot = i;
                  }
            }

            if (blankSpot >= 0) {
                  this.keys[blankSpot] = key;
                  this.values[blankSpot] = value;
                  this.size++;
                  return this;
            }

            if (this.size == this.keys.length) {
                  this.resize();
            }

            this.keys[this.size] = key;
            this.values[this.size] = value;
            this.size++;

            return this;
      }
      public sort(lambda: (a: [number,T], b: [number,T]) => number) {
            const sorted = this.values.map((v,i) => [this.keys[i], v] as [number,T]).filter(([k]) => k >= 0).sort(lambda);
            for (let i = 0; i < sorted.length; i++) {
                  this.keys[i] = sorted[i][0];
                  this.values[i] = sorted[i][1];
            }
            for (let i = sorted.length; i < this.keys.length; i++) {
                  this.keys[i] = -1;
            }
      }
}