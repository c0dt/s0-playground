import { engine } from 's0-engine';

export default class Main {
  constructor() {
    engine.initWith(document.createElement('canvas'));
    console.log(engine);
    // Engine.programs
    //   .load('unlit', { vsURL: 'glsl/unlit', fsURL: 'glsl/unlit', metalURL: 'metals/unlit' })
    //   .then((name) => {
    //     Engine.programs.use(name);
    //     Engine.start();
    //   });
  }
}

window.mainApp = new Main();