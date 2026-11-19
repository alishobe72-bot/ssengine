/* SS ENGINE 3D SYSTEM */

const SS3D = {
  version: "1.0",

  objects: [],

  createObject(type, name) {
    const object = {
      id: Date.now(),
      type: type,
      name: name || type,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: "#39a2ff"
    };

    this.objects.push(object);
    return object;
  },

  deleteObject(id) {
    this.objects = this.objects.filter(
      object => object.id !== id
    );
  },

  exportScene() {
    return JSON.stringify(this.objects, null, 2);
  },

  saveScene() {
    localStorage.setItem(
      "SS_ENGINE_3D_SCENE",
      this.exportScene()
    );
  },

  loadScene() {
    const data = localStorage.getItem(
      "SS_ENGINE_3D_SCENE"
    );

    this.objects = data ? JSON.parse(data) : [];
    return this.objects;
  }
};

window.SS3D = SS3D;
