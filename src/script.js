import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

/**
    TEXTURAS
 */
const textureLoader = new THREE.TextureLoader();

const regioColorTexture = textureLoader.load('/textures/color.png')
const regioAmbientTexture = textureLoader.load('/textures/ao_map.png')
const regioNormalTexture = textureLoader.load('/textures/normal.png')
const regioRoughTexture = textureLoader.load('/textures/roughness.png')

const bioPNG = textureLoader.load('/buttons/bio.png')
const otrosPNG = textureLoader.load('/buttons/otros.png')
const promoPNG = textureLoader.load('/buttons/promo.png')
const regresarPNG = textureLoader.load('/buttons/regresar.png')
const resistentesPNG = textureLoader.load('/buttons/resistentes.png')

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//MODELS
const objectLoader = new OBJLoader()

objectLoader.load(
    '/models/regio/ToallasOBJ.obj',
    (gltf) => {
        console.log('exito!');
        //console.log(gltf);
        const regioMesh = [...gltf.children]
        scene.add(regioMesh[0])

        regioMesh[0].scale.set(0.5,0.5,0.5)
        regioMesh[0].position.set(0,1.6,0)
        regioMesh[0].material.map = regioColorTexture
        regioMesh[0].material.transparent = true
        regioMesh[0].material.aoMap = regioAmbientTexture
        regioMesh[0].material.normalMap = regioNormalTexture
        regioMesh[0].material.roughnessMap = regioRoughTexture
        
    },
    () => {
        console.log('esta en progreso...');
    },
    () => {
        console.log('hay un error :(');
    }
)

//buttons
const buttonsGroup = new THREE.Group()
buttonsGroup.position.set(3,0,0)
scene.add(buttonsGroup)

const bioButton = new THREE.Mesh(
    new THREE.PlaneGeometry(2,1),
    new THREE.MeshStandardMaterial({
        map: bioPNG,
        side: THREE.DoubleSide,
        transparent: true
    })
)
bioButton.position.set(0,1,0)

const otrosButton = new THREE.Mesh(
    new THREE.PlaneGeometry(2,1),
    new THREE.MeshStandardMaterial({
        map: otrosPNG,
        side: THREE.DoubleSide,
        transparent: true
    })
)
otrosButton.position.set(0,2.5,0)

const promoButton = new THREE.Mesh(
    new THREE.PlaneGeometry(2,1),
    new THREE.MeshStandardMaterial({
        map: promoPNG,
        side: THREE.DoubleSide,
        transparent: true
    })
)
promoButton.position.set(2.5,1,0)

/*const regresarButton = new THREE.Mesh(
    new THREE.PlaneGeometry(2,1),
    new THREE.MeshStandardMaterial({
        map: regresarPNG,
        side: THREE.DoubleSide,
        transparent: true
    })
)
regresarButton.position.set(6,3,0)*/

const resistentesButton = new THREE.Mesh(
    new THREE.PlaneGeometry(2,1),
    new THREE.MeshStandardMaterial({
        map: resistentesPNG,
        side: THREE.DoubleSide,
        transparent: true
    })
)
resistentesButton.position.set(2.5,2.5,0)


buttonsGroup.add(bioButton,otrosButton,promoButton,resistentesButton)
/**
 * Floor
 */
/*
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)
*/

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const pointLight = new THREE.PointLight('white')
pointLight.position.set(0,3,3)
//scene.add(pointLight)

//HELPERS

const axisHelper = new THREE.AxisHelper(2)
//scene.add(axisHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
//scene.add(pointLightHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 4, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
//controls.minAzimuthAngle = - 0.5; // radians
//controls.maxAzimuthAngle = 0.5; // radians
controls.minPolarAngle = 1.3; // radians
controls.maxPolarAngle = 0.5; // radians
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()