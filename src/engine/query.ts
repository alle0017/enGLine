import type { Entity } from "../ecs/entity";
import type { World } from "../ecs/world";

type QueryParam = {
      system: string,
      property: string,
      value: string
}
/**
 * 
 * @param query - query in form id[system.property=value][system.property=value][system.property=value]
 */
function parseQuery(query: string) {
      query = query.replaceAll(' ', '');
      let i = 0;
      let id: string = '';
      const properties: QueryParam[] = [];

      while (i < query.length && query[i] != '[') {
            id += query[i];
            i++;
      }
      if (id) {
            return {
                  id: parseInt(id),
                  properties
            };
      }
      
      while (i < query.length) {
            i++;
            let system = '';
            let property = '';
            let value = '';
            while (i < query.length && query[i] != '.' && query[i] != ']') {
                  system += query[i];
                  i++;
            }
            if (i < query.length && query[i] == '.') {
                  i++;
            }
            while (i < query.length && query[i] != '=' && query[i] != ']') {
                  property += query[i];
                  i++;
            }
            if (i < query.length && query[i] == '=') {
                  i++;
            }
            while (i < query.length && query[i] != ']') {
                  value += query[i];
                  i++;
            }
            i++;
            properties.push({ system, property, value });
      }
      return {
            id: id ? parseInt(id): undefined, 
            properties
      }
}


export function getEntityWhere(world: World, query: string) {
      const { id, properties } = parseQuery(query);

      if (typeof id == 'number') {
            return [id];
      }
      const sets: Set<Entity>[] = [];

      for (const {system, value, property} of properties) {
            const sys = world.getByNameOrThrow(system);
            const es = sys.entities();
            const set: Set<Entity> = new Set;

            for (let i = 0; i < es.length; i++) {
                  if (es[i] < 0) {
                        continue;
                  }
                  if ((sys.getOrThrow(es[i])[property]  + '') == value) {
                        set.add(es[i]);
                  }
            }
            sets.push(set);
      }
      if (sets.length <= 0) {
            return [];
      }
      return [...sets.reduce((p,c) => c.intersection(p))];
}
