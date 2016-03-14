// Animation with Web Audio API and canvas

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var audioSource = document.getElementById("audio");

var analyser, dataArray, radiusArray, bufferLength;

var AIMED_FPS = 1000 / 60, // second number is aimed fps count
    WIDTH = c.width,
    HEIGHT = c.height;

createAudioAnalyser(audioSource);
draw();

function createAudioAnalyser(source) {
    radiusArray = [];
    var audioContext = new window.AudioContext();
    var source = audioContext.createMediaElementSource(source); // creates a mediaelement object from given audiofile

    analyser = audioContext.createAnalyser(); // creates analysernode,  which can be used to expose audio time and frequency data etc. 

    analyser.fftSize = 64; // fft (Fast Fourier Transform) captures audio data in a certain frequency domain
    bufferLength = analyser.frequencyBinCount; // frequencyBinCount is usually a half of the fftSize
    dataArray = new Uint8Array(bufferLength); // uint8array represents an array of 8-bit unsigned integers

    // creates an array of radiuses
    for (var i=0; i<bufferLength; i++) {
        var radiusToArray = 10 + Math.random() * 100;
        radiusArray.push(radiusToArray);
    }

    ctx.clearRect(0, 0, c.width, c.height); 

    source.connect(analyser); // connects the analyser to audio
    analyser.connect(audioContext.destination); // enables the audio play
}

function draw() {
    setTimeout(function(){
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        var x = 0, y= c.height / 2;

        for (var i=0; i<bufferLength; i++) {
            y = 2 * radiusArray[i]; 
            ctx.beginPath();
            ctx.fillStyle = "rgb(50," + ~~(radiusArray[i]+100) + ", 50)"; 
            ctx.arc(x, y, (radiusArray[i] + Math.exp(dataArray[i]/65)), 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
            x += 2 * radiusArray[i] + 10;
        }
    }, AIMED_FPS);            
}