import { Shader } from 's0-engine';

import vsTest from './shaders/unlit.vs.glsl';
import fsTest from './shaders/tile.fs.glsl';

export default class TestMaterial {
  constructor(texture0, texture1) {
    this._texture0 = texture0;
    this._texture1 = texture1;
  }
  use(context) {
    if (!this._shader) {
      this._shader = new Shader(vsTest, fsTest);
      this._shader.compile();
    }
    this._shader.use();
    this._shader.setMat4('uMVP', context.MVP);
    this._shader.setInt('uBaseColorTexture', 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._texture0);
    this._shader.setInt('uNoiseTexture', 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._texture1);
  }
}