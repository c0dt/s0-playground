import { mat4 } from 'gl-matrix';

export default class Transform {
  constructor() {
    this.data = mat4.create();
  }
}