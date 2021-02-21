import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { Vector3 } from 'three'
import gsap from 'gsap'

// Create a capturer that exports a WebM video
//DOM
const hideButton = document.querySelector('.hide-button-0')

const resistentesVideo = document.getElementById('video-0')
const otrosVideo = document.getElementById('video-1')
const promoVideo = document.getElementById('video-2')

/**
    TEXTURAS
 */
const textureLoader = new THREE.TextureLoader();

const regioColorTexture = textureLoader.load('/textures/color.png')
const regioAmbientTexture = textureLoader.load('/textures/ao_map.png')
const regioNormalTexture = textureLoader.load('/textures/normal.png')
const regioRoughTexture = textureLoader.load('/textures/roughness.png')

const video3Texture = textureLoader.load('/icons/bio_icon.png')

const bgTexture = textureLoader.load('/background/bg_threejs.png')
bgTexture.wrapS = THREE.MirroredRepeatWrapping

const video0Texture = new THREE.VideoTexture(resistentesVideo)
const video1Texture = new THREE.VideoTexture(otrosVideo)
const video2Texture = new THREE.VideoTexture(promoVideo)
video1Texture.format = THREE.RGBAFormat;
video2Texture.format = THREE.RGBAFormat;
// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = bgTexture

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
        regioMesh[0].material.map = regioColorTexture
        regioMesh[0].material.transparent = true
        regioMesh[0].material.aoMap = regioAmbientTexture
        regioMesh[0].material.normalMap = regioNormalTexture
        regioMesh[0].material.roughnessMap = regioRoughTexture
        regioMesh[0].material.roughness = 1
        regioMesh[0].material.metalness = 1
        regioMesh[0].material.shininess = 50

        /*
        const geometryTest = new THREE.BoxGeometry( 1, 1, 1 );
        const materialTest = new THREE.MeshBasicMaterial( {color: 'white'} );
        const cubeTest = new THREE.Mesh( geometryTest, materialTest );
        cubeTest.position.set(0,4,0)
        scene.add(cubeTest)
        const meshesTest = [regioMesh[0],cubeTest]
        for (let i = 0; i < 2; i++) {
            const controls = new OrbitControls(meshesTest[i], canvas)
                //controls.minAzimuthAngle = - 0.5; // radians
            //controls.maxAzimuthAngle = 0.5; // radians
            controls.minPolarAngle = 1.55; // radians
            controls.maxPolarAngle = 1.55; // radians
            controls.target.set(-1.5, 0.75, 0)
            controls.enableDamping = true
            controls.enablePan = false
        }
        */
        const controlsRegio = new OrbitControls(regioMesh[0], canvas)
        controlsRegio.minPolarAngle = 1; // radians
        controlsRegio.maxPolarAngle = 1; // radians
        regioMesh[0].position.set(-1.5,0.7,0)
        controlsRegio.target.set(-1.5, 0.69, 0)
    },
    () => {
        console.log('esta en progreso...');
    },
    () => {
        console.log('hay un ERROR');
    }
)

//SCREEN SHOT buttons
/*
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
*/
//scene.add(screenShotButton,screenRecordButton)

const videoShotButton = document.querySelector('.video-shot')


const screenShotButton = document.querySelector('.screen-shot')
screenShotButton.addEventListener('click', saveAsImage)
const strDownloadMime = "image/octet-stream";
function saveAsImage() {
    let imgData, imgNode;

    try {
        let strMime = "image/jpeg";
        imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");
    } catch (e) {
        console.log(e);
        return;
    }
}

const saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
}
/*
    videoTexture
*/

const video0Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 2.8),
    new THREE.MeshStandardMaterial({
        map:video0Texture,
        color: 'white',
        side: THREE.DoubleSide,
    })
)
video0Mesh.position.set(0,4.3,1)

const video1Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshStandardMaterial({
        map:video1Texture,
        color: 'white',
        side: THREE.DoubleSide,
        alphaTest: 0.5
    })
)
video1Mesh.position.set(0,4.3,1)

const video2Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshStandardMaterial({
        map:video2Texture,
        color: 'white',
        side: THREE.DoubleSide,
        alphaTest: 0.5
    })
)
video2Mesh.position.set(0,4.3,1)

const video3Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshStandardMaterial({
        map:video3Texture,
        color: 'white',
        side: THREE.DoubleSide,
        alphaTest: 0.5
    })
)
video3Mesh.position.set(0,4.3,1)

//Buttons Events

let currentVideo = null

const resistentesButton = document.querySelector('.button-0')
resistentesButton.addEventListener('click', (e) => {
    currentVideo = 0
    resistentesVideo.currentTime = 0
    scene.add(video0Mesh)
    resistentesVideo.play()
    if (currentVideo === 0) {
        hideButton.classList.remove('hide')
    }else{
        hideButton.classList.toggle('hide')
    }
    scene.remove(video1Mesh,video2Mesh,video3Mesh)
})

const otrosButton = document.querySelector('.button-1')
otrosButton.addEventListener('click', (e) => {
    resistentesVideo.pause()
    currentVideo = 1
    otrosVideo.currentTime = 0
    scene.add(video1Mesh)
    otrosVideo.play()
    if (currentVideo === 1) {
        hideButton.classList.remove('hide')
    }else{
        hideButton.classList.toggle('hide')
    }
    scene.remove(video0Mesh,video2Mesh,video3Mesh)
})

const promocionButton = document.querySelector('.button-2')
promocionButton.addEventListener('click', (e) => {
    resistentesVideo.pause()
    currentVideo = 2
    promoVideo.currentTime = 0
    scene.add(video2Mesh)
    promoVideo.play()
    if (currentVideo === 2) {
        hideButton.classList.remove('hide')
    }else{
        hideButton.classList.toggle('hide')
    }
    scene.remove(video0Mesh,video1Mesh,video3Mesh)
})

const biodegradableButton = document.querySelector('.button-3')
biodegradableButton.addEventListener('click', (e) => {
    resistentesVideo.pause()
    currentVideo = 3
    scene.add(video3Mesh)
    otrosVideo.play()
    if (currentVideo === 3) {
        hideButton.classList.remove('hide')
    }else{
        hideButton.classList.toggle('hide')
    }
    scene.remove(video0Mesh,video1Mesh,video2Mesh)
})


hideButton.addEventListener('click', (e) => {
    switch (currentVideo) {
        case 0:
            scene.remove(video0Mesh)
            resistentesVideo.pause()
            resistentesVideo.currentTime = 0
            break;
        case 1:
            scene.remove(video1Mesh)
            otrosVideo.pause()
            otrosVideo.currentTime = 0
            break;
        case 2:
            scene.remove(video2Mesh)
            promoVideo.pause()
            promoVideo.currentTime = 0
            break;
        case 3:
            scene.remove(video3Mesh)
            break;
        default:
            break;
    }
    hideButton.classList.toggle('hide')
})

//ANIMATION
gsap.to(video3Mesh.scale,{
    x:1.2,
    y:1.2,
    duration:2,
    ease:'Elastic.easeOut',
    yoyo:true,
    repeat: -1,
})

gsap.to(resistentesButton,{
    css:{scale:1.1},
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})
gsap.to(otrosButton,{
    css:{scale:1.1},
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})
gsap.to(promocionButton,{
    css:{scale:1.1},
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})
gsap.to(biodegradableButton,{
    css:{scale:1.1},
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
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
//scene.add(directionalLight)

const pointLight = new THREE.PointLight('white')
pointLight.distance = 8
pointLight.position.set(-1.5,1.5,5)
scene.add(pointLight)

//HELPERS

const axisHelper = new THREE.AxisHelper(2)
//scene.add(axisHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
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
camera.position.set(0, 1, 10)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
    preserveDrawingBuffer: true
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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()