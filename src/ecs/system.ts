import type { Entity } from "./entity";
import { ParallelMap } from "./parallel_map.js";
import type { World } from './world';

export abstract class Service {
      constructor(protected readonly world: World) {}

      public inject<T extends Service>(system: { new(...args: any[]): T }): T {
            if (!this.world) {
                  throw new Error('Invalid injection. System must be registered to a world to use inject API');
            }
            return this.world.getOrThrow(system);
      }
}
export abstract class System<T extends {}> extends Service {
      abstract readonly name: string;
      protected readonly pool: ParallelMap<T> = new ParallelMap();

      protected abstract new(): T;
      protected fromJson(json: {}): T {
            const obj = this.new();
            for (const [k,v] of Object.entries(json)) {
                  obj[k as keyof T] = v as T[keyof T];
            }
            return obj;
      }     
      public toJson(obj: T): {} {
            return obj as {};
      }

      public get(entity: Entity) {
            return this.pool.get(entity);
      }
      public getOrThrow(entity: Entity) {
            const res = this.pool.get(entity);
            if (!res) {
                  throw new Error('impossible to find entity ' + entity);
            }
            return res;
      }
      public getOrCreate(entity: Entity) {
            let res = this.pool.get(entity);
            if (!res) {
                  res = this.create(entity);
            }
            return res;
      }
      public create(entity: Entity) {
            const obj = this.new();
            this.pool.set(entity, obj);
            return obj;
      }
      public createFromJson(entity: Entity, json: {}) {
            const obj = this.fromJson(json);
            this.pool.set(entity, obj);
            return obj;
      }
      public delete(entity: Entity) {
            this.pool.delete(entity);
      }
      public entities() {
            return this.pool.keysStream();
      }
      public export() {
            const map: Map<number,{}> = new Map;
            for (const [k,v] of this.pool.stream()) {
                  map.set(k, this.toJson(v));
            }
            return map;
      }
}
export interface Updatable {
      update(dt: number): void;
}
/**
 * returns all entities that possesses all the listed systems
 * @param args 
 * @returns 
 */
export function queryAll(...args: System<{}>[]) {
      const base = args[0].entities();
      const res: Entity[] = [];

      for (let i = 0; i < base.length; i++) {
            let flag = true;
            for (let j = 1; j < args.length; j++) {
                  if (!args[j].get(base[i])) {
                        flag = false;
                        break;
                  }     
            }
            if (flag) {
                  res.push(base[i]);
            }
      }
      return res;
}