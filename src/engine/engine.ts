import { createEntity } from "../ecs/entity.js";
import type { World } from "../ecs/world.js";
import { Blade, Label, TextInput } from "./blade.js";
import { EngineUISystem, Pane } from "./pane.js";
import { getEntityWhere } from "./query.js";

class List extends Pane {
      private readonly items: HTMLElement[];

      constructor(list: string[]) {
            super();
            this.items = list.map(item => {
                  const li = document.createElement('div');
                  li.style.borderBottom = '2px solid';
                  li.style.width = '200px';
                  li.style.textAlign = 'center';
                  li.append(item);
                  this.root.append(li);
                  return li;
            });
      }
      public onClick(callback: (key: string) => void) {
            this.items.forEach(item => {
                  item.addEventListener('click', () => callback(item.textContent));
            })
      }
      public append(pane: Pane): void {
            pane.root.append(this.root);
      }
}
export class Engine {
      private query: string = '';
      private readonly root: Pane;
      private child: Pane | undefined = undefined;
      constructor(private readonly world: World) {
            world.register(EngineUISystem);
            const self = this;
            this.root = world.getOrThrow(EngineUISystem).create(createEntity());
            
            this.root.bind(new TextInput('search', {
                  get search() {
                        return self.query;
                  },
                  set search(value) {
                        self.query = value;
                        self.search();
                  }
            }));
            this.root.root.style.position = 'fixed';
            this.root.root.style.left = 'calc(100vw - 240px)';
            this.root.root.style.top = '10px';
            this.search();
      }
      
      private search(): void {
            if (!this.query) {
                  this.append(new List(['not found']))
            }
            const res = getEntityWhere(this.world, this.query);
            const list = new List(res.map(k => `${k}`));

            list.onClick(id => {
                  const eid = parseInt(id);
                  const pane = this.world.getOrThrow(EngineUISystem).create(createEntity());
                  for (const system of this.world.systemsStream()) {
                        const comp = system.get(eid);
                        if (!comp) {
                              continue;
                        }
                        pane.bind(new Label(system.name));
                        system.pane(pane, comp);
                  }
                  this.append(pane);
            });
            this.append(list);
      }

      public append(pane: Pane): void {
            if (!this.root.root.isConnected) {
                  this.root.appendToHtml(document.body)
            }

            if (this.child) {
                  this.child.root.remove();
            }

            this.child = pane;
            this.child.append(this.root);
      }
      public remove(): void {
            if (this.child) {
                  this.child.root.remove();
            }
            this.root.root.remove();
      }
}