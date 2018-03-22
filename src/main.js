import {IBLManager, LUTManager, engine} from 's0-engine';
import { ResourcePipeline, CubemapLoader, TextureLoader } from 's0-engine';

export default class Main {
  constructor() {
    engine.initWith(document.createElement('canvas'));

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
      'hero/hero.gltf'
    ];
    Promise.all(loadTasks).then(
      () => {
        urls.forEach((url) => {
          ResourcePipeline.loadAsync(`${url}`).then(
            (asset) => {
              engine._scenes.push(asset);
              console.log(asset);
              return asset;
            }
          );
        });
      }
    ).catch((e) => {
      console.error(e);
    });
  }
}

window.mainApp = new Main();