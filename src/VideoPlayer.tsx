// src/components/VideoPlayer.tsx
import {RefObject} from 'react';

interface VideoPlayerProps {
    videoRef: RefObject<HTMLVideoElement | null>;
    videoUrl: string;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    onPlay: () => void;
    onTimeUpdate: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onLoadedMetadata: () => void;
}

const VideoPlayer = ({
                         videoRef,
                         videoUrl,
                         isPlaying,
                         currentTime,
                         duration,
                         volume,
                         onPlay,
                         onTimeUpdate,
                         onSeek,
                         onVolumeChange,
                         onLoadedMetadata
                     }: VideoPlayerProps) => {
    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        onSeek(newTime);
    };

    const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        onVolumeChange(newVolume);
    };

    return (
        <div className="video-player">
            {videoUrl ? (
                <>
                    <div className="video-container">
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            onTimeUpdate={onTimeUpdate}
                            onLoadedMetadata={onLoadedMetadata}
                            className="video-element"
                        />
                    </div>

                    <div className="video-controls">
                        <button className="control-btn" onClick={onPlay}>
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>

                        <div className="time-display">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>

                        <div className="seek-control">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                step="0.1"
                                onChange={handleSliderChange}
                                className="seek-slider"
                            />
                        </div>

                        <div className="volume-control">
                            <span className="volume-icon">{volume > 0 ? '🔊' : '🔇'}</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={handleVolumeSliderChange}
                                className="volume-slider"
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="no-video">
                    <p>No video loaded. Please upload a video file.</p>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;