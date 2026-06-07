import type { Pane } from "./pane.js";
type Property = {
      name: string,
      set(value: string): void,
      get(): string,
}
export abstract class Blade {
      public abstract append(pane: Pane): void;
      public abstract update(pane: Pane): void;
}
export class Label extends Blade {
      constructor(private readonly name: string) {
            super();
      }
      public append(pane: Pane): void {
            const b = document.createElement('b');
            b.style.marginTop = '10px';
            b.style.marginBottom = '10px';
            b.innerText = this.name;
            pane.root.append(b);
      }
      public update(pane: Pane): void {}
}
export class Input extends Blade {
      private readonly input: HTMLInputElement;
      private readonly root: HTMLElement;
      constructor(private readonly property: Property) {
            super();
            const node = document.createElement('div');
            const input = document.createElement('input');
            const label = document.createElement('span');

            label.append(property.name.length > 14 ? property.name.slice(0,11) + '...': property.name);

            label.style.width = '100px';

            node.style.display = 'flex';
            node.style.flexDirection = 'row';
            node.style.gap = '10px';
            node.style.borderBottom = '1px solid #000';
            node.style.paddingBottom = '5px';
            node.style.paddingTop = '5px';

            input.style.width = '100px';
            input.style.border = 'none';
            

            input.addEventListener('change', () => property.set(input.value));
            node.append(label, input);
            this.root = node;
            this.input = input;
      }
      public append(pane: Pane): void {
            pane.root.append(this.root);
      }
      public update(root: Pane): void {
            const v = this.property.get();
            if (this.input == document.activeElement) {
                  return;
            }
            if (this.input.value == v) {
                  return;
            }
            this.input.value = v;
      }
}

export class Select extends Blade {
      private readonly input: HTMLSelectElement;
      private readonly root: HTMLElement;
      constructor(private readonly property: Property, options: string[]) {
            super();
            const node = document.createElement('div');
            const input = document.createElement('select');
            const label = document.createElement('span');

            label.append(property.name.length > 14 ? property.name.slice(0,11) + '...': property.name);

            label.style.width = '100px';

            node.style.display = 'flex';
            node.style.flexDirection = 'row';
            node.style.gap = '10px';
            node.style.borderBottom = '1px solid #000';
            node.style.paddingBottom = '5px';
            node.style.paddingTop = '5px';

            input.style.width = '100px';
            input.style.border = 'none';
            options.forEach(opt => {
                  const option = document.createElement('option');
                  option.value = opt;
                  option.innerText = opt;
                  input.append(option);
            })
            input.addEventListener('change', () => property.set(input.value));
            node.append(label, input);
            this.root = node;
            this.input = input;
      }
      public append(pane: Pane): void {
            pane.root.append(this.root);
      }
      public update(root: Pane): void {
            const v = this.property.get();
            if (this.input == document.activeElement) {
                  return;
            }
            if (this.input.value == v) {
                  return;
            }
            this.input.value = v;
      }
}

export class TextInput extends Input {
      constructor(private readonly key: string, private readonly target: { [key]: string } ) {
            super({
                  get() {
                      return target[key];
                  },
                  set(value) {
                      target[key] = value;
                  },
                  name: key
            });
      }
}
export class NumberInput extends Input {
      constructor(private readonly key: string, private readonly target: { [key]: number } ) {
            super({
                  get() {
                      return target[key] + '';
                  },
                  set(value) {
                      target[key] = parseFloat(value);
                  },
                  name: key
            });
      }
}

export class BooleanSelect extends Select {
      constructor(private readonly key: string, private readonly target: { [key]: boolean } ) {
            super({
                  get() {
                      return target[key] + '';
                  },
                  set(value) {
                      target[key] = value == 'true' ? true: false;
                  },
                  name: key
            }, ['true', 'false']);
      }
}