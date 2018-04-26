import { S0, IBLManager, LUTManager, ResourcePipeline, CubemapLoader, TextureLoader, Node, Mesh, Cube,
  Shader,
  PostProcessingMaterial, PostProcessingManager } from 's0-engine';
import { vec3, mat4, quat /* vec4, mat4 */ } from 'gl-matrix';
import TestMaterial from './TestMaterial';
import TestGeometry from './TestGeometry';

import vsTest from './shaders/Quad.noMVP.vs.glsl';
import fsTest from './shaders/RGBSplit.fs.glsl';
import fs2Test from './shaders/BayerDithering.fs.glsl';
import fs3Test from './shaders/Threshold.fs.glsl';
import fs4Test from './shaders/Mosaic.fs.glsl';

export default class Main {
  constructor() {
    S0.initWith(document.createElement('canvas'));
    this.loadModelTest().then((scene) => {
      // PostProcessingManager.add(new PostProcessingMaterial(new Shader(vsTest, fs4Test)));
      // PostProcessingManager.add(new PostProcessingMaterial(new Shader(vsTest, fsTest)));
      let node = new Node();
      node.translation = vec3.fromValues(0, 0, 0);
      node.scale = vec3.fromValues(0.5, 0.5, 0.5);
      // let i = 10;
      // node.rotation = quat.fromEuler(quat.create(), i, i, i);
      // let test = () => {
      //   i += 10;
      //   node.rotation = quat.fromEuler(quat.create(), i, i, i);
      //   setTimeout(test, 500);
      // };

      // setTimeout(test, 1000);
      node.mesh = new Mesh({ name: "test geometry" });
      let geometry = new TestGeometry();
      geometry._material = new TestMaterial(this.testTexture, this.noiseTexture);
      node.mesh._primitives = [geometry];
      scene.add(node);
    });
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
    task = ResourcePipeline.loadAsync('texture-repetition/gfx00.jpg', { name: 'texture-repetition-gfx00', loaderClass: TextureLoader })
      .then((texture) => {
        // texture.setTextureMode(0);
        this.testTexture = texture.texture;
        return Promise.resolve();
      });
    loadTasks.push(task);
    task = ResourcePipeline.loadAsync('texture-repetition/rgba-noise-small.png', { name: 'rgba-noise-small', loaderClass: TextureLoader })
      .then((texture) => {
        texture.setTextureMode(3);
        this.noiseTexture = texture.texture;
        return Promise.resolve();
      });
    loadTasks.push(task);
    task = ResourcePipeline.loadAsync('texture-repetition/gray-noise-medium.png', { name: 'gray-noise-medium', loaderClass: TextureLoader })
      .then((texture) => {
        texture.setTextureMode(3);
        this.noiseTexture = texture.texture;
        return Promise.resolve();
      });
    loadTasks.push(task);
    let urls = [
      'Ganfaul/model.gltf'
    ];
    
    return Promise.all(loadTasks).then(
      () => {
        return new Promise((resolve, reject) => {
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