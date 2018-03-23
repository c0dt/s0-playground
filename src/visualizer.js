import { S0, Scene, Node, IBLManager, LUTManager, ResourcePipeline, CubemapLoader, TextureLoader} from 's0-engine';

export default class Main {
  constructor() {
    S0.initWith(document.createElement('canvas'));

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
    
    Promise.all(loadTasks).then(
      () => {
        let scene = new Scene();
        let node = new Node({
          name: "test"
        })
        scene.add(node);
        console.log(scene);
        S0.addScene(scene);
      }
    ).catch((e) => {
      console.error(e);
    });
  }
}

window.mainApp = new Main();