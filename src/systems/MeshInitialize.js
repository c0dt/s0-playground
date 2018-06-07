import System from '../ecs/System';
import Mesh from '../components/Mesh';

export default class MeshInitialize extends System {
  static get components() {
    return [
      Mesh
    ];
  }
    
  update(entity, [mesh]) {
      
  }
}