import { S0, IBLManager, LUTManager, ResourcePipeline, CubemapLoader, TextureLoader, Node, Mesh, Cube } from 's0-engine';
import { vec3, mat4, quat /* vec4, mat4 */ } from 'gl-matrix';
import CubeTestMaterial from './CubeTestMaterial'

export default class Main {
  constructor() {
    S0.initWith(document.createElement('canvas'));
    this.loadModelTest().then(scene=>{
      let node = new Node();
      node.translation = vec3.fromValues(0,0,0);
      let i = 10;
      node.rotation = quat.fromEuler(quat.create(), i, i, i);
      let test = () => {
        i+=10;
        node.rotation = quat.fromEuler(quat.create(), i, i, i);
        setTimeout(test,500);
      };

      setTimeout(test,1000);
      node.mesh = new Mesh({name:"test cube"});
      let cube = new Cube(1);
      cube._material = new CubeTestMaterial([75 / 255, 188 / 255, 92 / 255]);
      node.mesh._primitives = [cube];
      
      scene.add(node);
    })
  }

  loadModelTest() {
    let loadTasks = [];
    let task = ResourcePipeline.loadAsync('IBL/default/env/cubemap.json', { loaderClass: CubemapLoader })
      .then((cubemap) => {
        IBLManager.specularEnvSampler = cubemap.texture;
        return Promise.resolve();
      });
    loadTasks.push(task);
    task = ResourcePipeline.loadAsync('IBL/default/diffuse/cubemap.json', { loaderClass: CubemapLoader })
      .then((cubemap) => {
        IBLManager.diffuseEnvSampler = cubemap.texture;
        return Promise.resolve();
      });
    loadTasks.push(task);
    task = ResourcePipeline.loadAsync('IBL/brdfLUT.png', { name: 'BRDF_LUT', loaderClass: TextureLoader })
      .then((texture) => {
        IBLManager.brdfLUT = texture.texture;
        return Promise.resolve();
      });
    loadTasks.push(task);
    task = ResourcePipeline.loadAsync('lut/clut_default_a.png', { name: 'clut_default_a', loaderClass: TextureLoader })
      .then((texture) => {
        texture.setTextureMode(0);
        LUTManager.lutTexture = texture.texture;
        return Promise.resolve();
      });
    loadTasks.push(task);
    
    let urls = [
      'Ganfaul/model.gltf'
    ];
    
    return Promise.all(loadTasks).then(
      () => {
        return new Promise((resolve, reject)=>{
          urls.forEach((url) => {
            ResourcePipeline.loadAsync(`${url}`).then(
              (asset) => {
                S0.addScene(asset);
                resolve(asset);
                return asset;
              }
            );
          });
        });
      }
    ).catch((e) => {
      console.error(e);
    });
  }
}

window.mainApp = new Main();