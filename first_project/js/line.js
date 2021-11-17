const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 1, 500)
camera.position.set(0, 0, 5)
camera.lookAt(0,0,0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement)

// const material = new THREE.LineBasicMaterial({color: 0x0000ff})

// const points = []

// points.push(new THREE.Vector3(-10, 0, 0))
// points.push(new THREE.Vector3(0, 10, 0))
// points.push(new THREE.Vector3(10, 0, 0))

// const geometry = new THREE.BufferGeometry().setFromPoints(points)

// const line = new THREE.Line(geometry, material)

// scene.add(line)

const MAX_POINTS = 3;

// geometry
const geometry = new THREE.BufferGeometry();

// attributes
const position = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
console.log(position)
geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

// draw range
const drawCount = 2; // draw the first 2 points, only
// geometry.setDrawRange(0, drawCount);

// material
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

// line
const line = new THREE.Line(geometry, material);
scene.add(line);

const positions = line.geometry.attributes.position.array;

let x, y, z, index;
x = y = z = index = 0;


for (let i = 0, l = MAX_POINTS; i < l; i++) {
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;
    
    x += 30;
    y += 30;
    z += 30;
}
console.log(positions)
setTimeout(() => {
    let x, y, z, index;
    x = y = z = index = 0;
    for (let i = 0, l = MAX_POINTS; i < l; i++) {
      positions[index++] = x;
      positions[index++] = y;
      positions[index++] = z;

      x -= 30;
      y -= 30;
      z -= 30;
    }
    console.log(positions)
    line.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera)
}, 2000)


renderer.render(scene, camera)