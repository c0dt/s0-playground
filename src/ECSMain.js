import { vec3, mat4, quat /* vec4, mat4 */ } from 'gl-matrix';

import World from './ecs/World';
import RenderSystem from './systems/RenderSystem';

import Transform from './components/Transform';
import Mesh from './components/Mesh';
import Texture from './components/Texture';


export default class ECSMain {
  constructor() {
    World.Active.addSystem(RenderSystem);
    let mesh = new Mesh({
      vertices: new Float32Array([
        -1.0, 1.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 1.0,
        1.0, -1.0, 0.0, 1.0, 0.0,
      ]),

      indexes: new Uint16Array([
        0, 1, 2,
        3, 2, 1,
      ]),
    });

    let texture = new Texture(0);

    let entity = World.Active.createEntity(Transform, Mesh, Texture);
    World.Active.setEntityData(entity, Transform, new Transform);
    World.Active.setSharedEntityData(entity, Mesh, mesh);
    World.Active.setSharedEntityData(entity, Texture, texture);
    entity = World.Active.createEntity(Transform, Mesh, Texture);
    World.Active.setEntityData(entity, Transform, new Transform);
    World.Active.setSharedEntityData(entity, Mesh, mesh);
    World.Active.setSharedEntityData(entity, Texture, texture);
    
    window.requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    World.Active.update();
    window.requestAnimationFrame(this.animate.bind(this));
  }
}

window.mainApp = new ECSMain();