import { Service, System, Updatable } from '../ecs/system.js';
import { Blade } from './blade.js';

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