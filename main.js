console.log("ciao"); 

import * as THREE from "./three/three.module.js"
import {GLTFLoader} from "./three/GLTFLoader.js"
import {PointerLockControls} from "./three/PointerLockControls.js"

var alpha = 0;
var beta = 0;
var gamma = 0;
var orient =0;
var movement=0;
const mov_speed=0.05

function moveForward (camera, distance ) {

    const v = new THREE.Vector3();

    v.setFromMatrixColumn( camera.matrix, 0 );

    _vector.crossVectors( camera.up, _vector );

    camera.position.addScaledVector( _vector, distance );

};

function moveRight (camera, distance ) {

    _vector.setFromMatrixColumn( camera.matrix, 0 );

    camera.position.addScaledVector( _vector, distance );

};

function animate(){
    requestAnimationFrame(animate);
    if (movement==="up"){
        camera.position.z+=-mov_speed;
    }
    else if(movement==="left") {
        camera.position.x+=-mov_speed;
    }
    else if(movement==="right") {
        camera.position.x+=mov_speed;
    }
    else if(movement==="down") {
        camera.position.z+=mov_speed;
    }
    cube_mesh.rotateX(0.1);
    //var eul = new THREE.Euler((gamma)/360*(2*Math.PI),-beta/360*(2*Math.PI),0);
    var eul = new THREE.Euler(beta/360*(2*Math.PI),alpha/360*(2*Math.PI),-gamma/360*(2*Math.PI),'YXZ');
    var q0 = new THREE.Quaternion();
    var q1 = new THREE.Quaternion();
    var q2 = new THREE.Quaternion();
    var q3 = new THREE.Quaternion();
    var q4 = new THREE.Quaternion();
    q1.setFromEuler(eul);
    const X = new THREE.Vector3(1,0,0);
    const Z = new THREE.Vector3(0,0,1);
    q2.setFromAxisAngle(X,-Math.PI/2);
    q3 = q1.multiply(q2);

    q0.setFromAxisAngle(Z,-orient/360*(2*Math.PI))
    q4 = q3.multiply(q0)

    camera.setRotationFromQuaternion(q4);
    renderer.render(scene,camera);
}

function onModelLoad(asset){
    scene.add(asset.scene);
}

function onDeviceOrientationChange(e){
    alpha=e.alpha;
    beta=e.beta;
    gamma=e.gamma;
    var log_alpha = document.getElementById("log-alpha");
    log_alpha.innerText="alpha: " + alpha;
    var log_beta = document.getElementById("log-beta");
    log_beta.innerText="beta: " + beta;
    var log_gamma = document.getElementById("log-gamma");
    log_gamma.innerText="gamma: " + gamma;
}

function onScreenOrientationChange(){
    orient=window.orientation;
    var log_orient = document.getElementById("log-orient");
    log_orient.innerText="orient: " + orient;
}

function askPermission() {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        const log_console = document.getElementById("log-console");
        log_console.innerText +=" asking permission"
      DeviceOrientationEvent.requestPermission().then(response => {
          if (response == "granted") {
            log_console.innerText +="granted"
            window.addEventListener("deviceorientation", onDeviceOrientationChange,false);
            window.addEventListener("orientationchange", onScreenOrientationChange,false);
            //onScreenOrientationChange();
          }
        }).catch(console.error);
    }
    else{
        const log_console = document.getElementById("log-console");
        log_console.innerText +=" asking permission";
        window.addEventListener("deviceorientation", onDeviceOrientationChange,false);
        window.addEventListener("orientationchange", onScreenOrientationChange,false);
    }
};



const canvas01 = document.getElementById("canvas01");
const renderer = new THREE.WebGLRenderer({canvas:canvas01,antialias:true});

const aspr = canvas01.clientWidth/canvas01.clientHeight;
const camera = new THREE.PerspectiveCamera(50,aspr,0.1,100);
camera.position.y=0.45;

const scene = new THREE.Scene();

const cube_geo = new THREE.BoxGeometry();
const cube_mat = new THREE.MeshBasicMaterial({color:0x00ff00});
const cube_mesh = new THREE.Mesh(cube_geo,cube_mat);

scene.add(cube_mesh);

const loader = new GLTFLoader();

const model = loader.load(".//assets/van_gogh09c.glb",onModelLoad);

const amb_light = new THREE.AmbientLight(0xffffff,1);
scene.add(amb_light);

canvas01.onclick = function(e) {
    const log_console = document.getElementById("log-console");
    log_console.innerText +=" clicked "
    //e.preventDefault();
    //e.stopImmediatePropagation();
    var recanvas = document.getElementById("canvas01");
    recanvas.onclick = function() {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    };
    askPermission();
};

canvas01.ontouchend = function(e) {
    const log_console = document.getElementById("log-console");
    log_console.innerText +=" clicked "
    //e.preventDefault();
    //e.stopImmediatePropagation();
    var recanvas = document.getElementById("canvas01");
    recanvas.onclick = function() {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    };
    askPermission();
};

function onTouchUp(e){
    movement = "up";
    e.preventDefault();
    e.stopImmediatePropagation();
    e.returnValue=false;
}
function onTouchLeft(e){
    movement = "left";
    e.preventDefault();
    e.stopImmediatePropagation();
    e.returnValue=false;
}
function onTouchRight(e){
    movement = "right";
    e.preventDefault();
    e.stopImmediatePropagation();
    e.returnValue=false;
}
function onTouchDown(e){
    movement = "down";
    e.preventDefault();
    e.stopImmediatePropagation();
    e.returnValue=false;
}
function onTouchEnd(e){
    movement = "idle";
    e.preventDefault();
    e.stopImmediatePropagation();
    e.returnValue=false;
}

const arrow_up = document.getElementById("arrow-up");
arrow_up.addEventListener("touchstart",onTouchUp);
arrow_up.addEventListener("touchend",onTouchEnd);
const arrow_left = document.getElementById("arrow-left");
arrow_left.addEventListener("touchstart",onTouchLeft);
arrow_left.addEventListener("touchend",onTouchEnd);
const arrow_right = document.getElementById("arrow-right");
arrow_right.addEventListener("touchstart",onTouchRight);
arrow_right.addEventListener("touchend",onTouchEnd);
const arrow_down = document.getElementById("arrow-down");
arrow_down.addEventListener("touchstart",onTouchDown);
arrow_down.addEventListener("touchend",onTouchEnd);

canvas01.onclick();

animate();

