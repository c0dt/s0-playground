
class ComponentManager {
  constructor(componentType) {
    this._componentType = componentType;
    this._components = [];
    this._entities = new Int32Array(100);
    this._map = {};
  }

  get(entity) {
    let index = this._map[entity];
    return this._components[index];
  }

  setEntityData(entity, componentData) {
    let index = this._map[entity];
    let component = this._components[index];
    if (!component) {
      component = this._components[index] = new this._componentType();
    }
    for (let key in componentData) {
      if (componentData.hasOwnProperty(key)) {
        component[key] = componentData[key];
      }
    }
  }

  setSharedEntityData(entity, componentData) {
    let index = this._map[entity];
    this._components[index] = componentData;
  }

  create(entity) {
    for (let i = 0; i < this._entities.length; i++) {
      if (this._entities[i] === 0) {
        this._entities[i] = entity; 
        this._map[entity] = i;
        break;
      }
    }
  }
}

let EntityID = 1;
class EntityManager {
  constructor() {
    this._length = 10000;
    this._entities = new Int32Array(this._length);
  }
  
  create() {
    let length = this._length;
    let i = 0;
    for (i = 0; i < length; i++) {
      if (this._entities[i] === 0) {
        this._entities[i] = EntityID;
        EntityID++;
        break;
      }
    }
    return this._entities[i];
  }

  get entities() {
    return this._entities;
  }
}

export default class World {
  constructor() {
    this._systems = [];
    this._componentManagers = {};
    this._entityManager = new EntityManager();
  }

  _getComponentManager(component) {
    let componentManager = this._componentManagers[component.name];
    if (!componentManager) {
      componentManager = this._componentManagers[component.name] = new ComponentManager(component);
    }
    return componentManager;
  }

  addSystem(system) {
    system.components.forEach((component) => {
      this._getComponentManager(component);
    });
    this._systems.push({
      instance: new system(),
      type: system
    });
  }

  update() {
    this._systems.forEach((x) => {
      this._entityManager.entities.forEach((entity) => {
        if (entity === 0) {
          return;
        }
        let componentLength = x.type.components.length;
        let componentDataArray = x.type.components.reduce((accumulator, component) => {
          let data = this._componentManagers[component.name].get(entity);
          if (data !== null) {
            accumulator.push(data);
          }
          return accumulator;
        }, []);
        if (componentDataArray.length === componentLength) {
          x.instance.update(entity, componentDataArray);
        }
      });
    });
  }

  createEntity(...components) {
    let entity = this._entityManager.create();
    components.forEach((component) => {
      let componentManager = this._getComponentManager(component);
      componentManager.create(entity);
    });
    return entity;
  }

  setEntityData(entity, componentType, componentData) {
    this._componentManagers[componentType.name].setEntityData(entity, componentData);
  }

  setSharedEntityData(entity, componentType, componentData) {
    this._componentManagers[componentType.name].setSharedEntityData(entity, componentData);
  }
}

World.Active = new World();