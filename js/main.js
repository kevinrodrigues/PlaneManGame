//Messing about with three.js here..

var PlaneManGame = function() {
    this.colors = {
		whiteSolid: 0xffffff,
		black: 0x000000,
		lightGrey: 0xaaaaaa,
		red: 0xf25346,
		white: 0xd8d0d1,
		brown: 0x59332e,
		pink: 0xF5986E,
		brownDark: 0x23190f,
		blue: 0x68c3c0,
		fogColor: 0xf7d9aa
	};

	this.lights = {
		opacity90: 0.9,
		opacity60: 0.6
	};

    this.events = {
        load: 'load',
        resize: 'resize'
    };

    this.init();
};

PlaneManGame.prototype.createScene = function() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(this.colors.fogColor, 100, 950);
    this.aspectRatio = (this.WIDTH / this.HEIGHT);
    this.fieldOfView = 60;
    this.nearPlane = 1;
    this.farPlane = 10000;
    this.camera = new THREE.PerspectiveCamera(
        this.fieldOfView,
        this.aspectRatio,
        this.nearPlane,
        this.farPlane
    );

    this.camera.position.x = 0;
    this.camera.position.z = 200;
    this.camera.position.y = 100;

    //renderer shizzle.
    this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.shadowMap.enabled = true;
    this.container = document.getElementById('scene');
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener(this.events.resize, this.handleWindowResize, false);
};


PlaneManGame.prototype.handleWindowResize = function() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
};

PlaneManGame.prototype.init = function() {
    console.log('start');
    this.createScene();
	this.createLights();
	this.createSea();
};

PlaneManGame.prototype.createLights = function() {
	this.hemisphereLight = new THREE.HemisphereLight(
		this.colors.lightGrey,
		this.colors.black,
		this.lights.opacity90
	);

	this.shadow = new THREE.DirectionalLight(
		this.colors.whiteSolid,
		this.lights.opacity90
	);

	// direction of the light
	this.shadow.position.set(150, 350, 350);

	this.shadow.castShadow = true;
	this.shadow.shadow.camera.left = -400;
	this.shadow.shadow.camera.right = 400;
	this.shadow.shadow.camera.top = 400;
	this.shadow.shadow.camera.bottom = -400;
	this.shadow.shadow.camera.near = 1;
	this.shadow.shadow.camera.far = 1000;
	this.shadow.shadow.mapSize.width = 2048;
	this.shadow.shadow.mapSize.height = 2048;

	//add lights to `this.scene`
	this.scene.add(this.hemisphereLight);
	this.scene.add(this.shadow);
};

PlaneManGame.prototype.sea = function() {
	//radius top, radius bottom, height number of sides..
	this.geom = new THREE.CylinderGeometry(600,600,800,40,10);

	// rotate on the x axis
	this.geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

	this.mat = new THREE.MeshPhongMaterial({
		color:Colors.blue,
		transparent: true,
		opacity: this.lights.opacity60,
		shading: THREE.FlatShading
	});

	// Create an object in Three.js using mesh.
	this.mesh = new THREE.Mesh(this.geom, this.mat);
	this.mesh.receiveShadow = true;

};

PlaneManGame.prototype.createSea = function() {
	this.seaElement = this.sea();

	this.seaElement.mesh.position.y = -600;
	this.scene.add(this.mesh);
};

var newGame = new PlaneManGame();

window.addEventListener('load', newGame, false);
