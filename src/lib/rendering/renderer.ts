import { Service, Updatable } from '../../ecs/system.js';
import { RenderPass } from '../../rendering/render_pass.js';
import type { World } from '../../ecs/world.js';
import { ImageRegister } from '../../rendering/image_register.js';
import { OrthogonalProjection, Projection } from './projection.js';
import { Camera } from './camera.js';
type ProjectionClass = { new(pass: RenderPass, width: number, height: number, near?: number, far?: number): Projection };
export class Renderer extends Service {
      public readonly pass: RenderPass;
      public readonly camera: Camera;
      public readonly projection: Projection;
      
      constructor(
            world: World, 
            public readonly images: ImageRegister<string>,
            projectionType: ProjectionClass = OrthogonalProjection
      ) {
            super(world);
            const cvs = document.createElement('canvas');
            cvs.width = 800;
            cvs.height = 600;
            document.body.append(cvs);
            this.pass = new RenderPass(cvs);
            this.camera = new Camera();
            this.projection = new projectionType(this.pass, cvs.width, cvs.height);
      }
}