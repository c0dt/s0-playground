import { Shader } from 's0-engine';

import vsTest from './shaders/unlit.vs.glsl';
import fsTest from './shaders/unlit.fs.glsl';

export default class CubeTestMaterial
{
    constructor(color = [1.0,1.0,1.0]) {
        this._color = color;
    }
    use(context) {
        if (!this._shader) {
            this._shader = new Shader(vsTest, fsTest);
            this._shader.compile();
        }
        this._shader.use();
        this._shader.setMat4('uM', context.M);
        this._shader.setMat4('uMV', context.MV);
        this._shader.setMat4('uMVP', context.MVP);
        this._shader.set3fv('uColor', this._color);
    }
}