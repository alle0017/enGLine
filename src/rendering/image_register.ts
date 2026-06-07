function load(img: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {

            const image = new Image();
            image.src = img;
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (e) => reject(e.error))
      })
}
export class ImageRegister<T extends string> {

      public static async import<T extends string>(imgs: T[]) {
            try {
                  const loaded = await Promise.all(imgs.map(load));
                  return new ImageRegister<T>(loaded.map((img, i) => [imgs[i], img]));
            } catch (e) {
                  throw e;
            }
      }

      private readonly registry: Map<string, HTMLImageElement> = new Map;

      private constructor(imgs: [string,HTMLImageElement][]) {
            for (let i = 0; i < imgs.length; i++) {
                  this.registry.set(imgs[i][0], imgs[i][1]);
            }
      }

      public get(key: T) {
            return this.registry.get(key)!;
      }
}