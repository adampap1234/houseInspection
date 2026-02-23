/**
 * Procedural Apartment GLB Generator
 *
 * Generates a walkthrough-able apartment interior with 5 rooms:
 * - Living room (start) — wall humidity inspection point
 * - Kitchen — connected to living room
 * - Hallway — connecting corridor
 * - Bathroom — electrical inspection point
 * - Bedroom — window thermal camera point
 *
 * Uses @gltf-transform/core (Node.js native) instead of Three.js GLTFExporter.
 * Output: public/models/house.glb
 */

import { Document, NodeIO } from '@gltf-transform/core';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const OUTPUT_PATH = 'public/models/house.glb';

// ─── Room dimensions (meters) ───────────────────────────────────
const WALL_HEIGHT = 2.8;
const WALL_THICKNESS = 0.15;

const rooms = {
  living:   { x: 0,                          z: 0,                          w: 5,   d: 4 },
  kitchen:  { x: 5 + WALL_THICKNESS,         z: 0,                          w: 3.5, d: 4 },
  hallway:  { x: 0,                          z: -(2 + WALL_THICKNESS),      w: 8.65, d: 2 },
  bathroom: { x: 0,                          z: -(4 + 2 * WALL_THICKNESS),  w: 3,   d: 2.5 },
  bedroom:  { x: 3 + WALL_THICKNESS,         z: -(4 + 2 * WALL_THICKNESS),  w: 5.5, d: 3.5 },
};

// ─── Color helpers ──────────────────────────────────────────────
function hexToRGB(hex) {
  return [
    ((hex >> 16) & 0xff) / 255,
    ((hex >> 8) & 0xff) / 255,
    (hex & 0xff) / 255,
  ];
}

// ─── Material definitions ───────────────────────────────────────
const materialDefs = {
  wall:         { color: 0xe8ddd0, roughness: 0.85, metalness: 0.0 },
  floor:        { color: 0x8b6914, roughness: 0.6,  metalness: 0.0 },
  ceiling:      { color: 0xf5f0e8, roughness: 0.9,  metalness: 0.0 },
  windowFrame:  { color: 0xf0f0f0, roughness: 0.3,  metalness: 0.1 },
  windowGlass:  { color: 0x88bbdd, roughness: 0.05, metalness: 0.1, alpha: 0.3 },
  outlet:       { color: 0xf0f0f0, roughness: 0.4,  metalness: 0.0 },
  tile:         { color: 0xd4cfc8, roughness: 0.4,  metalness: 0.05 },
  moisture:     { color: 0x9a8a6e, roughness: 0.95, metalness: 0.0 },
  baseboard:    { color: 0xf5f0e8, roughness: 0.6,  metalness: 0.0 },
};

// ─── Box geometry generator ─────────────────────────────────────
function createBoxGeometry(w, h, d) {
  const hw = w / 2, hh = h / 2, hd = d / 2;

  // 6 faces, 4 vertices each = 24 vertices
  // prettier-ignore
  const positions = new Float32Array([
    // Front face (z+)
    -hw, -hh,  hd,   hw, -hh,  hd,   hw,  hh,  hd,  -hw,  hh,  hd,
    // Back face (z-)
    -hw, -hh, -hd,  -hw,  hh, -hd,   hw,  hh, -hd,   hw, -hh, -hd,
    // Top face (y+)
    -hw,  hh, -hd,  -hw,  hh,  hd,   hw,  hh,  hd,   hw,  hh, -hd,
    // Bottom face (y-)
    -hw, -hh, -hd,   hw, -hh, -hd,   hw, -hh,  hd,  -hw, -hh,  hd,
    // Right face (x+)
     hw, -hh, -hd,   hw,  hh, -hd,   hw,  hh,  hd,   hw, -hh,  hd,
    // Left face (x-)
    -hw, -hh, -hd,  -hw, -hh,  hd,  -hw,  hh,  hd,  -hw,  hh, -hd,
  ]);

  // prettier-ignore
  const normals = new Float32Array([
    // Front
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ]);

  // prettier-ignore
  const indices = new Uint16Array([
    0,1,2, 0,2,3,       // front
    4,5,6, 4,6,7,       // back
    8,9,10, 8,10,11,    // top
    12,13,14, 12,14,15, // bottom
    16,17,18, 16,18,19, // right
    20,21,22, 20,22,23, // left
  ]);

  return { positions, normals, indices };
}

// ─── Build the GLB ──────────────────────────────────────────────
const doc = new Document();
const buffer = doc.createBuffer();

// Create materials
const materials = {};
for (const [name, def] of Object.entries(materialDefs)) {
  const mat = doc.createMaterial(name)
    .setBaseColorFactor([...hexToRGB(def.color), def.alpha ?? 1.0])
    .setRoughnessFactor(def.roughness)
    .setMetallicFactor(def.metalness);
  if (def.alpha !== undefined && def.alpha < 1) {
    mat.setAlphaMode('BLEND');
  }
  materials[name] = mat;
}

// Helper: create a box mesh node at a given position
function addBox(parent, name, w, h, d, materialName, px, py, pz) {
  const { positions, normals, indices } = createBoxGeometry(w, h, d);

  const posAccessor = doc.createAccessor()
    .setType('VEC3')
    .setArray(positions)
    .setBuffer(buffer);

  const normAccessor = doc.createAccessor()
    .setType('VEC3')
    .setArray(normals)
    .setBuffer(buffer);

  const idxAccessor = doc.createAccessor()
    .setType('SCALAR')
    .setArray(indices)
    .setBuffer(buffer);

  const prim = doc.createPrimitive()
    .setAttribute('POSITION', posAccessor)
    .setAttribute('NORMAL', normAccessor)
    .setIndices(idxAccessor)
    .setMaterial(materials[materialName]);

  const mesh = doc.createMesh(name).addPrimitive(prim);
  const node = doc.createNode(name)
    .setMesh(mesh)
    .setTranslation([px, py, pz]);

  parent.addChild(node);
  return node;
}

// ─── Scene root ─────────────────────────────────────────────────
const scene = doc.createScene('apartment');
const rootNode = doc.createNode('root');
scene.addChild(rootNode);

// ─── Room builder ───────────────────────────────────────────────
function buildRoom(name, room, floorMaterial, options = {}) {
  const groupNode = doc.createNode(name);
  rootNode.addChild(groupNode);

  const { x, z, w, d } = room;
  const cx = x + w / 2;
  const cz = z - d / 2;

  // Floor
  addBox(groupNode, `${name}_floor`, w, 0.05, d, floorMaterial, cx, 0.025, cz);

  // Ceiling
  addBox(groupNode, `${name}_ceiling`, w, 0.05, d, 'ceiling', cx, WALL_HEIGHT, cz);

  const windowDefs = options.windows || [];

  // Back wall (positive z side)
  if (!options.skipBackWall) {
    addBox(groupNode, `${name}_back`, w, WALL_HEIGHT, WALL_THICKNESS, 'wall',
      cx, WALL_HEIGHT / 2, z + WALL_THICKNESS / 2);
    addWindows(groupNode, `${name}_back`, windowDefs.filter(w => w.wall === 'back'),
      { cx, cz: z + WALL_THICKNESS / 2, rotated: false });
  }

  // Front wall (negative z side)
  if (!options.skipFrontWall) {
    addBox(groupNode, `${name}_front`, w, WALL_HEIGHT, WALL_THICKNESS, 'wall',
      cx, WALL_HEIGHT / 2, z - d - WALL_THICKNESS / 2);
    addWindows(groupNode, `${name}_front`, windowDefs.filter(w => w.wall === 'front'),
      { cx, cz: z - d - WALL_THICKNESS / 2, rotated: false });
  }

  // Left wall
  if (!options.skipLeftWall) {
    addBox(groupNode, `${name}_left`, WALL_THICKNESS, WALL_HEIGHT, d, 'wall',
      x - WALL_THICKNESS / 2, WALL_HEIGHT / 2, cz);
    addWindows(groupNode, `${name}_left`, windowDefs.filter(w => w.wall === 'left'),
      { cx: x - WALL_THICKNESS / 2, cz, rotated: true });
  }

  // Right wall
  if (!options.skipRightWall) {
    addBox(groupNode, `${name}_right`, WALL_THICKNESS, WALL_HEIGHT, d, 'wall',
      x + w + WALL_THICKNESS / 2, WALL_HEIGHT / 2, cz);
    addWindows(groupNode, `${name}_right`, windowDefs.filter(w => w.wall === 'right'),
      { cx: x + w + WALL_THICKNESS / 2, cz, rotated: true });
  }
}

function addWindows(parent, wallName, windowDefs, wallPos) {
  for (const win of windowDefs) {
    const winW = win.width || 1.2;
    const winH = win.height || 1.0;
    const winY = win.y || 1.3;
    const offset = win.offset || 0;
    const frameThick = 0.05;

    const glassX = wallPos.rotated ? wallPos.cx : wallPos.cx + offset;
    const glassZ = wallPos.rotated ? wallPos.cz + offset : wallPos.cz;

    // Glass pane
    addBox(parent, `${wallName}_glass`,
      wallPos.rotated ? WALL_THICKNESS + 0.02 : winW,
      winH,
      wallPos.rotated ? winW : WALL_THICKNESS + 0.02,
      'windowGlass', glassX, winY, glassZ);

    // Frame top
    addBox(parent, `${wallName}_frame_top`,
      wallPos.rotated ? WALL_THICKNESS + 0.03 : winW + frameThick * 2,
      frameThick,
      wallPos.rotated ? winW + frameThick * 2 : WALL_THICKNESS + 0.03,
      'windowFrame', glassX, winY + winH / 2 + frameThick / 2, glassZ);

    // Frame bottom
    addBox(parent, `${wallName}_frame_bot`,
      wallPos.rotated ? WALL_THICKNESS + 0.03 : winW + frameThick * 2,
      frameThick,
      wallPos.rotated ? winW + frameThick * 2 : WALL_THICKNESS + 0.03,
      'windowFrame', glassX, winY - winH / 2 - frameThick / 2, glassZ);

    // Cross bar (double pane)
    addBox(parent, `${wallName}_crossbar`,
      wallPos.rotated ? WALL_THICKNESS + 0.03 : winW,
      frameThick,
      wallPos.rotated ? frameThick : WALL_THICKNESS + 0.03,
      'windowFrame', glassX, winY, glassZ);
  }
}

// ─── Build all rooms ────────────────────────────────────────────

// Living room
buildRoom('living_room', rooms.living, 'floor', {
  skipRightWall: true,
  skipFrontWall: true,
  windows: [{ wall: 'left', width: 1.5, height: 1.2, y: 1.4, offset: 0 }],
});

// Kitchen
buildRoom('kitchen', rooms.kitchen, 'tile', {
  skipLeftWall: true,
  skipFrontWall: true,
  windows: [{ wall: 'right', width: 1.0, height: 0.8, y: 1.4, offset: 0 }],
});

// Hallway
buildRoom('hallway', rooms.hallway, 'floor', {
  skipBackWall: true,
  skipFrontWall: true,
});

// Bathroom
buildRoom('bathroom', rooms.bathroom, 'tile', {
  skipBackWall: true,
  windows: [{ wall: 'left', width: 0.6, height: 0.6, y: 1.8, offset: 0 }],
});

// Bedroom
buildRoom('bedroom', rooms.bedroom, 'floor', {
  skipBackWall: true,
  windows: [
    { wall: 'right', width: 1.4, height: 1.2, y: 1.3, offset: 0 },
    { wall: 'front', width: 1.4, height: 1.2, y: 1.3, offset: 0 },
  ],
});

// ─── Divider walls ──────────────────────────────────────────────

// Living-kitchen divider (with doorway gap)
addBox(rootNode, 'divider_lk_bottom', WALL_THICKNESS, WALL_HEIGHT, 1.2, 'wall',
  rooms.living.w + WALL_THICKNESS / 2, WALL_HEIGHT / 2, -0.6);

addBox(rootNode, 'divider_lk_top', WALL_THICKNESS, WALL_HEIGHT, 1.2, 'wall',
  rooms.living.w + WALL_THICKNESS / 2, WALL_HEIGHT / 2, -(rooms.living.d - 0.6));

// Door header between living and kitchen
addBox(rootNode, 'door_header_lk', WALL_THICKNESS, 0.7, 1.6, 'wall',
  rooms.living.w + WALL_THICKNESS / 2, WALL_HEIGHT - 0.35, -rooms.living.d / 2);

// Bathroom-bedroom divider
addBox(rootNode, 'divider_bath_bed', WALL_THICKNESS, WALL_HEIGHT, rooms.bathroom.d, 'wall',
  rooms.bathroom.w + WALL_THICKNESS / 2, WALL_HEIGHT / 2,
  rooms.bathroom.z - rooms.bathroom.d / 2 - WALL_THICKNESS);

// ─── Inspection markers ─────────────────────────────────────────

// 1. Humidity patch on living room left wall
addBox(rootNode, 'inspection_humidity', 0.8, 0.6, 0.01, 'moisture',
  rooms.living.x - WALL_THICKNESS / 2 + 0.01, 0.8, rooms.living.z - rooms.living.d / 2);

// 2. Electrical outlets
const outletPositions = [
  { x: 2.5, z: rooms.living.z - rooms.living.d + WALL_THICKNESS / 2 + 0.01 },
  { x: rooms.kitchen.x + 1.5, z: rooms.kitchen.z - rooms.kitchen.d + WALL_THICKNESS / 2 + 0.01 },
  { x: rooms.bedroom.x + 2, z: rooms.bedroom.z - rooms.bedroom.d - WALL_THICKNESS / 2 - 0.01 },
];
outletPositions.forEach((pos, i) => {
  addBox(rootNode, `electrical_outlet_${i}`, 0.08, 0.12, 0.02, 'outlet', pos.x, 0.4, pos.z);
});

// 3. Baseboards
addBox(rootNode, 'baseboard_living_back',
  rooms.living.w, 0.08, 0.02, 'baseboard',
  rooms.living.w / 2, 0.065, rooms.living.z + WALL_THICKNESS / 2 + 0.01);

addBox(rootNode, 'baseboard_living_left',
  0.02, 0.08, rooms.living.d, 'baseboard',
  rooms.living.x - WALL_THICKNESS / 2 - 0.01, 0.065, -rooms.living.d / 2);

// ─── Write GLB ──────────────────────────────────────────────────
const outputDir = dirname(OUTPUT_PATH);
mkdirSync(outputDir, { recursive: true });

const io = new NodeIO();
await io.write(OUTPUT_PATH, doc);

// Stats
let meshCount = 0;
let vertexCount = 0;
for (const mesh of doc.getRoot().listMeshes()) {
  meshCount++;
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    if (pos) vertexCount += pos.getCount();
  }
}

console.log('');
console.log('=========================================');
console.log('  Placeholder Apartment Model Generated');
console.log('=========================================');
console.log('');
console.log(`Output: ${OUTPUT_PATH}`);
console.log(`Meshes: ${meshCount}`);
console.log(`Vertices: ${vertexCount}`);
console.log('');
console.log('Rooms: living room, kitchen, hallway, bathroom, bedroom');
console.log('Inspection points: humidity patch, windows, outlets');
console.log('');
console.log('This is a PLACEHOLDER — replace with your real model later.');
console.log('');
