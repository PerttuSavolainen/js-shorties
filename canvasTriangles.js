// constant variables
var POINT_AMOUNT = 20,
    MAX_WIDTH = 1920,
    MAX_HEIGHT = 960,
    MIN_DISTANCE = 100, // min distance between points
    CONNECTION_AMOUNT = 4; // to how many other points one point is connected

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var bgGradient = ctx.createLinearGradient(0,0,0,c.height);
bgGradient.addColorStop(0, "#01b76c");
bgGradient.addColorStop(1, "#01baaf");

var pointArray = []; // contains randomized point where triangles are generated
var copiedArray; 
    
pointArray = generatePoints(ctx, pointArray);
pointArray = findClosestPoints(pointArray);
drawGeometry(ctx, pointArray, bgGradient);

requestAnimationFrame(animate);

function findClosestPoints(pointArray) {
    
    copiedArray = pointArray.slice(); // copy array
    
    for (var i=0; i<pointArray.length; i++) {

        //var distanceArray = []; 
        pointArray[i].distanceArray = []; 

        // find the closest point
        for (var j=0; j<copiedArray.length; j++) {

            // get the subtraction of current distance and another
            var subX = Math.abs(pointArray[i].x - copiedArray[j].x);
            var subY = Math.abs(pointArray[i].y - copiedArray[j].y);

            // get the distance using pythagoras theorem
            var distance = Math.sqrt(Math.pow(subX, 2) + Math.pow(subY, 2)); 

            var distanceToArray = {
                index : j,
                distance : distance
            }

            pointArray[i].distanceArray.push(distanceToArray);
        }

        // creates own sort function which compares objects distance and sorts them
        pointArray[i].distanceArray = pointArray[i].distanceArray.sort(function(a, b) {
            return a.distance - b.distance;
        });

    }
    return pointArray;

}

function drawGeometry(ctx, pointArray, bgColor) {
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0,0, c.width, c.height); // fills canvas bg
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white";
    
    for (var i=0; i<pointArray.length; i++) {

        var lineWidth = CONNECTION_AMOUNT;
        
        ctx.beginPath();
        ctx.arc(pointArray[i].x, pointArray[i].y, pointArray[i].circleSize, 0, 2*Math.PI);
        ctx.fill();

        // loops through the closest points and draws line between them
        for (var j=0; j<CONNECTION_AMOUNT; j++) {
            // lineWidth is thickest to closest point and gets thinner for farther points 
            ctx.lineWidth = lineWidth;
            ctx.moveTo(pointArray[i].x, pointArray[i].y);
            ctx.lineTo(copiedArray[pointArray[i].distanceArray[j].index].x, copiedArray[pointArray[i].distanceArray[j].index].y);
            ctx.stroke();
            lineWidth--;
        }
        
        ctx.closePath();
        
        // move points 
        if ((pointArray[i].distance > pointArray[i].maxDistance) || (pointArray[i].distance < -pointArray[i].maxDistance)) {
            pointArray[i].speed *= -1;
            pointArray[i].angle += Math.PI * Math.random() / 4; // randomize new angle
        }
        
        if (pointArray[i].speed < 0) {
            var currentSpeed = pointArray[i].speed * 
            ((pointArray[i].maxDistance + pointArray[i].distance) / pointArray[i].maxDistance);
        }
        
        else {
            var currentSpeed = pointArray[i].speed * 
            ((pointArray[i].maxDistance - pointArray[i].distance) / pointArray[i].maxDistance);
        }
               
        pointArray[i].x += Math.sin(pointArray[i].angle) * currentSpeed; 
        pointArray[i].y += Math.cos(pointArray[i].angle) * currentSpeed; 
        pointArray[i].distance += pointArray[i].speed;

    }
}

// generates random points which are used for creating triangles
function generatePoints(ctx, pointArray) {
    
    for (var i=0; i<POINT_AMOUNT; i++) {
        do {
            var randomX = ~~(i * MIN_DISTANCE + (MIN_DISTANCE * Math.random()));
        } while (randomX > MAX_WIDTH);

        var randomY = ~~(MAX_HEIGHT * Math.random());
        var angle = 2 * Math.PI * Math.random();
        var speed = 0.5 + ~~(1.5 * Math.random());
        var maxDistance = 20 + ~~(50 * Math.random());
        var circleSize = 2 + ~~(3 * Math.random());

        var randomPoint = {
            x : randomX,
            y : randomY,
            angle : angle,
            speed : speed,
            distance : 0,
            maxDistance : maxDistance,
            circleSize : circleSize
        }

        pointArray.push(randomPoint);
        
    }

    return pointArray;
    
}

function animate() {
    setTimeout(function(){
        ctx.clearRect(0,0, c.width, c.height); // clears canvas
        drawGeometry(ctx, pointArray, bgGradient);
        requestAnimationFrame(animate);
    }, 20);
}