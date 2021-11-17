import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

// iniializingdat gui
const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegment: 50,
    heightSegment: 50,
  },
};

// Adding the data.gui controls in our browser
gui.add(world.plane, "width", 1, 400).onChange(() => {
  generatePlane();
});
gui.add(world.plane, "height", 1, 400).onChange(() => {
  generatePlane();
});
gui.add(world.plane, "widthSegment", 1, 100).onChange(() => {
  generatePlane();
});
gui.add(world.plane, "heightSegment", 1, 100).onChange(() => {
  generatePlane();
});

const generatePlane = () => {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegment,
    world.plane.heightSegment
  );

  // randomizing the z position of every vertex
  const { array } = planeMesh.geometry.attributes.position;

  const randomValues = [];
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      array[i] = x + (Math.random() - 0.5) * 3;
      array[i + 1] = y + (Math.random() - 0.5) * 3;
      array[i + 2] = z + (Math.random() - 0.5) * 3;
    }

    randomValues.push(Math.random() * Math.PI * 2);
  }

  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array;

  planeMesh.geometry.attributes.position.randomValues = randomValues;

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );


  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array;

  planeMesh.geometry.attributes.position.randomValues = randomValues;
};

// initiating a ray caster
// raycaster - its like a pointer in the space
const raycaster = new THREE.Raycaster()

// creating a scene
const scene = new THREE.Scene();

// setting up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// initiating the renderer
const renderer = new THREE.WebGLRenderer();

// set size of canvas and pixel
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);

// appending the renderer to our dom
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// setting the cmaera's position away from the center
camera.position.z = 50;

// creating a new geometry
const planeGeometry = new THREE.PlaneGeometry(world.plane.width,
    world.plane.height,
    world.plane.widthSegment, 
    world.plane.heightSegment);

// adding a material for our geometry
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors : true
});

// combining geometry and the material
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// adding the mesh to our scene so that we can see it
scene.add(planeMesh);
generatePlane()

// initializing the light
const light = new THREE.DirectionalLight(0xffffff, 1);

light.position.set(0, 1, 1);

// adding the ligh to our scene
scene.add(light);


const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

// animation function for our plane mesh

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera)
  frame += 0.1

  const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position
  for(let i = 0; i < array.length; i+=3 ){
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01
    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.01
    planeMesh.geometry.attributes.position.needsUpdate = true
  }

  const intersects = raycaster.intersectObject(planeMesh)
  if(intersects.length > 0){
      const { color } = intersects[0].object.geometry.attributes;
    //   vertices 1
      color.setX(intersects[0].face.a, .1)
      color.setY(intersects[0].face.a, .5)
      color.setZ(intersects[0].face.a, 1)
      //          vertices 2
      color.setX(intersects[0].face.b, .1)
      color.setY(intersects[0].face.b, .5);
      color.setZ(intersects[0].face.b, 1)
      //   vertices 3
      color.setX(intersects[0].face.c, .1)
      color.setY(intersects[0].face.c, .5);
      color.setZ(intersects[0].face.c, 1)

      color.needsUpdate = true ;

      const initialColor = {
          r:0, g: .19, b: .4
      }
      const hoverColor = {
          r:0.1, g: .5, b: 1
      }
      gsap.to(hoverColor, {
          r: initialColor.r,
          g: initialColor.g,
          b: initialColor.b,
          onUpdate: () => {
            //   vertices 1
            color.setX(intersects[0].face.a, hoverColor.r);
            color.setY(intersects[0].face.a, hoverColor.g);
            color.setZ(intersects[0].face.a, hoverColor.b);
            //          vertices 2
            color.setX(intersects[0].face.b, hoverColor.r);
            color.setY(intersects[0].face.b, hoverColor.g);
            color.setZ(intersects[0].face.b, hoverColor.b);
            //   vertices 3
            color.setX(intersects[0].face.c, hoverColor.r);
            color.setY(intersects[0].face.c, hoverColor.g);
            color.setZ(intersects[0].face.c, hoverColor.b);
            color.needsUpdate = true;
          }
      })
  }
  // planeMesh.rotation.x += 0.01
};

animate();



addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1
    mouse.y = -((e.clientY / innerHeight) * 2 - 1) 
})
