import { vec3 } from 'gl-matrix';

export default class Position {
  constructor() {
    this.data = vec3.create();
  }
}