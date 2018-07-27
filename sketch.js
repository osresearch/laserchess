/*
 * The original game was 320x200
 */
functon dim(dims)
{
	return [];
}

let sn = dim([8,3,1,1]);
let es = dim([155,1]);
let shape = dim([155,87]);
let piece = dim([9,9]);
let orient = dim([9,9]);
let cLr = dim([9,9]);
let os = dim([155]);
let beamck = dim([3,9,9]);
let dirck = dim([8,3,3]);
let bmd0 = dim([158]);
let bmd1 = dim([22]);
let shpt = dim([8]);
let ddrcx = dim([1,20]);
let ddrcy = dim([1,20]);
let pt = dim([14]);
let s = dim([255]);
let n = dim([255]);
let sq = dim([255]);
let freq = dim([20,4]);
let shptx = dim([8,19]);
let shpty = dim([8,19]);
let cop = [];
let L = [];

let fL = true; // true for "Filled" shapes

let colors = [
	[0.0, 0.0, 0.0],
	[0.0, 0.0, 0.0],
	[0.0, 0.0, 0.0], // palette data starts at index 2
	[0.3, 0.3, 0.3],
	[0.6, 0.0, 0.0],
	[1.0, 0.0, 0.0],
	[0.0, 0.55, 0.0],
	[0.0, 0.9, 0.0],
	[1.0, 1.0, 0.0],
	[1.0, 1.0, 0.0],
	[0.6, 0.6, 0.6],
	[1.0, 1.0, 1.0],
	[1.0, 1.0, 0.0],
	[1.0, 1.0, 0.0],
	[1.0, 1.0, 0.0],
];

function color(id)
{
	let c = colors[id];
	stroke(c[0] * 256, c[1] * 256, c[2] * 256);
}


function InitShapes()
{
}


function InitObjects()
{
}


function setup()
{
	createCanvas(320, 200:

	for(let i=0 ; i <= 255 ; i++)
		s[i] = 127 - i;
	for(let i=0 ; i <= 255 ; i++)
		n[i] = 127 - random() * 255;
	for(let i=0 ; i <= 127 ; i++)
		sq[i] = 127 - random() * 50;
	for(let i=128 ; i <= 255 ; i++)
		sq[i] = -128 + random() * 50;

	cop[1] = 4;
	cop[2] = 6;
	InitShapes();
	InitObjects();
	
	// Start:
	L[1] = 1;
	L[2] = 1;
	Lpx[1] = 4;
	Lpy[1] = 1;
	Lpx[2] = 6;
	Lpy[2] = 9;

	background(0);
	DrawBoard();
	k = 0;
	pL = 1;


}

//function keyReleased() { }
//function keyPressed() { }
//function mousePressed() { }


function DrawBoard()
{
}




function draw()
{
	// Main:
	pL = pL ^ 3;
	px = 5;
	py = 5;
	move = 2;
	hycube = 0;
	hyqs = 0;
	taken = 0;
	fired = 1;

	noFill();
	color(pL);
	rect(40, 10, 288-40, 186-10);
	rect(42, 12, 286-42, 184-12);

	// MovePiece:
	while (!mouseIsPresed)
		;
}
