/*
 * The original game was 320x200
 */
function dim(dims)
{
	return [];
}

// yes, there are global i and j
let i = 0;
let j = 0;

//let sn = dim([8,3,1,1]);
let es = dim([155,1]);
let shape = dim([155,87]);
let piece = dim([9,9]);
let orient = dim([9,9]);
let cLr = dim([9,9]);
let os = dim([155]);
let beamck = dim([3,9,9]);

/*
 * RESTORE LaserDir: FOR i=0 to 3: READ dirx(i),diry(i): NEXT
 * LaserDir: DATA 0,-1,1,0,0,0,1,-1,0
 */
let dirx = [ 0, +1,  0, -1];
let diry = [-1,  0, +1,  0];

let Lpx = [];
let Lpy = [];
let Lx = [0,0,0,0];
let Ly = [0,0,0,0];
let dir = [0,0,0,0];
let aLive = [];
let term = [];
let nLx = [];
let nLy = [];
let drk = [];
let dirck = dim([8,3,3]);
let bmd0 = dim([158]);
let bmd1 = dim([22]);
let ddrcx = [[], []]; // dim([1,20]);
let ddrcy = [[], []]; // dim([1,20]);
let pt = dim([14]);
let s = dim([255]);
let n = dim([255]);
let sq = dim([255]);
let freq = dim([20,4]);
let vol = [];
let hysq = 0;

let shpt	= []; // 1, 6, 1, 7, 6, 4, 6, 5];
let turns	= []; // 1, 3, 1, 0, 3, 0, 3, 3];
let shptx	= [];
let shpty	= [];

let ShapePts	= [
	1, 1, -1, 17, 17, 1, 0, 0,
	3, 6, 7, 17, 9, 1, 11, 17, 7, 17, 1, 15, 17, 15, 11, 17, 9, 9,
	1, 1, -1, 9, 17, 9, 0, 0,
	0, 7, 5, 9, 9, 5, 13, 9, 9, 13, 5, 9, 13, 9, 9, 13, 9, 5, 0, 0,
	3, 6, 1, 2, 17, 2, 17, 17, 1, 17, 1, 2, -1, 1, 17, 1, 9, 9,
	0, 4, 1, 1, 17, 1, 17, 17, 1, 17, 1, 1, 0, 0,
	3, 6, 2, 1, 16, 1, 9, 8, 2, 1, -1, 1, -9, 9, 17, 1, 9, 4,
	3, 5, 2, 17, 17, 17, 17, 2, 2, 17, -1, 17, 17, 1, 13, 13,
];

let ShapeRefLect = [
	1, 0, 3, 2,
	3, 2, 1, 0,
	-1, -1, -1, -1,
	-1, -1, -1, -1,
	-1, -1, -1, -1,
	-1, -1, -1, -1,
	2, 1, 0, 3,
	0, 3, 2, 1,
	-1, -1, -1, -1,
	-1, -1,  0, -1,
	-1, -1, -1,  1,
	2, -1, -1, -1,
	-1, 3, -1, -1,
	0, 1, 2, 3,
	-2, 2, -1, 2,
	3, -2, 3, -1,
	-1, 0, -2, 0,
	1, -1, 1, -2,
	-1, 0, 3, -1,
	-1, -1, 1, 0,
	1, -1, -1, 2,
	3, 2, -1, -1,
];

let piece_sel = false;

let cop = [0, 4,6]; // color of player (1-indexed)
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

function palette(id)
{
	let c = colors[id];
	return color(c[0] * 256, c[1] * 256, c[2] * 256);
}


/*
 * The original InitShapes() draws some things on the screen
 * and uses GET() to read them back.  The shape points are
 * read from a DATA block, which we have replaed with the arrays.
 *
 * RESTORE ShapePts
 * k=0:x=0:y=0
 * FOR i=1 to 8
 *    READ turns(i), shpt(i)
 *    FOR j=0 to shpt(i)+1:
 *      READ shptx(i,j), shpty(i,j)
 *    NEXT
 *    GOSUB GetShapes
 * NEXT
 */
function InitShapes()
{
	k = 0;
	x = 0;
	y = 0;
	let offset = 0; // RESTORE ShapePts
	shptx[0] = []; // temp buffer used by ExpLode
	shpty[0] = [];
	for(i = 1 ; i <= 8 ; i++)
	{
		turns[i] = ShapePts[offset++];
		shpt[i] = ShapePts[offset++];
		shptx[i] = [];
		shpty[i] = [];

		for(j = 0 ; j <= shpt[i]+1 ; j++)
		{
			shptx[i][j] = ShapePts[offset++];
			shpty[i][j] = ShapePts[offset++];
		}

		// GOSUB GetShapes
	}

	offset = 0; // RESTORE ShapeRefLect
	for(i = 1 ; i <= 8 ; i++)
	{
		dirck[i] = [];
		for(j=0 ; j <= turns[i] ; j++)
		{
			dirck[i][j] = [];
			for(let k=0 ; k <= 3; k++)
			{
				dirck[i][j][k] = ShapeRefLect[offset++];
			}
		}
	}
}


/*
 * This function created strings and then used POKE SADD(si$) to be
 * able to create binary structs.
 */
function InitObjects()
{
}


function setup()
{
	createCanvas(320, 200);
	//scale(1.0, 26.0/18.0);

	for(i=0 ; i <= 20 ; i++)
		freq[i] = [];

	for(i=0 ; i <= 255 ; i++)
		s[i] = 127 - i;
	for(i=0 ; i <= 255 ; i++)
		n[i] = 127 - random() * 255;
	for(i=0 ; i <= 127 ; i++)
		sq[i] = 127 - random() * 50;
	for(i=128 ; i <= 255 ; i++)
		sq[i] = -128 + random() * 50;


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
	pL = 1; // player 1 goes first

	EndTurn();

}

//function keyReleased() { }
//function keyPressed() { }
//function mousePressed() { }

/*
 * This function used the PAINT command to fill in areas,
 * which we don't have an emulation for.
 */
let ShapePos = [
	8, 2, 0,
	8, 2, 0,
	1, 1, 1,
	2, 2, 0,
	4, 0, 0,
	6, 0, 0,
	1, 0, 0,
	8, 3, 1,
	8, 3, 1,
	8, 3, 1,
	5, 2, 0,
	5, 2, 0,
	7, 2, 0,
	3, 0, 0,
	3, 1, 1,
	5, 2, 0,
	5, 2, 0,
	8, 2, 0,
];


// uses global px and py
// would use the es object, but we instead draw the square with
// a rectangle:
// LINE(0,0)-(26,18),2,bf:GET(0,0)-(26,18),es(0,0)
// LINE(0,0)-(26,18),3,bf:GET(0,0)-(26,18),es(0,1)
function EraseSquare()
{
	x = px * 27 + 16;
	y = py * 19 - 6;
	bkgd = (px + py + 1) & 1; // alternate colors
	noStroke();
	fill(palette(bkgd ? 2 : 3));
	rect(x, y, 27, 19);
}


// extracted code to draw the board so that we can avoid sprites
function RedrawBoard()
{
	// These are the command buttons on the left hand side
	noStroke();
	fill(palette(3));
	rect(11, 54, 16, 11);
	rect(11, 94, 16, 10);
	rect(11, 134, 16, 10);

	textSize(5);
	textAlign(CENTER, CENTER);
	fill(palette(11));
	text("Q", 11+16/2, 54+11/2);
	text("R", 11+16/2, 94+10/2);
	text("L", 11+16/2, 134+10/2);

	for(px = 1 ; px <= 9 ; px++)
		for(py = 1 ; py <= 9 ; py++)
			EraseSquare();

	for(px=1 ; px <= 9 ; px++)
	{
		for(py=1 ; py <= 9 ; py++)
		{
			if (piece[px][py] > 0)
				PutShape();
		}
	}
}

function DrawBoard()
{
	let offset = 0; // RESTORE ShapePos
	for(px=1 ; px <= 9 ; px++)
	{
		cLr[px] = [];
		piece[px] = [];
		orient[px] = [];

		for(py=1; py <= 9 ; py++)
		{
			cLr[px][py] = 0;
			piece[px][py] = 0;
			orient[px][py] = 0;
		}
	}

	for(py=1; py <= 2 ; py++)
	{
		for(px=1; px <= 9 ; px++)
		{
			cLr[px][py] = 1;
			cLr[px][py+7] = 2;
			piece[px][py] = ShapePos[offset++];
			orient[px][py] = ShapePos[offset++];
			orient[10-px][10-py] = ShapePos[offset++];
			piece[10-px][10-py] = piece[px][py];
		}
	}


	RedrawBoard();

}

// This replaces the PUT that would use the blitter to draw the object
// globals are x,y for pixels, px,py for board, bkgd (color?),
// orient[px][py]
// it is converted from the GetShapes code, which reuses the global i
// from InitShapes
function draw_shape(co)
{
	let i = piece[px][py];
	let angle = orient[px][py];

	for(j=1 ; j <= shpt[i] ; j++)
	{
		let hue = co;
		if (shptx[i][j-1] < 0)
			hue++;
		noFill();
		stroke(palette(hue));

		let x1 = abs(shptx[i][j-1]);
		let y1 = shpty[i][j-1];
		let x2 = abs(shptx[i][j]);
		let y2 = shpty[i][j];

		if (angle == 0) // rotate0
			line(
				x1 + 4 + x,
				y1 + y,
				x2 + 4 + x,
				y2 + y
			);
		else
		if (angle == 1) // rotate90
			line(
				18 - y1 + 4 + x, 
				x1 + y,
				18 - y2 + 4 + x,
				x2 + y
			);
		else
		if (angle == 2) // rotate180
			line(
				18 - x1 + 4 + x,
				18 - y1 + y,
				18 - x2 + 4 + x,
				18 - y2 + y
			);
		else
		if (angle == 3) // rotate270
			line(
				x1 + 4 + x,
				18 - y1 + y,
				x2 + 4 + x,
				18 - y2 + y
			);

		// fill requires paint, which we don't use
		
	}
}


function PutShape()
{
	// ensure that we are within bounds
	if (px <= 0 || px >= 10
	||  py <= 0 || py >= 10)
		return;

	x = px * 27 + 16;
	y = py * 19 - 6;
	bkgd = (px + py + 1) & 1;
	draw_shape(cop[cLr[px][py]]);
}

function HyperCube()
{
	do {
		nx = int(random() * 9 + 1)
		ny = int(random() * 9 + 1)
	} while ((nx == 5 && ny == 5) || piece[nx][ny] != 0);

	piece[nx][ny] = piece[px][py];
	orient[nx][ny] = orient[px][py];
	cLr[nx][ny] = cLr[px][py];
	ValidMove();
	// play a sound
	PutShape();
	piece[spx][spy] = 0;
	cLr[spx][spy] = 0;
	px = nx;
	py = ny;
}

function VaLidMove()
{
	console.log("valid move");
	piece[px][py] = piece_sel;
	orient[px][py] = rot;
	cLr[px][py] = cLr[spx][spy];
	if (dx > 0 || dy > 0)
	{
		piece[spx][spy] = 0;
		cLr[spx][spy] = 0;
	}
}

function InVaLidMove()
{
	console.log("Invalid move");
	px = spx;
	py = spy;
	moves = 0;
}


function CheckMove()
{
	dx = abs(px-spx);
	dy = abs(py-spy);
	moves = dx + dy + abs(rot != orient[spx][spy]);
	if (dx == 0 && dy == 0)
		return VaLidMove();
	if (moves > move)
		return InVaLidMove();
	if (moves == 2)
	{
		midx = (px + spx)/2;
		midy = (py + spy)/2;
		if (midx == 5 && midy == 5)
			return InVaLidMove();
		if (dx == 2)
			if (piece[midx][py] != 0)
				return InVaLidMove();
		if (dy == 2)
			if (piece[px][midy] != 0)
				return InVaLidMove();
		if (dx == 1 && dy == 1)
			if ((piece[px][spy] != 0 || (px == 5 && spy==5))
			|| (spx == 5 && py == 5))
				return InVaLidMove();
	}

	// check for a capture
	if (piece[px][py] != 0)
	{
		if (piece_sel == 4 || piece_sel == 5)
		{
			if (taken)
				return InVaLidMove();
			if (piece[px][py] == 4)
				k = cLr[px][py];
			if (piece[px][py] == 2)
				k = L[clR[px][py]] == 0;

			// play some music
			taken = 1;
			return VaLidMove();
		} else
		if (piece_sel == 6)
		{
			if (hycube)
				return InVaLidMove();
			hycube = 1;
			return HyperCube();
		} else
			return InVaLidMove();
	}

	if (!(px == 5 && py == 5))
		return VaLidMove();
	if (hysq)
		return InVaLidMove();

	while ((px == 5 && py == 5) || piece[px][py] != 0)
	{
		px = int(random() * 9 + 1)
		py = int(random() * 9 + 1)
		// play a sound
		VaLidMove();
		// play another sound
		hysq = 1;
		PutShape();
		return;
	}
}


function ExpSnd()
{
	ch = 1 - ch;
	for(m=0 ; m <= 4 ; m++)
	{
		// SOUND freq[j][m], 0.05, vol[m], ch
	}
}

function ExpLode()
{
	for(j=0 ; j <= 4 ; j++)
		vol[4-j] = (j + 1) * 40;
	ch = 0;
	for(j = 0 ; j <= 20 ; j++)
	{
		t = 900 - int(random()*8) * 100;
		for(m=0 ; m <= 4 ; m++)
			freq[j][m] = t;
	}

	Lv = 120;
	cx = px * 27 + 29;
	cy = py * 19 + 3;

	// WAVE 0,n
	// WAVE 1,n

	// compute some random points
	if (dirx[drk[i]] == 0)
	{
		for(j=0 ; j <= 20 ; j++)
		{
			ddrcy[0][j] = int(random()*10) * diry[drk[i]] + cy;
			ddrcx[0][j] = cx + 10 - int(random() * 20)
			ddrcy[1][j] = int(random()*20) * diry[drk[i]] + cy;
			ddrcx[1][j] = cx + 20 - int(random() * 40);
		}
	} else {
		for(j=0 ; j <= 20 ; j++)
		{
			ddrcx[0][j] = int(random()*10) * dirx[drk[i]] + cx;
			ddrcy[0][j] = cy + 10 - int(random() * 20)
			ddrcx[1][j] = int(random()*20) * dirx[drk[i]] + cx;
			ddrcy[1][j] = cy + 20 - int(random() * 40);
		}
	}

	EraseSquare();

	// draw the random explosion
	stroke(palette(10));

	for(j=0 ; j <= 20 ; j++)
	{
		point(ddrcx[0][j], ddrcy[0][j])
		if ((j & 4) == 4)
			ExpSnd();
	}

	for(j=0 ; j <= 20 ; j++)
	{
		point(ddrcx[0][j], ddrcy[0][j])
		point(ddrcx[1][j], ddrcy[1][j])
		if ((j & 4) == 4)
			ExpSnd();
	}

	for(j=0 ; j <= 20 ; j++)
	{
		point(ddrcx[1][j], ddrcy[1][j])
		if ((j & 4) == 4)
			ExpSnd();
	}
}

/*
Hit:
term(i) = 1
drk(i) = tdir
IF d THEN EndBeam

tx = px
ty = py
px = Lx(i)
py = Ly(i)
if piece(px,py) = 4 THEN k = k + cLr(px,py)
if piece(px,py) = 2 THEN L(cLr(px,py)) = 0
x = px * 27 + 16
y = py * 19 - 6
m = piece(px,py)
shpt(0) = shpt(m)
FOR j=0 to shpt(0)+1
	shptx(0,j) = shptx(m,j)
	shpty(0,j) = shpty(m,j)
NEXT
t = i
i = 0
co = 8
OR orient(px,py) + 1 GOSUB rotate0, rotate90, rotate180, rotate270
i = t
px = tx
py = ty
// fall through the EndBeam
*/
function Hit()
{
	term[i] = 1;
	drk[i] = tdir;
	if (d)
		return false; // EndBeam

	tx = px;
	ty = py;
	px = Lx[i];
	py = Ly[i];
	if (piece[px][py] == 4)
		k = k + cLr[px][py];
	if (piece[px][py] == 2)
		L[cLr[px][py]] = 0
	x = px * 27 + 16;
	y = py * 19 - 6;
	m = piece[px][py];
	shpt[0] = shpt[m];
	for(j=0 ; j <= shpt[0]+1 ; j++)
	{
		shptx[0][j] = shptx[m][j];
		shpty[0][j] = shpty[m][j];
	}
	t = i;
	i = 0;
	co = 8;

	draw_shape(co);

	i = t;
	px = tx;
	py = py;

	return false; // EndBeam
}


/*
bmd0: LINE(0,0)-(0,18)
bmd1: LINE(0,0)-(26,0)

DrawBeam:
x = Lx[i] * 27 + 29
y = Ly[i] * 19 + 3
ON dir[i] GOTO BRt, Bdn, BLt // fall through to BRup
BUp: PUT(x,y-19), bmd0: GOTO CkBeam
BRt: PUT(x,y+1), bmd1: GOTO CkBeam
BDn: PUT(x+1,y) bmd0: GOTO CkBeam
BLt: PUT(X-27,y), bmd1: GOTO CkBeam

CkBeam:
IF (nLx(i) > 9) OR (nLy(i) > 9) OR (nLx(i) < 1) OR (nLy(i) < 1) THEN EndBeam
IF (nLx(i) = 5 AND nLy(i) = 5) THEN EndBeam
Lx(i) = nLx(i)
Ly(i) = nLy(i)
IF piece(nLx(i), nLy(i))=0 THEN Advbeam
tdir = dir(i)
dir(i) = dirck(piece(Lx(i),Ly(i)),orient(Lx(i),Ly(i)),dir(i))
IF dir(i)=-1 THEN Hit
IF dir(i)>-2 THEN AdvBeam
IF aLive(2)=0 THEN
	j=2
ELSE
	j=3
aLive(j)=1
Lx(j) = Lx(i)
Ly(j) = Ly(i)
dir(i) = tdir+1 AND 3
dir(j) = tdir - 1 AND 3
GOTO AdvBeam
*/
function DrawBeam()
{
	x = Lx[i] * 27 + 29;
	y = Ly[i] * 19 + 3;

	noFill();
	stroke(palette(10));

	console.log("dir[i]="+dir[i]);
	if (dir[i] == 1) // BRt, bmd1
		line(x,y, x+26, y);
	else
	if (dir[i] == 2) // BDn, bmd0
		line(x,y, x, y+18);
	else
	if (dir[i] == 3) // BLt, bmd1
		line(x, y, x-26, y);
	else // dir[i] == 0 BUp, bmd0
		line(x,y, x, y-18);

	// CkBeam:
	if (nLx[i] > 9 || nLy[i] > 9 || nLx[i] < 1 || nLy[i] < 1)
		return false; // EndBeam
	if (nLx[i] == 5 && nLy[i] == 5)
		return false; // EndBeam
	Lx[i] = nLx[i];
	Ly[i] = nLy[i];
	if (piece[nLx[i]][nLy[i]] == 0)
		return true; // AdvBeam

	// Hit something, check for either a beam split or turn
	tdir = dir[i];
	dir[i] = dirck[piece[Lx[i]][Ly[i]]][orient[Lx[i]][Ly[i]]][dir[i]];
	if (dir[i] == -1)
		return Hit(); // always falls through to EndBeam
	if (dir[i] > -2)
		return true; // AdvBeam

	// Create a new laser
	if (aLive[2] == 0)
		j = 2;
	else
		j = 3;
	aLive[j] = 1;
	Lx[j] = Lx[i];
	Ly[j] = Ly[i];
	dir[i] = (tdir + 1) & 3;
	dir[j] = (tdir - 1 + 4) & 3; // ensure wrap doesn't fail
console.log("new laser " + j + " tdir=" + tdir + " dir[i]=" + dir[i] + ") dir[j]=" + dir[j]);
	return true; // AdvBeam
}
			

/*
Fire:
px = Lpx(pL)
py = Lpy(pL)
Lx(1) = px
Ly(1) = py
dir(1) = orient(px,py)
FOR i=1 to 3: aLive(i)=0: term(i) = 0: NEXT
aLive(1) = 1
WHILE(aLive(1) = 1 OR aLive(2) = 1 or aLive(3) = 1)
	FOR i=1 to 3
		IF aLive(i) < 1) THEN AdvBeam
		nLx(i) = Lx(i) + dirx(dir(i))
		nLy(i) = Ly(i) + diry(dir(i))
		IF beamck(dir(i),Lx(i),Ly(i)) = 1 THEN EndBeam
		beamck(dir(i),Lx(i),Ly(i)) = 1
		GOTO DrawBeam

		Hit: // see code above; falls through to end beam?

		EndBeam:
		aLive(i) = -1
		AdvBeam:
	NEXT
WEND
*/

function Fire()
{
	console.log("Fire! " + Lpx[pL] + "," + Lpy[pL]);
	px = Lpx[pL];
	py = Lpy[pL];
	Lx[1] = px;
	Ly[1] = py;
	dir[1] = orient[px][py];

	for(i=1 ; i <= 3 ; i++)
	{
		aLive[i] = 0;
		term[i] = 0;
	}

	aLive[1] = 1;

	while (aLive[1] == 1 || aLive[2] == 1 || aLive[3] == 1)
	{
		for(i=1 ; i <= 3 ; i++)
		{
			if (aLive[i] < 1)
				continue;

			nLx[i] = Lx[i] + dirx[dir[i]];
			nLy[i] = Ly[i] + diry[dir[i]];

console.log("dir["+i+"]="+dir[i] + " Lxy=" + Lx[i] +"," + Ly[i]);
			if (beamck[dir[i]][Lx[i]][Ly[i]] == 1)
			{
				aLive[i] = -1;
				continue;
			}

			beamck[dir[i]][Lx[i]][Ly[i]] = 1;

			if (! DrawBeam())
			{
				aLive[i] = -1;
				continue;
			}

		}
	}
}

/*
Laser:
k=0
d=0
GOSUB Fire
FOR i=0 to 3
	FOR x=1 to 9
		FOR y=1 to 9
			beamck(i,x,y) = 0
NEXT y,x,i
FOR i=1 to 3
	IF term(i) THEN
		IF piece(Lx(i),Ly(i)) > 0 THEN
			tx = px
			ty = py
			px = Lx(i)
			py = Ly(i)
			GOSUB ExpLode
			px = tx
			py = ty
		END IF
	END IF
NEXT
TIMER OFF
d = 1
GOSUB Fire
FOR i=1 to 3
	IF term(i) THEN
		IF piece(Lx(i),Ly(i)) > 0 THEN
			tx = px
			ty = py
			px = Lx(i)
			py = Ly(i)
			piece(px,py) = 0
			cLr(px,py) = 0
			GOSUB EraseSquare
			px = tx
			py = ty
		END IF
	END IF
NEXT
FOR i=0 to 3
	FOR x=1 to 9
		FOR y=1 to 9
			beamck(i,x,y) = 0
NEXT y,x,i
RETURN
*/

function Laser()
{
	console.log("FIRE THE LASER!");
	k = 0;
	d = 0;

	// create the beamck array
	for(i=0 ; i <= 3 ; i++)
	{
		beamck[i] = [];
		for(x=1 ; x <= 9 ; x++)
		{
			beamck[i][x] = [];
			for(y=1 ; y <= 9 ; y++)
				beamck[i][x][y] = 0;
		}
	}
				

	Fire();

	for(i=1 ; i <= 3 ; i++)
		for(x=1 ; x <= 9 ; x++)
			for(y=1 ; y <= 9 ; y++)
				beamck[i][x][y] = 0

	for(i=1 ; i <= 3 ; i++)
	{
		if (term[i] == 1)
			if (piece[Lx[i]][Ly[i]] > 0)
			{
				tx = px;
				ty = py;
				px = Lx[i];
				py = Ly[i];
				piece[px][py] = 0;
				cLr[px][py] = 0;
				ExpLode();
				px = tx;
				py = ty;
			}
	}

	// TIMER OFF?
	d = 1;
	Fire();

	for(i=0 ; i <= 3 ; i++)
		for(x=1 ; x <= 9 ; x++)
			for(y=1 ; y <= 9 ; y++)
				beamck[i][x][y] = 0;
		
}


function Options()
{
	moves = 0;
	if (y > 133 && y < 145 && fired && L[pL])
	{
		fired = 0;
		// laser sounds
		Laser();
		moves = 1;
		return EndMove();
	} else
	if (y > 93 && y < 105)
	{
		// restart
		// TODO
	} else
	if (y > 53 && y < 66)
	{
		// Quit
	}

}


let prev_mouse = false;

/*
Notes on the Amiga BASIC mouse command:
MOUSE(0) = Status of mouse button
	0 = not down,
	1 = clicked once,
	2 = clicked twice,
	-1 = button held down,
	-2 = button held down after clicking twice
MOUSE(1) = Current horizontal poisiton,
MOUSE(2) = Current vertical position,
MOUSE(3) = Starting horizontal position,
MOUSE(4) = Starting vertical position,
MOUSE(5) = Ending horiz. position,
MOUSE(6) = Ending vert. position.
*/

/*
Main:
pL = pL XOR 3  // toggle player
px = 5
py = 5
move = 2
hycube = 0
hysq = 0
taken = 0
fired = 1
LINE(40,10)-(288,186),cop(PL),b // move 1 indicator
LINE(42,12)-(286,184),cop(PL),b // move 2 indicator

MovePiece:
WHILE MOUSE(0) > -1 : WEND // wait for mouse down
x = MOUSE(3)
y = MOUSE(4)
px = INT((x-17)/27)
py = INT((y+6)/19)
moves = 0

// if they clicked off the board, try to process an option button
IF NOT((px > 0 AND px < 10) AND (py > 0 AND py < 10)) THEN Options

// if they clicked on non-their piece, go back to waiting
IF cLr(px,py) <> pL THEN MovePiece

piece = piece(px,py)
rot = orient(px,py)
obindex = oi(piece,rot) // image?
spx = px // starting position
spy = py // starting position

// while the mouse is held down, move the piece along with the mouse
// if the user hits any key, rotate the piece and play a tune
WHILE MOUSE(0) < 0
	OBJECT.X obindex, MOUSE(1)-14
	OBJECT.Y obindex, MOUSE(2)-10
	IF INKEY$ <> "" THEN
		rot = (rot + 1) AND turns(piece)
		j = obindex
		obindex = oi(piece,rot)
		OBJECT.X obindex, MOUSE(1)-14
		OBJECT.Y obindex, MOUSE(2)-10
		OBJECT.OFF j // turn off the old piece
		WAVE 0, s
		SOUND 4000,.1,255,0
		OBJECT.ON obindex // turn on the new piece
	END IF
WEND

OBJECT.OFF obindex
GOSUB EraseSquare

// release location is 5/6
px = INT((MOUSE(5)-17)/27)
py = INT((MOUSE(6)+6)/19)
GOSUB CheckMove
GOSUB PutShape

if piece(px,py)=2 THEN Lpx(pL)=px:Lpy(pL)=py

EndMove:
IF k THEN EndGame
move = move - moves

// turn off one move indicator if there is another move left
IF move = 1 THEN LINE(40,10)-(288,186),0,b
IF move > 0 THEN MovePiece
GOTO Main
*/

function EndTurn()
{
	// toggle the player
	pL ^= 3;

	px = 5;
	py = 5;
	move = 2;
	hycube = 0;
	hyqs = 0;
	taken = 0;
	fired = 1;

	noFill();
	stroke(palette(cop[pL]));
	rect(40, 10, 288-40, 186-10);
	rect(42, 12, 286-42, 184-12);
}


function EndMove()
{
	if (k)
		return EndGame();

	move = move - moves;

	if (move == 1)
	{
		// remove one move indicator
		noFill();
		stroke(palette(0));
		rect(40,10, 288-40, 186-10);
	}

	if (move == 0)
		EndTurn();
}


function draw()
{
	// MovePiece:
	if (mouseIsPressed && !prev_mouse)
	{
		// first mouse press
		prev_mouse = true;

		x = mouseX;
		y = mouseY;
		px = int((x-17)/27);
		py = int((y+6)/19);
		moves = 0;
		piece_sel = 0;
		
		if (!(px > 0 && px < 10 && py > 0 && py <10))
			return Options();
		else
		if (cLr[px][py] != pL)
			return;

		piece_sel = piece[px][py];
		rot = orient[px][py];

		// obindex = oi[px][rot];
		spx = px;
		spy = py;
		if (piece_sel == 0)
			return; // GOTO MovePiece
		EraseSquare();
	} else
	if (mouseIsPressed && prev_mouse)
	{
		// mouse drag after first press
		prev_mouse = true;

		// ignore if we do not have a piece selected
		if (piece_sel == 0)
			return;

		// need to check for keypress

		x = mouseX - 26/2;
		y = mouseY - 18/2;
		draw_shape(cop[cLr[px][py]]);

	} else
	if (!mouseIsPressed && prev_mouse)
	{
		// first release after a drag
		prev_mouse = false;

		x = mouseX;
		y = mouseY;
		px = int((x-17)/27);
		py = int((y+6)/19);


		// if no piece is selected, we're done
		if (piece_sel == 0)
		{
			RedrawBoard();
			return;
		}

		CheckMove();
		PutShape();

		if (piece[px][py] == 2)
		{
			Lpx[pL] = px;
			Lpy[pL] = py;
		}

		RedrawBoard();
		return EndMove();
	}
}
