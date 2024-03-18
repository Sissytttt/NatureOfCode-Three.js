let params = {
  MAX_PARTICLE_NUMBER: 1000,
  WORLD_WIDTH: 1000,
  WORLD_HEIGHT: 300,
  WORLD_DEPTH: 1000,
  Particles_in_scene: 0,
  //
  Line_Num: 3,
  BendMagnitude: 30,
  // 
  FlowPosFreq: 0.005,
  FlowTimeFreq: 0.005,
  MoveSpd: 0.001,
};



let LinePos = [];
let Lines = [];

let pointCloud;
let particles = [];

function setupThree() {

  set_Up_Lines();

  for (let i = 0; i < params.MAX_PARTICLE_NUMBER; i++) {
    let random_line = Math.floor(Math.random() * Lines.length);
    Lines[random_line].addNewParticle();
  }

  // Points
  pointCloud = getPoints(particles);
  scene.add(pointCloud);


  // gui
  let folderBasic = gui.addFolder("WORLD BASIC");
  folderBasic.add(params, "MAX_PARTICLE_NUMBER", 0, 20000).step(1);
  folderBasic.add(params, "WORLD_WIDTH", 0, 2000, 10).onChange(set_Up_Lines);
  folderBasic.add(params, "WORLD_HEIGHT", 0, 2000, 10).onChange(set_Up_Lines);
  folderBasic.add(params, "WORLD_DEPTH", 0, 2000, 10).onChange(set_Up_Lines);
  params.Particles_in_scene = particles.length;
  folderBasic.add(params, "Particles_in_scene").listen();

  let LineFolder = gui.addFolder("Line");
  LineFolder.add(params, "Line_Num", 1, 100, 1).onChange(set_Up_Lines);

  let ParticleFolder = gui.addFolder("Particles");
  ParticleFolder.add(params, "FlowPosFreq", 0, 0.5, 0.0001);
  ParticleFolder.add(params, "FlowTimeFreq", 0, 0.5, 0.0001);
  ParticleFolder.add(params, "MoveSpd", 0, 0.5, 0.0001);


}

function updateThree() {
  while (particles.length < params.MAX_PARTICLE_NUMBER) {
    let random_line = Math.floor(Math.random() * Lines.length);
    Lines[random_line].addNewParticle();
  }

  // update the particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.flow();
    p.move();
    p.adjustVelocity(-0.005);
    p.age();
    if (p.isDone) {
      particles.splice(i, 1);
      i--;
    }
  }

  // then update the points
  let positionArray = pointCloud.geometry.attributes.position.array;
  let colorArray = pointCloud.geometry.attributes.color.array;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let ptIndex = i * 3;
    positionArray[ptIndex + 0] = p.pos.x;
    positionArray[ptIndex + 1] = p.pos.y;
    positionArray[ptIndex + 2] = p.pos.z;
    colorArray[ptIndex + 0] = p.color.r * p.lifespan;
    colorArray[ptIndex + 1] = p.color.g * p.lifespan;
    colorArray[ptIndex + 2] = p.color.b * p.lifespan;
  }
  pointCloud.geometry.setDrawRange(0, particles.length); // ***
  pointCloud.geometry.attributes.position.needsUpdate = true;
  pointCloud.geometry.attributes.color.needsUpdate = true;

  // update GUI
  params.Particles_in_scene = particles.length;
}

function getPoints(objects) {
  const vertices = new Float32Array(objects.length * 3);
  const colors = new Float32Array(objects.length * 3);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const texture = new THREE.TextureLoader().load('assets/particle_texture.jpg');
  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: random(1, 5),
    // sizeAttenuation: true,

    //opacity: 0.50,
    //transparent: true,

    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  // Points
  const points = new THREE.Points(geometry, material);
  return points;
}

function set_Up_Lines() {
  if (LinePos.length > 0 || Lines.length > 0) {
    LinePos = [];
    Lines = [];
  }
  for (let i = 0; i < params.Line_Num; i++) {
    posStartX = random(-params.WORLD_WIDTH / 2, params.WORLD_WIDTH / 2);
    posStartY = random(-params.WORLD_HEIGHT / 2, params.WORLD_HEIGHT / 2);
    posStartY = random(-params.WORLD_DEPTH / 2, params.WORLD_DEPTH / 2);
    posEndX = random(-params.WORLD_WIDTH / 2, params.WORLD_WIDTH / 2);
    posEndY = random(-params.WORLD_HEIGHT / 2, params.WORLD_HEIGHT / 2);
    posEndZ = random(-params.WORLD_DEPTH / 2, params.WORLD_DEPTH / 2);
    LinePos.push([[posStartX, posStartY, posStartY], [posEndX, posEndY, posEndZ]]);
  }
  for (let i = 0; i < params.Line_Num; i++) {
    let line = new Line()
      .set_startPos(...LinePos[i][0])
      .set_endPos(...LinePos[i][1]);
    Lines.push(line);
  }
  // console.log(Lines)
}


// ===================================================================
class Line {
  constructor() {
    this.startPos = createVector();
    this.endPos = createVector();
    return this;
  }

  set_startPos(x, y, z = 0) {
    this.startPos = createVector(x, y, z);
    return this;
  }
  set_endPos(x, y, z = 0) {
    this.endPos = createVector(x, y, z);
    return this;
  }

  addParticles() {
    let proportion = random(1);
    let p_posX = this.startPos.x + proportion * (this.endPos.x - this.startPos.x);
    let p_posY = this.startPos.y + proportion * (this.endPos.y - this.startPos.y);
    let p_posZ = this.startPos.z + proportion * (this.endPos.z - this.startPos.z);
    let xFreq = p_posX * 0.005
    let yFreq = p_posY * 0.005 + frame * 0.005;
    let noiseValue = noise(xFreq, yFreq)
    let noiseBrightness;
    if (noiseValue < 0.2) {
      noiseBrightness = map(noiseValue, 0, 0.2, 0, 0.01);
    }
    else if (noiseValue < 0.5) {
      noiseBrightness = map(noiseValue, 0.2, 0.5, 0, 0.05);
    }
    else if (noiseValue < 0.7) {
      noiseBrightness = map(noiseValue, 0.5, 0.7, 0.05, 2);
    }
    else if (noiseValue < 1) {
      noiseBrightness = map(noiseValue, 0.7, 1, 1, 255);
    }

    let particle = new Particle()
      .setPos(p_posX, p_posY, p_posZ)
      .setColor(noiseBrightness, noiseBrightness, noiseBrightness);
    particles.push(particle);
  }
}


// ============================
class Particle {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();

    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;

    this.lifespan = 1.0;
    this.lifeReduction = random(0.003, 0.05);
    this.isDone = false;

    this.moveScl = random();

    this.color = {
      r: 255,
      g: 255,
      b: 255
    };
    particles.push(this);
  }

  setPos(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setColor(r, g, b) {
    this.color.r = r;
    this.color.g = g;
    this.color.b = b;
    return this;
  }
  setVel(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setScl(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  adjustVelocity(amount) {
    this.vel.mult(1 + amount);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  reappear() {
    if (this.pos.z > params.WORLD_DEPTH / 2) {
      this.pos.z = -params.WORLD_DEPTH / 2;
    }
  }
  disappear() {
    if (this.pos.z > params.WORLD_DEPTH / 2) {
      this.isDone = true;
    }
  }
  age() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }

  flow() {
    let posFreq = params.FlowPosFreq;
    let timeFreq = params.FlowTimeFreq;
    let xFreq = this.pos.x * posFreq + frame * timeFreq;
    let yFreq = this.pos.y * posFreq + frame * timeFreq;
    let zFreq = this.pos.z * posFreq + frame * timeFreq;
    let noiseValue1 = map(noise(xFreq, yFreq, zFreq), 0.0, 1.0, -1.0, 1.0);
    let noiseValue2 = map(noise(xFreq + 1000, yFreq + 1000, zFreq + 1000), 0.0, 1.0, -10, 10);
    let noiseValue3 = map(noise(xFreq + 2000, yFreq + 2000, zFreq + 2000), 0.0, 1.0, -1.0, 1.0);
    let force = new p5.Vector(noiseValue1, noiseValue2, noiseValue3);
    force.normalize();
    force.mult(params.MoveSpd);
    this.applyForce(force);

  }
}