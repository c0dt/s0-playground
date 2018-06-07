export default class OpenGLMesh {
  constructor({ vertexBuffer, indexbuffer }) {
    this.vertexBuffer = vertexBuffer;
    this.indexbuffer = indexbuffer;
    this.vao = 0;
    this.mode = gl.TRIANGLES;
    this.elements = {
      count: 0,
      componentType: 5123,
      byteOffset: 0
    };
  }
}