

var MODELPATH = "3dObjects/Model_"
var PARTPATH = "_part_";

var renderer, scene, camera, light, light2, light3;
//var element, stangeA, stangeB, testelement;
//var group, group2;

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var hasFlipped = false;



var modelCount, stangenCountY;
var partCount;
var stangen = [];
var distances = [0.2875, 0.05488,0.2875,0.05488];
var stangenlaengen = [14.857,14.974,14.857,14.974];





var clickCounter = 0;



function basic_init(){

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	//schönes grün: renderer.setClearColor( 0x999933, 1 );
	renderer.setClearColor( 0x111111, 1 );
	document.getElementById('viewport').appendChild(renderer.domElement);
	
	scene = new THREE.Scene();
	
	light = new THREE.DirectionalLight('#ffffff');
	light.position.set( 1, 10, 1 ).normalize();
	light.intensity = 1.0;
	scene.add( light );

	light2 = new THREE.AmbientLight('#ffffff');
	light2.position.set( 5, 5, 5 ).normalize();
	light2.intensity = 1.0;
	scene.add( light2 );

	

	camera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		0.1,
		10000
	);

	camera.position.set(0, 20, 30);
	
	camera.lookAt( scene.position );
	scene.add( camera );

	
	/***************************************************************/
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );	
	document.addEventListener( 'click', onDocumentClick, false );	
	

}




function elements_init(){

	partCount = 3;
	modelCount = 4; //zum betrachter zugehend
	
	
	


	//von oben nach unten
	for(var i=0; i<modelCount; i++){
		
		var offsetX = i*6;

		//create object
		var group = new THREE.Object3D();

		//add custom property to this object (not to the prototype!)
		group.hasFlipped = false;

		//add object to list
		stangen[stangen.length]= group;
		//build up object
		
		var offsetY = i*10-20; 
		
		groupIteratively(i, 0, group, partCount, true, offsetX, offsetY);
		
	}

	
}






function animate(){

	camera.position.x += ( -mouseX/20 - camera.position.x ) * 0.5;
	camera.position.y += ( -mouseY/20 - camera.position.y ) * 0.5;
	camera.position.z += ( -mouseY/20 - camera.position.z ) * 0.5;

	

	//console.log("CAM X: "+camera.position.x);
	//console.log("CAM Y: "+camera.position.y);

	//group2.position.y += 0.01;


	 /* TODO: here check dass alle Elemente geladen sind der gruppe*/
		
		//letItFloat(group.children[0]);
		for(var i=0; i<clickCounter; i++){

			if(stangen[i]){

					//animation of the element (part_0)
					letItFloat(stangen[i].children[0]);
					if(stangen[i].children[0].position.y> 3.2){
						letItRotate(stangen[i].children[0]);
					}

					//animation of the stange (part_2)
					if((stangen[i].hasFlipped == false) && (stangen[i].children[0].position.y > 4)){
						moveTogetherAnimated(stangen[i].children[2]);
						if(stangen[i].children[2].rotation.y > (Math.PI/2)){ //unsauber!!
							moveTogetherCleanUp(stangen[i].children[2], distances[i]);
							stangen[i].hasFlipped = true;
						}
						
					}
					

				
			}
			
		}
		



	requestAnimationFrame(animate);
	render();
}





function render(){

	camera.lookAt( scene.position );
	renderer.render(scene, camera);
}









/*********************** HELPER FUNCTIONS **************************/


/**/
function groupIteratively(modelNum, partNum, group, partCount, customMat, offsetX, offsetY){

	var loader = new THREE.JSONLoader();
	
	console.log("modelNumber: "+modelNum);
	console.log("partNumber: "+partNum);

    loader.load( MODELPATH + modelNum + PARTPATH + partNum + ".js", function(geometry, mat){
		createPart(geometry, mat, modelNum, partNum, group, partCount, customMat, offsetX, offsetY);
	});    

		
}


function createPart(geo, mat, modelNum, partNum, group, partCount, customMat, offsetX, offsetY){

		var importmats = new THREE.MeshFaceMaterial( mat );

		//change the center of the geometry
		//shiftRotationPoint(geo, [,0,0]);

		//2.013 ist die Dicke des ganzen Dinges, damit er an der runden Kante rotiert
		//

		shiftRotationPoint(geo, [-(distances[modelNum]+stangenlaengen[modelNum]),0,0]);

		//create the Mesh with geo and mat

		var part = new THREE.Mesh(geo, importmats);
			
		part.position.x = 0;
		part.position.y = 0;
		part.position.z = 0;
		//part.name = "element";


		
		group.add( part );
		//console.log("build part "+partNum);
		
		if (partNum +1 < partCount){
			partNum ++;
			groupIteratively(modelNum, partNum, group, partCount, customMat, offsetX, offsetY);
		}
		//if all parts are ready..
		else {
			group.position.x = offsetY;
			group.position.y = 0;
			group.position.z = offsetX; //this is strange because of rotation
			group.rotation.y = Math.PI;
			scene.add(group);	
		}

}










function shiftRotationPoint(geometry, point){
	var setX = point[0];
	var setY = point[1];
	var setZ = point[2];
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( setX, setY, setZ ) );
}



function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX );
	mouseY = ( event.clientY - windowHalfY );
}



function onDocumentClick(){

	clickCounter ++;


}


function letItFloat(thing){
	thing.position.y += 0.09;
}

function letItRotate(thing){
	thing.rotation.y += 0.04;		
}

function moveTogetherCleanUp(object, distance){
		object.position.x = -distance;
		object.rotation.y = Math.PI/2;		
}

function moveTogetherAnimated(object){
	object.rotation.y += Math.PI/80;
}




window.onload = function() {

	basic_init();
	elements_init();
	animate();
	
}

