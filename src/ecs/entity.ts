export type Entity = number;

export const createEntity: () => Entity = (() => {
      let id = 0;
      return () => id++;
})();