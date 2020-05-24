var Steuerung = (audioElement, leds) => {

    function handleAudioLevel(level) {
        if (level <= 0) return;
        leds.forEach((led) => {
            socket.emit('led', { addr: led.addr, port: led.port, val: (level > led.audiolevel ? 1 : 0) });
        });
    }

    function initAudio() {
        // https://esonderegger.github.io/web-audio-peak-meter/
        var audioCtx = new window.AudioContext();
        var sourceNode = audioCtx.createMediaElementSource(audioElement);
        sourceNode.connect(audioCtx.destination);
        var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx);
        var max = 0;
        meterNode.onaudioprocess = function(audioProcessingEvent) {
            var inputBuffer = audioProcessingEvent.inputBuffer;
            var i;
            var channelData = [];
            var channelMaxes = [];
            for (i = 0; i < meterNode.channelCount; i++) {
            channelData[i] = inputBuffer.getChannelData(i);
            channelMaxes[i] = 0.0;
            }
            for (var sample = 0; sample < inputBuffer.length; sample++) {
                for (i = 0; i < meterNode.channelCount; i++) {
                    var s = Math.abs(channelData[i][sample]);
                    if (s > channelMaxes[i]) {
                        channelMaxes[i] = s;
                    }
                    if (s > max) max = s;
                }
            }
            //console.log(max, channelMaxes);
            handleAudioLevel(channelMaxes[0] * volume);
        };
        audioElement.addEventListener('play', function() {
            audioCtx.resume();
        });
    }

    var socket = io();

    var onidx = 1;
    var offidx = 0;
    var llleds = leds.slice().sort((a, b) => a.llidx - b.llidx);

    var volume = 1;

    function lauflicht() {
        onidx += 1;
        if (onidx >= llleds.length) {
            onidx = 0;
        }
        var onled = llleds[onidx];
        socket.emit('led', { addr: onled.addr, port: onled.port, val: 1 });
        offidx += 1;
        if (offidx >= llleds.length) {
            offidx = 0;
        }
        var offled = llleds[offidx];
        socket.emit('led', { addr: offled.addr, port: offled.port, val: 0 });
    }

    var raspicontrols = false;

    var ll;

    initAudio();

    return {
        toggleLauflicht: () => {
            if (ll) {
                clearInterval(ll);
                ll = null;
            } else {
                ll = setInterval(lauflicht, 100);
            }
        },
        toggleraspicontrol: () => {
            raspicontrols = !raspicontrols;
            socket.emit(raspicontrols ? 'takeover' : 'letarduinocontrol');
        },
        setleddirect: (index, on) => {
            var led = leds[index];
            socket.emit('led', { addr: led.addr, port: led.port, val: (on ? 1 : 0) });
        },
        toggleled: (index) => {
            var led = leds[index];
            led.on = !led.on;
            socket.emit('led', { addr: led.addr, port: led.port, val: (led.on ? 1 : 0) });
        },
        loadFile: (file) => {
            var reader = new FileReader();
            reader.onload = function (e) {
                audioElement.setAttribute('src', e.target.result);
                audioElement.play();
            }
            reader.readAsDataURL(file);
        },
        setvolume: (vol) => {
            volume = vol;
        },
    }
    
};
