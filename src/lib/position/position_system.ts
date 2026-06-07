import { System } from '../../ecs/system.js';

export type Position = {
      x: number,
      y: number, 
      z: number,
};

export class PositionSystem extends System<Position> {
      readonly name: string = 'position';
      private asNumber(json: Record<string,unknown>, key: string) {
            return key in json && typeof json[key] == 'number' ? json[key]: 0;
      }
      protected new(): Position {
            return { x: 0, y: 0, z: 1 };
      }
}