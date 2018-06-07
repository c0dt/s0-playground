import System from '../ecs/System';
import Transform from '../components/Transform';
import Mesh from '../components/Mesh';
import Texture from '../components/Texture';

export default class RenderSystem extends System {
  static get components() {
    return [
      Transform,
      Mesh,
      Texture
    ];
  }

  update(entity, [transform, mesh, texture]) {
    // let transform = components[0].data;
    // let mesh = components[1];
    // let textureID = components[2];
    console.log(transform, mesh, texture);

    let vao = mesh.vao;
    if (vao) {
      let mode = mesh.mode;
      let elements = mesh.elements;
      let arrays = mesh.arrays;
      gl.bindVertexArray(vao);
      if (elements !== null) {
        gl.drawElements(mode, elements.count, elements.componentType, elements.byteOffset);
      } else {
        gl.drawArrays(mode, arrays.offset, arrays.count);
      }
    }
  }
}