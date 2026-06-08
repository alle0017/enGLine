import { createEntity, Entity } from "./ecs/entity.js";
import { World, WorldJson } from "./ecs/world.js";
import { CreatePaneFromEntity, EngineUISystem, } from "./engine/pane.js";
import { Label } from "./engine/blade.js";
import { PositionSystem } from "./lib/position/position_system.js";
import { PerspectiveProjection } from "./lib/rendering/projection.js";
import { Renderer } from "./lib/rendering/renderer.js";
import { SelectorSystem } from "./lib/selector/selector_system.js";
import { SpriteRenderer } from "./lib/sprite/sprite_renderer.js";
import { ImageRegister } from "./rendering/image_register.js";
import { Engine } from "./engine/engine.js";

const JSON: WorldJson = {
      entities: [
            {
                  selector: {
                        id: 'smaller',
                        class: ['chameleon']
                  },
                  position: {
                        x: 0, 
                        y: 10,
                        z: 1,
                  },
                  sprite: {
                        img: 'image.png', 
                        scaleX: 0.2,     
                        scaleY: 0.2
                  }
            },
            {
                  selector: {
                        id: 'bigger',
                        class: ['chameleon']
                  },
                  position: {
                        x: 50, 
                        y: 0,
                        z: 1,
                  },
                  sprite: {
                        img: 'image.png', 
                        scaleX: 0.5,     
                        scaleY: 0.5
                  }
            }
      ]
}

const world = new World();



ImageRegister.import(['image.png'])
.then(reg => {
      world.register(PositionSystem)
      world.registerInstance(new Renderer(world, reg, PerspectiveProjection))
      world.register(SpriteRenderer)
      world.register(SelectorSystem)

      world.fromJson(JSON);
      
      const sm = world.getOrThrow(SelectorSystem).getElementById('smaller')!;

      new Engine(world);

      function run() {
            world.run();
            requestAnimationFrame(run);
      }
      run();
})