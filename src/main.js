import { Engine } from 's0-engine';

export default class Main {
  constructor() {
    Engine.initWith(document.createElement('canvas'));

    Engine.programs
      .load('unlit', { vsURL: 'glsl/unlit', fsURL: 'glsl/unlit', metalURL: 'metals/unlit' })
      .then((name) => {
        Engine.programs.use(name);
        Engine.start();
      });
  }
}

window.mainApp = new Main();