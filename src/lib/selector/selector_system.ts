import { Entity } from "../../ecs/entity.js";
import { System } from "../../ecs/system.js";

class Selector {
      id: string = '';
      class: string[] = [];
}
export class SelectorSystem extends System<Selector> {
      readonly name: string = 'selector';
      protected new(): Selector {
          return new Selector();
      }
      public getElementById(id: string): Entity | undefined {
            for (const [k,v] of this.pool.stream()) {
                  if (v.id == id) {
                        return k;
                  }
            }
            return undefined;
      }
      public getElementsByClassNames(...classes: string[]) {
            const res: Entity[] = [];
            for (const [k,v] of this.pool.stream()) {
                  if (classes.map(cl => v.class.includes(cl)).reduce((p,n) => p && n, true)) {
                        res.push(k);
                  }
            }
            return res;
      }
}