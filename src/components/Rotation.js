import { quat } from 'gl-matrix';

export default class Rotation {
  constructor() {
    this.data = quat.create();
  }
}