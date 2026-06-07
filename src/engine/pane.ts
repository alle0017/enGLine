import { Service, System, Updatable } from '../ecs/system.js';

type Property = {
      name: string,
      set(value: string): void,
      get(): string,
}
export class Pane {
      private readonly root: HTMLElement = document.createElement('div');
      private readonly props: Property[] = []
      private bindings: Map<string, HTMLInputElement> = new Map();

      constructor() {
            this.root = document.createElement('div');

            this.root.style.width = '220px';
            this.root.style.padding = '5px';
            this.root.style.display = 'flex';
            this.root.style.alignItems = 'center';
            this.root.style.justifyContent = 'center';
            this.root.style.backgroundColor = '#DDD';
            this.root.style.borderRadius = '4px';
      }
      update(): void {
            const dirty: Map<string, Property> = new Map();
            for (let i = 0; i < this.props.length; i++) {
                  const v = this.props[i].get();
                  const k = this.props[i].name;
                  if (this.bindings.has(k) && this.bindings.get(k)?.value == v) {
                        continue;
                  }
                  if (this.bindings.has(k) && this.bindings.get(k) == document.activeElement) {
                        continue;
                  }
                  dirty.set(k, this.props[i]);
            }

            for (const [k,v] of dirty) {
                  if (!this.bindings.has(k)) {
                        const node = document.createElement('div');
                        const input = document.createElement('input');
                        const label = document.createElement('span');

                        console.log(k)
                        console.log(k.length)
                        label.append(k.length > 14 ? k.slice(0,11) + '...': k);

                        label.style.width = '100px';

                        node.style.display = 'flex';
                        node.style.flexDirection = 'row';
                        node.style.gap = '10px';
                        node.style.borderBottom = '1px solid #000';
                        node.style.paddingBottom = '5px';
                        node.style.paddingTop = '5px';

                        input.style.width = '100px';
                        input.style.border = 'none';
                        

                        input.addEventListener('change', () => {
                              v.set(input.value)
                        })
                        node.append(label, input);
                        
                        this.bindings.set(k, input);

                        this.root.style.display = 'flex';
                        this.root.style.flexDirection = 'column';

                        this.root.append(node);
                  }
                  this.bindings.get(k)!.value = v.get();
            }
      }
      append(el: HTMLElement) {
            el.append(this.root);
      }
      bind(prop: Property) {
            this.props.push(prop);
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