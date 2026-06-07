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
export class TextInput extends Blade {
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