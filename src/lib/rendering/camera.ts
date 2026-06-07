export class Camera {
      private readonly matrix = [
            1, 0, 0, 0, 
            0, 1, 0, 0, 
            0, 0, 1, 0,
            0, 0, 0, 1
      ]
      public getMatrix(): number[] {
            return this.matrix;
      }
}