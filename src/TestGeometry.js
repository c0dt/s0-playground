import { S0 } from 's0-engine';
import getNormals from 'polyline-normals';

export default class TestGeometry {
  constructor() {
    this.vertexData = new Float32Array([
      -1.0, 1.0, 0.0, 0.0, 1.0,
      -1.0, -1.0, 0.0, 0.0, 0.0,
      1.0, 1.0, 0.0, 1.0, 1.0,
      1.0, -1.0, 0.0, 1.0, 0.0
    ]);
    //a triangle 
    let path = [ [0, 122], [0, 190], [90, 190]];
    //get the normals as a closed loop 
    let normals = getNormals(path, true);
    console.log(normals);
  }


  prepare() {
    this.vertexArray = S0.isWebGL2 ? gl.createVertexArray() : ext.createVertexArrayOES();
    this.vertexBuffer = gl.createBuffer();
    S0.isWebGL2 ? gl.bindVertexArray(this.vertexArray) : ext.bindVertexArray(this.vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * 4, 0);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
    gl.enableVertexAttribArray(1);
    S0.isWebGL2 ? gl.bindVertexArray(null) : ext.bindVertexArrayOES(null);

    this._vao = this.vertexArray;
    this._indices = null;
    this._mode = gl.TRIANGLE_STRIP;
    this._drawArraysOffset = 0;
    this._drawArraysCount = 4;
  }
  
}