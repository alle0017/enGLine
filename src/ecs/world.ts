import { createEntity } from './entity.js';
import { System, Updatable, Service } from './system.js';
type InjectableClass<T extends Service = Service> = { new(world: World): T };
export type WorldJson = {
      entities: Record<string, {}>[];
}
export class World {
      private readonly services: Map<InjectableClass, Service> = new Map();
      private readonly systems: Map<string, System<{}>> = new Map();
      private readonly updatable: Set<Updatable> = new Set();
      private last: number = performance.now();

      public register(systemClass: InjectableClass) {
            const system = new systemClass(this);

            if ('update' in system && typeof system.update == 'function') {
                  this.updatable.add(system as Updatable);
            }
            if ('name' in system && typeof system.name == 'string') {
                  this.systems.set(system.name, system as System<{}>);
            }
            
            this.services.set(systemClass, system);
      }
      public registerInstance(system: Service) {

            if ('update' in system && typeof system.update == 'function') {
                  this.updatable.add(system as Updatable);
            }

            if ('name' in system && typeof system.name == 'string') {
                  this.systems.set(system.name, system as System<{}>);
            }

            this.services.set(system.constructor as InjectableClass, system);
      }
      public get<T extends Service>(system: InjectableClass<T>): T | undefined {
            return this.services.get(system) as T;
      }
      public getOrThrow<T extends Service>(system: InjectableClass<T>): T {
            if (!this.services.has(system)) {
                  throw new Error('component of class ' + system.toString() + ' was not registered. ensure it is registered before being required')
            }
            return this.services.get(system) as T;
      }
      public getByNameOrThrow<T extends System<any>>(system: string): T {
            if (!this.systems.has(system)) {
                  throw new Error('component of class ' + system.toString() + ' was not registered. ensure it is registered before being required')
            }
            return this.systems.get(system) as T;
      }
      public run() {
            const curr = performance.now()
            this.updatable.forEach(system => 
                  system.update(curr - this.last)
            );
            this.last = performance.now();
      }
      public fromJson(json: WorldJson) {
            for (let i = 0; i < json.entities.length; i++) {
                  const entity = createEntity();
                  for (const [k,v] of Object.entries(json.entities[i])) {
                        this.getByNameOrThrow(k).createFromJson(entity, v);
                  }
            }
      }

      public toJson(): WorldJson {
            const entities = new Map<number, Record<string, {}>>();

            for (const system of this.services.values()) {
                  if (!(system instanceof System)) {
                        continue;   
                  }
                  for (const entity of system.entities()) {
                        if (!entities.has(entity)) {
                              entities.set(entity, {});
                        }

                        entities.get(entity)![system.name] = system.toJson(system.getOrThrow(entity));
                  }
            }

            return {
                  entities: [...entities.values()]
            };
      }
}