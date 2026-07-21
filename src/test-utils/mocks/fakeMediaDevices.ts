/** A silent, synthetic audio MediaStream (440Hz oscillator into a stream destination) — lets MediaRecorder actually produce real chunks without a microphone. */
export const createFakeAudioStream = (): MediaStream => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const destination = audioContext.createMediaStreamDestination();
    oscillator.frequency.value = 440;
    oscillator.connect(destination);
    oscillator.start();
    return destination.stream;
};

/** An animated canvas captured as a MediaStream — lets MediaRecorder produce real video chunks without a camera. */
export const createFakeVideoStream = (): MediaStream => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    let hue = 0;

    const draw = () => {
        hue = (hue + 2) % 360;
        if (ctx) {
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        requestAnimationFrame(draw);
    };
    draw();

    return (canvas as HTMLCanvasElement & { captureStream(frameRate?: number): MediaStream }).captureStream(15);
};
