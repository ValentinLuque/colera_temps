// Global variable
var img = null,
	needle = null,
	ctx = null,
	degrees = 0;
	//grados = 90;
	cuenta=0;
	
function clearCanvas() {
	 // clear canvas
	ctx.clearRect(0, 0, 200, 200);
}

function draw() {

	clearCanvas();

	// Draw the compass onto the canvas
	ctx.drawImage(img, 0, 0);

	// Save the current drawing state
	ctx.save();

	// Now move across and down half the 
	ctx.translate(100, 100);

	// Rotate around this point
	//ctx.rotate(degrees * (Math.PI / 180));
	ctx.rotate(grados * (Math.PI / 180));
	// Draw the image back and up
	
	ctx.drawImage(needle, -100, -100);

	// Restore the previous drawing state
	ctx.restore();

	// Increment the angle of the needle by 5 degrees
	//degrees += 5;
	cuenta++;
	grados +=2;
	if (cuenta>=30) {grados=grados2};
	//console.log("Grados b son: "+grados +"grados2 es: "+grados2 +"cuenta es: "+cuenta);
}

function imgLoaded() {
	// Image loaded event complete.  Start the timer
	setInterval(draw, 100);
}

function init() {
	// Grab the compass element
	var canvas = document.getElementById('compass');
	grados=$('#direccion2').val();
	grados2=grados;
	cuenta=0;
	//console.log("Grados son: "+grados);
	//console.log("Grados2 son: "+grados2);
	// Canvas supported?
	if (canvas.getContext('2d')) {
		ctx = canvas.getContext('2d');

		// Load the needle image
		needle = new Image();
		needle.src = 'compas/needle.png';

		// Load the compass image
		img = new Image();
		img.src = 'compas/compass.png';
		img.onload = imgLoaded;
	} else {
		$('#compass').html("Canvas no soportado");
	}
}