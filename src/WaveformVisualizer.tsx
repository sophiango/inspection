// src/components/WaveformVisualizer.tsx

import {useEffect, useRef} from "react";

interface WaveformVisualizerProps {
    audioData: number[];
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
}

const WaveformVisualizer = ({
                                audioData,
                                currentTime,
                                duration,
                                onSeek
                            }: WaveformVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawWaveform();
    }, [audioData, currentTime]);

    const drawWaveform = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // If no audio data, show "No Audio" message
        if (audioData.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No Audio Detected', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Set styles
        ctx.lineWidth = 1; // Set the line thickness for the waveform.
        ctx.strokeStyle = '#107af6'; // Set the line color to blue (Material Design blue).
        ctx.fillStyle = 'rgba(76, 175, 80, 0.2)'; // Set the fill color to a semi-transparent blue.

        const width = canvas.width; // Get the width of the canvas.
        const height = canvas.height; // Get the height of the canvas.
        const barWidth = width / audioData.length; // Calculate the width of each "bar" in the waveform.  The waveform is drawn as a series of lines, and this determines how wide each segment of the line is.

        // Draw waveform
        ctx.beginPath(); // Start a new path.  A path is a sequence of points and lines.
        ctx.moveTo(0, height / 2); // Move the starting point of the path to the middle of the canvas height, at the left edge.  This is where the waveform will start.

        audioData.forEach((dataPoint, i) => {
            const x = i * barWidth; // Calculate the x-coordinate of the current data point.
            const y = (dataPoint * height / 2) + (height / 2); // Calculate the y-coordinate.
            //   - dataPoint is the audio sample value, typically between -1 and 1.
            //   - height / 2 is the vertical center of the canvas.
            //   - Multiplying dataPoint by height / 2 scales the audio sample to the height of the canvas.
            //   - Adding height / 2 shifts the waveform to the center of the canvas.
            ctx.lineTo(x, y); // Add a line segment from the previous point to the current (x, y) coordinate.
        });

        ctx.lineTo(width, height);  // Draw a line to the middle of the right edge
        ctx.stroke(); // Draw the path (the waveform line) onto the canvas.
        ctx.closePath(); // Close the path. This connects the last point to the first point, which is necessary for filling the area under the curve.

        // Fill area under waveform
        ctx.globalAlpha = 0.2; // Set the transparency for the fill color.
        ctx.fill(); // Fill the area enclosed by the path (the waveform).
        ctx.globalAlpha = 1.0; // Reset the transparency to 1 (fully opaque).

        // Draw playhead
        if (duration > 0) {
            const playheadPos = (currentTime / duration) * width; // Calculate the horizontal position of the playhead based on the current time.
            ctx.beginPath(); // Start a new path for the playhead line.
            ctx.moveTo(playheadPos, 0); // Move to the top of the canvas at the playhead position.
            ctx.lineTo(playheadPos, height); // Draw a line from the top to the bottom of the canvas at the playhead position.
            ctx.strokeStyle = '#ff0000'; // Set the playhead line color to red.
            ctx.stroke(); // Draw the playhead line.
        }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current; // Get the canvas element using the ref.
        if (!canvas || duration === 0) return; // Check if the canvas is valid and if the duration is available. If not, exit the function.

        const rect = canvas.getBoundingClientRect(); // Get the size and position of the canvas element relative to the viewport.
        const clickX = e.clientX - rect.left; // Calculate the x-coordinate of the click relative to the canvas.
        //  - e.clientX is the x-coordinate of the click relative to the entire viewport.
        //  - rect.left is the x-coordinate of the left edge of the canvas relative to the viewport.
        //  - Subtracting them gives the x-coordinate of the click within the canvas.
        const canvasWidth = canvas.width; // Get the width of the canvas.

        const clickTimeRatio = clickX / canvasWidth; // Calculate the ratio of the click's x-position to the canvas's width. This gives a value between 0 and 1, representing the relative position of the click on the waveform.
        const newTime = clickTimeRatio * duration; // Calculate the new playback time by multiplying the click ratio by the total duration.

        onSeek(newTime); // Call the onSeek callback function (provided as a prop) with the calculated new time. This function is expected to update the video's current time and the waveform's display.
    };

    return (
        <div className="waveform-container">
            <h3>Audio Waveform</h3>
            <canvas
                ref={canvasRef}
                className="waveform-canvas"
                width={800}
                height={100}
                onClick={handleCanvasClick}
            />
        </div>
    );
};

export default WaveformVisualizer;