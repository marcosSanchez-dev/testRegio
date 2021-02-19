import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { Vector3 } from 'three'

//DOM
const resistentesButton = document.querySelector('.button-0')
const resistentesHide = document.querySelector('.hide-button-0')
const otrosUsosButton = document.querySelector('.button-1')
const promocionButton = document.querySelector('.button-2')
const biodegradableButton = document.querySelector('.button-3')

const resistentesVideo = document.querySelector('.video-0')

resistentesButton.addEventListener('click', (e) => {
    resistentesVideo.classList.toggle('hide')
    resistentesHide.classList.toggle('hide')
})

resistentesHide.addEventListener('click', (e) => {
    resistentesVideo.classList.toggle('hide')
    resistentesHide.classList.toggle('hide')
})


/**
    TEXTURAS
 */
const textureLoader = new THREE.TextureLoader();

const regioColorTexture = textureLoader.load('/textures/color.png')
const regioAmbientTexture = textureLoader.load('/textures/ao_map.png')
const regioNormalTexture = textureLoader.load('/textures/normal.png')
const regioRoughTexture = textureLoader.load('/textures/roughness.png')

const screenShotPNG = textureLoader.load('/icons/camara.png')
const screenRecordPNG = textureLoader.load('/icons/video.png')

const bioPNG = textureLoader.load('/buttons/bio.png')
const otrosPNG = textureLoader.load('/buttons/otros.png')
const promoPNG = textureLoader.load('/buttons/promo.png')
const regresarPNG = textureLoader.load('/buttons/regresar.png')
const resistentesPNG = textureLoader.load('/buttons/resistentes.png')

const bgTexture = textureLoader.load('/background/bg_threejs.png')

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = bgTexture

//MODELS
const objectLoader = new OBJLoader()


const regioMeshGlobal = []
objectLoader.load(
    '/models/regio/ToallasOBJ.obj',
    (gltf) => {
        console.log('exito!');
        //console.log(gltf);
        const regioMesh = [...gltf.children]
        scene.add(regioMesh[0])
        regioMeshGlobal.push(regioMesh[0])
        regioMesh[0].scale.set(0.5,0.5,0.5)
        regioMesh[0].position.set(-2,1.6,0)
        regioMesh[0].material.map = regioColorTexture
        regioMesh[0].material.transparent = true
        regioMesh[0].material.aoMap = regioAmbientTexture
        regioMesh[0].material.normalMap = regioNormalTexture
        regioMesh[0].material.roughnessMap = regioRoughTexture
        regioMesh[0].material.roughness = 1
        regioMesh[0].material.metalness = 1
        regioMesh[0].material.shininess = 50
    },
    () => {
        console.log('esta en progreso...');
    },
    () => {
        console.log('hay un ERROR');
    }
)

//buttons
/*
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
/*

const resistentesButton = new THREE.Mesh(
    new THREE.PlaneGeometry(2,1),
    new THREE.MeshStandardMaterial({
        map: resistentesPNG,
        side: THREE.DoubleSide,
        transparent: true
    })
)
resistentesButton.position.set(2.5,2.5,0)*/


//buttonsGroup.add(bioButton,otrosButton,promoButton,resistentesButton)

//SCREEN SHOT
const screenShotButton = new THREE.Mesh(
    new THREE.CircleGeometry(0.5,32),
    new THREE.MeshStandardMaterial({
        map:screenShotPNG,
        side: THREE.DoubleSide,
        transparent: true
    })
)
screenShotButton.position.set(0-1,0.5,1.5)

const screenRecordButton = new THREE.Mesh(
    new THREE.CircleGeometry(0.5,32),
    new THREE.MeshStandardMaterial({
        map: screenRecordPNG,
        side: THREE.DoubleSide,
        transparent: true   
    })
)
screenRecordButton.position.set(1,0.5,1.5)

//scene.add(screenShotButton,screenRecordButton)

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
pointLight.position.set(0,3,-3)
//scene.add(pointLight)

//HELPERS

const axisHelper = new THREE.AxisHelper(2)
scene.add(axisHelper)

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
camera.position.set(0, 4, 5.5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
//controls.minAzimuthAngle = - 0.5; // radians
//controls.maxAzimuthAngle = 0.5; // radians
controls.minPolarAngle = 1.3; // radians
controls.maxPolarAngle = 0.5; // radians
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
//controls.target.set()

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

//raycast


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