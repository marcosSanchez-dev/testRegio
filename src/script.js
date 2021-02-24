import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { Vector3 } from 'three'
import gsap from 'gsap'

//LOADING BAR
const loadingBarElement = document.querySelector('.loading-bar')
const overlayElement = document.querySelector('.black-screen')
const textLoadingBarElement = document.querySelector('.loadingBar-text')

const loadingManager = new THREE.LoadingManager(
    //loaded
    () => {
        gsap.delayedCall(0.5, () => {
            gsap.to(overlayElement,{
                css:{opacity:0,display:'none'},
                duration:1
            })

            gsap.to(textLoadingBarElement,{
                css:{opacity:0,display:'none'},
                duration:1
            })

            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        })
    },
    //progress
    (itemsUrl,itemsLoaded,itemsTotal) => {
        
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

//DOM
const hideButton = document.querySelector('.hide-button-0')

const resistentesVideo = document.getElementById('video-0')
const otrosVideo = document.getElementById('video-1')
const promoVideo = document.getElementById('video-2')
const regioLink = document.getElementById('regio-link')
/**
    TEXTURAS
 */
const textureLoader = new THREE.TextureLoader(loadingManager);

const regioColorTexture = textureLoader.load('/textures/color.png')
const regioAmbientTexture = textureLoader.load('/textures/ao_map.png')
const regioNormalTexture = textureLoader.load('/textures/normal.png')
const regioRoughTexture = textureLoader.load('/textures/roughness.png')

const video3Texture = textureLoader.load('/icons/bio_icon.png')
const rotateTexture = textureLoader.load('/icons/360.png')

const botton0Texture = textureLoader.load('/buttons/resistentes.png')
const botton1Texture = textureLoader.load('/buttons/otros.png')
const botton2Texture = textureLoader.load('/buttons/promo.png')
const botton3Texture = textureLoader.load('/buttons/bio.png')

const bgTexture = textureLoader.load('/background/bg_threejs.png')
bgTexture.wrapS = THREE.MirroredRepeatWrapping

const video0Texture = new THREE.VideoTexture(resistentesVideo)
const video1Texture = new THREE.VideoTexture(otrosVideo)
const video2Texture = new THREE.VideoTexture(promoVideo)

video1Texture.format = THREE.RGBAFormat;
video2Texture.format = THREE.RGBAFormat;


//greenScreen

/*
let processor = {
    timerCallback: function(){
        if(this.video.paused || this.video.ended){
            return;
        }
        this.computeFrame()
        let self = this
        setTimeout(function () {
            self.timerCallback()
        },0)
    },
    doLoad: function () {
        this.video = document.querySelector('#video-1')
        this.c1 = document.querySelector('#c1')
        this.ctx1 = this.c1.getContext('2d')
        this.c2 = document.querySelector('#c2')
        this.ctx2 = this.c2.getContext('2d')
        let self = this
        this.video.addEventListener('play', function () {
            self.width = self.video.videoWidth
            self.height = self.video.videoHeight
            self.timerCallback()
        })
    },
    computeFrame: function () {
        this.ctx1.drawImage(this.video,0,0,this.width,this.height)
        let frame = this.ctx1.getImageData(0,0,this.width,this.height)
        let l = frame.data.length / 4;

        for(let i = 0; i < l; i++){
            let r = frame.data[i*4 + 0]
            let g = frame.data[i*4 + 1]
            let b = frame.data[i*4 + 2]
            if(g > 220) frame.data[i * 4 + 3] = 0
        }
        this.ctx2.putImageData(frame,0,0)
        return;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    processor.doLoad()
})
*/

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = bgTexture

//MODELS
const objectLoader = new OBJLoader(loadingManager)


objectLoader.load(
    '/models/regio/ToallasOBJ.obj',
    (gltf) => {
        //console.log('exito!');
        //console.log(gltf);
        const regioMesh = [...gltf.children]
        scene.add(regioMesh[0])
        regioMesh[0].scale.set(0.5,0.5,0.5)
        regioMesh[0].position.set(-1.5,-0.5,0)
        regioMesh[0].material.map = regioColorTexture
        regioMesh[0].material.transparent = true
        regioMesh[0].material.aoMap = regioAmbientTexture
        regioMesh[0].material.normalMap = regioNormalTexture
        regioMesh[0].material.roughnessMap = regioRoughTexture
        regioMesh[0].material.roughness = 1
        regioMesh[0].material.metalness = 1
        regioMesh[0].material.shininess = 50
        
        
        const controlsRegio = new OrbitControls(regioMesh[0], canvas)
        controlsRegio.minPolarAngle = 90 * Math.PI / 180; // radians
        controlsRegio.maxPolarAngle = 90 * Math.PI / 180; // radians
        controlsRegio.target.set(-1.5, -0.4, 0.1) //90 * Math.PI / 180
        controlsRegio.rotateSpeed *= -1;
        

        const update = () => {
            //regioMesh[0].rotation.z += 0.01
            controlsRegio.update()
            //console.log('hola mundo')
            window.requestAnimationFrame(update)
        }
        update()
        
    },
    () => {
        //console.log('esta en progreso...');
    },
    () => {
        //console.log('hay un ERROR');
    }
)

//SCREEN SHOT 
/*
const screenShotButton = document.querySelector('.screen-shot')
screenShotButton.addEventListener('click', saveAsImage)
const strDownloadMime = "image/octet-stream";
function saveAsImage() {
    let imgData, imgNode;

    try {
        let strMime = "image/jpeg";
        imgData = renderer.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), "screenShot.jpg");
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
*/
/*
    videoTexture
*/

const video0Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 2.8),
    new THREE.MeshBasicMaterial({
        map:video0Texture,
        color: 'white',
    })
)
video0Mesh.position.set(0,4.3,1)

const video1Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial({
        map:video1Texture,
        color: 'white',
        alphaTest:0.5    
    })
)
video1Mesh.position.set(0,4.3,1)

const video2Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial({
        map:video2Texture,
        color: 'white',
        alphaTest: 0.5
    })
)
video2Mesh.position.set(0,4.3,1)

const video3Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshBasicMaterial({
        map:video3Texture,
        color: 'white',
        alphaTest: 0.5
    })
)
video3Mesh.position.set(0,4.3,1)

const rotateMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1),
    new THREE.MeshBasicMaterial({
        map:rotateTexture,
        color: 'white',
        alphaTest: 0.5,
        transparent:true
    })
)
rotateMesh.position.set(-1.5,-3,0)
scene.add(rotateMesh)

//Buttons Events

const buttonsGroup = new THREE.Group()
scene.add(buttonsGroup)

const button0Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry( 2.1, 0.6),
    new THREE.MeshBasicMaterial({
        color:'white',
        map: botton0Texture,
        transparent: true
    })
)
button0Mesh.position.set(2.3,0.95,0)

const button1Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry( 2.1, 0.6),
    new THREE.MeshBasicMaterial({
        color:'white',
        map: botton1Texture,
        transparent: true
    })
)
button1Mesh.position.set(2.3,0,0)

const button2Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry( 2.1, 0.6),
    new THREE.MeshBasicMaterial({
        color:'white',
        map: botton2Texture,
        transparent: true
    })
)
button2Mesh.position.set(2.3,-0.98,0)

const button3Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry( 2.1, 0.6),
    new THREE.MeshBasicMaterial({
        color:'white',
        map: botton3Texture,
        transparent: true
    })
)
button3Mesh.position.set(2.3,-1.95,0)


buttonsGroup.add(button0Mesh,button1Mesh,button2Mesh,button3Mesh)


let currentVideo = null

const resistentesButton = document.querySelector('.button-0')
resistentesButton.addEventListener('click', (e) => {
    currentVideo = 0
    resistentesVideo.currentTime = 0
    scene.add(video0Mesh)
    resistentesVideo.play()
    promoGif.classList.add('hide')
    otrosGif.classList.add('hide')
    if (currentVideo === 0) {
        hideButton.classList.remove('hide')
    }else{
        hideButton.classList.toggle('hide')
    }
    scene.remove(video1Mesh,video2Mesh,video3Mesh)
})

/*
function botton0EventListener(e) {
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
}
*/
const otrosGif = document.getElementById('otros-gif')
const otrosButton = document.querySelector('.button-1')
otrosButton.addEventListener('click', (e) => {
    resistentesVideo.pause()
    currentVideo = 1
    otrosVideo.currentTime = 0
    otrosVideo.play()
    otrosGif.classList.remove('hide')
    promoGif.classList.add('hide')
    if (currentVideo === 1) {
        hideButton.classList.remove('hide')
    }else{
        hideButton.classList.toggle('hide')
    }
    scene.remove(video0Mesh,video2Mesh,video3Mesh)
})

/*
function botton1EventListener(e) {
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
}
*/

const promoGif = document.getElementById('promo-gif')
const promocionButton = document.querySelector('.button-2')
promocionButton.addEventListener('click', (e) => {
    resistentesVideo.pause()
    currentVideo = 2
    promoVideo.currentTime = 0
    promoGif.classList.remove('hide')
    otrosGif.classList.add('hide')

    //scene.add(video2Mesh)
    promoVideo.play()
    
    if (currentVideo === 2) {
        hideButton.classList.remove('hide')
    }else{
        hideButton.classList.toggle('hide')
    }
    scene.remove(video0Mesh,video1Mesh,video3Mesh)
})
/*
function botton2EventListener(e) {
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
}
*/
const biodegradableButton = document.querySelector('.button-3')
biodegradableButton.addEventListener('click', (e) => {
    resistentesVideo.pause()
    currentVideo = 3
    scene.add(video3Mesh)
    otrosVideo.play()
    promoGif.classList.add('hide')
    otrosGif.classList.add('hide')
    if (currentVideo === 3) {
        hideButton.classList.remove('hide')
    }else{
        hideButton.classList.toggle('hide')
    }
    scene.remove(video0Mesh,video1Mesh,video2Mesh)
})

/*
function botton3EventListener(e) {
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
}
*/

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
            otrosGif.classList.add('hide')
            break;
        case 2:
            scene.remove(video2Mesh)
            promoVideo.pause()
            promoVideo.currentTime = 0
            promoGif.classList.add('hide')
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

gsap.to(button0Mesh.scale,{
    x:1.1,
    y:1.1,
    z:0,
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})
gsap.to(button1Mesh.scale,{
    x:1.1,
    y:1.1,
    z:0,
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})
gsap.to(button2Mesh.scale,{
    x:1.1,
    y:1.1,
    z:0,
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})
gsap.to(button3Mesh.scale,{
    x:1.1,
    y:1.1,
    z:0,
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})
/*
gsap.to(screenShotButton,{
    css:{scale:1.1},
    duration:0.8,
    ease:'power4.out',
    yoyo:true,
    repeat: -1,
})
*/
gsap.to(regioLink,{
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
pointLight.position.set(-1.5,-0.7,5)
scene.add(pointLight)

//HELPERS

//const axisHelper = new THREE.AxisHelper(2)
//scene.add(axisHelper)

//const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
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

//ORBIT CONTROLS
        /*
        const controlsRegio = new OrbitControls(regioMesh[0], canvas)
        controlsRegio.minPolarAngle = 90 * Math.PI / 180; // radians
        controlsRegio.maxPolarAngle = 90 * Math.PI / 180; // radians
        controlsRegio.target.set(-1.5, 0.79, 0) //90 * Math.PI / 180
        controlsRegio.rotateSpeed *= -1;
        window.requestAnimationFrame(()=>{
            controlsRegio.update()
        })
        */

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias:true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//VIDEO RECORDER
/*
const stream = renderer.domElement.captureStream();
const recorder = new MediaRecorder(stream, { type: 'video/webm' });

const play = document.querySelector('.play-video');

let playing = false;

play.addEventListener('click', () => {
    playing = !playing;

    if (playing) {
        recorder.start();
        playing = true
    } else {
        recorder.stop();
        playing = false
    }

    download.disabled = playing;
    play.innerHTML = `${playing ? 'Stop' : 'Start'} Recording`;
});

const data = [];

recorder.ondataavailable = e => data.push(e.data);

const download = document.querySelector('.download');

download.onclick = () => {
    const blob = new Blob(data, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'screenRecorder.webm';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
};
*/

//RAYCASTER
/*
const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

window.addEventListener('click', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    //console.log(mouse)
})

let currentIntersect = null


window.addEventListener('click', () =>
{
    if(currentIntersect)
    {
        switch(currentIntersect.object)
        {
            case button0Mesh:
                console.log('click on object 0')
                botton0EventListener()
                break

            case button1Mesh:
                console.log('click on object 1')
                botton1EventListener()
                break

            case button2Mesh:
                console.log('click on object 2')
                botton2EventListener()
                break
            case button3Mesh:
                console.log('click on object 3')
                botton3EventListener()
                break
        }
    }
})
*/

//POINTS 
const points = [
    {
        position: new THREE.Vector3(1.3, 1, 0),
        element: document.querySelector('.button-container')
    }
]

/*
    Animate
 */
const clock = new THREE.Clock()
let previousTime = 0


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    for(const point of points)
    {
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        const translateX = screenPosition.x * sizes.width * 0.5
        point.element.style.transform = `translateX(${translateX}px)`
    }


    //cast a ray
    //const rayOrigin = new THREE.Vector3(2, 3, 0)
    //const rayDirection = new THREE.Vector3(2, -3, 0)
    //rayDirection.normalize()

    /*
    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [button0Mesh, button1Mesh, button2Mesh,button3Mesh]
    const intersects = raycaster.intersectObjects(objectsToTest)

    
    if(intersects.length)
    {
        if(!currentIntersect)
        {
            //console.log('mouse enter')
        }

        currentIntersect = intersects[0]
    }
    else
    {
        if(currentIntersect)
        {
            //console.log('mouse leave')
        }

        currentIntersect = null
    }
    //console.log(intersects)

    */


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()