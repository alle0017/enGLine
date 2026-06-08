import { Entity, createEntity } from '../ecs/entity.js';
import { System, Updatable } from '../ecs/system.js';
import type { World } from '../ecs/world.js';
import { Blade, Label, TextInput } from './blade.js';
import { getEntityWhere } from './query.js';

export class Pane extends Blade {
      private readonly blades: Blade[] = []
      
      public readonly root: HTMLElement;
      public bindings: Map<string, HTMLInputElement> = new Map();


      constructor() {
            super();
            this.root = document.createElement('div');

            this.root.style.width = '220px';
            this.root.style.padding = '5px';
            this.root.style.display = 'flex';
            this.root.style.alignItems = 'center';
            this.root.style.justifyContent = 'center';
            this.root.style.backgroundColor = '#DDD';
            this.root.style.borderRadius = '4px';
            this.root.style.display = 'flex';
            this.root.style.flexDirection = 'column';
      }
      update(): void {
            for (let i = 0; i < this.blades.length; i++) {
                  this.blades[i].update(this);
            }
      }
      append(el: Pane) {
            el.root.append(this.root);
      }
      appendToHtml(el: HTMLElement) {
            el.append(this.root);
      }
      bind(prop: Blade) {
            this.blades.push(prop);
            prop.append(this);
      }
}

export class EngineUISystem extends System<Pane> implements Updatable {
      name: string = 'engine-ui';
      protected new(): Pane {
            return new Pane()
      }
      update(dt: number): void {
            for (const v of this.pool.valuesStream()) {
                  v.update();
            }
      }
}
export function CreatePaneFromEntity(id: Entity, world: World) {
      const pane = world.getOrThrow(EngineUISystem).create(createEntity());

      pane.bind(new TextInput('search', {
            get search() {
                  return ''
            },
            set search(value) {
                  console.log(getEntityWhere(world, value));
            }
      }))

      for (const system of world.systemsStream()) {
            const comp = system.get(id);
            if (!comp) {
                  continue;
            }
            pane.bind(new Label(system.name));
            system.pane(pane, comp);
      }
      CreatePaneFromEntity.root.childNodes.forEach(child => child.remove());
      pane.appendToHtml(CreatePaneFromEntity.root)
      if (!CreatePaneFromEntity.root.isConnected) {
            document.body.append(CreatePaneFromEntity.root)
      }
}

CreatePaneFromEntity.root = (() => {
      const root = document.createElement('div');
      root.style.position = 'fixed';
      root.style.left = 'calc(100vw - 240px)';
      root.style.top = '10px';
      return root;
})()