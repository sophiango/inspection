import {useEffect, useRef, useState} from 'react';
import './App.css';
import {videoAPI} from './client.tsx';
import VideoPlayer from './VideoPlayer';
import WaveformVisualizer from './WaveformVisualizer';
import QCControls from './QCControls';

interface VideoProps {
    id: string;
    title: string;
    url: string;
}

function App() {
    const [videoList, setVideoList] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [videoUrl, setVideoUrl] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1);
    const [audioData, setAudioData] = useState<number[]>([]);
    const [issues, setIssues] = useState<string[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch videos
                const fetchedVideos = await videoAPI.getAllVideos();
                console.log("fetchedVideos", fetchedVideos);
                setVideoList(fetchedVideos);
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // The empty dependency array ensures this effect runs only once on mount

    const handleVideoSelect = async (video: VideoProps) => {
        try {
            setVideoUrl(video.url);

            // Reset state when loading a new video
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            setIssues([]);
            setAudioData([]); // Clear previous audio data

            // Make sure the video element reloads with the new source
            if (videoRef.current) {
                videoRef.current.load();
            }

            await extractAudioData(video.url)
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error getting video URL:', error);
            setError('Failed to load the selected video. Please try again.');
        }
    };


    const extractAudioData = async (videoUrl: string) => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const response = await fetch(videoUrl);
            const arrayBuffer = await response.arrayBuffer();

            // Try to decode the audio data
            audioContext.decodeAudioData(
                arrayBuffer,
                (audioBuffer) => {
                    // Successfully decoded audio
                    const channelData = audioBuffer.getChannelData(0); // Get first channel

                    // Downsample for visualization (we don't need all samples)
                    const samples = 1000;
                    const blockSize = Math.floor(channelData.length / samples);
                    const downsampled = [];

                    for (let i = 0; i < samples; i++) {
                        const blockStart = i * blockSize;
                        let sum = 0;

                        // Find the max amplitude in this block
                        for (let j = 0; j < blockSize && (blockStart + j) < channelData.length; j++) {
                            sum = Math.max(sum, Math.abs(channelData[blockStart + j]));
                        }

                        downsampled.push(sum);
                    }

                    setAudioData(downsampled);
                },
                (err) => {
                    console.error("Error decoding audio data:", err);
                    // If there's an error (like no audio track), set empty data
                    setAudioData([]);
                }
            );
        } catch (error) {
            console.error("Error extracting audio data:", error);
            setAudioData([]);
        }
    };

    // Mock function to generate waveform data
    // const generateMockAudioData = () => {
    //     const sampleCount = 1000;
    //     const mockData = Array.from({length: sampleCount}, () => Math.random() * 0.8);
    //     setAudioData(mockData);
    // };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleSeek = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    };

    const addIssue = (issue: string) => {
        setIssues([...issues, `${formatTime(currentTime)} - ${issue}`]);
    };

    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // const triggerFileInput = () => {
    //     fileInputRef.current?.click();
    // };

    if (loading) {
        return <p>Loading ... </p>;
    }

    if (error) {
        return <p>Error fetching videos:</p>;
    }

    return (
      <div className="flex h-screen">
        <aside
            className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
            {/* <a href="#">
          <img className="w-auto h-6 sm:h-7" src="https://merakiui.com/images/logo.svg" alt="">
      </a> */}

            <div className="flex flex-col justify-between flex-1 mt-6">
              <nav>
                <h2 className="flex items-center px-4 py-2 text-base font-semibold text-gray-800 dark:text-white">Task list</h2>
                  {
                      videoList.map((video) => (
                          <a onClick={() => handleVideoSelect(video)}
                              className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">

                              <p className="mx-4 font-medium">{video.title}</p>
                          </a>
                      ))
                  }
              </nav>

              <a href="#" className="flex items-center px-4 -mx-2">
                  <img className="object-cover mx-2 rounded-full h-9 w-9"
                        src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                        alt="avatar"/>
                  <span className="mx-2 font-medium text-gray-800 dark:text-gray-200">John Doe</span>
              </a>
            </div>
        </aside>
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <main className="p-6 main-content">
          <div className="video-section">
            <VideoPlayer
                videoRef={videoRef}
                videoUrl={videoUrl}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                onPlay={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onSeek={handleSeek}
                onVolumeChange={handleVolumeChange}
                onLoadedMetadata={handleLoadedMetadata}
            />
        </div>

        <div className="waveform-section">
            <WaveformVisualizer
                audioData={audioData}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
            />
        </div>

        <div className="qc-section">
            <QCControls
                currentTime={currentTime}
                onAddIssue={addIssue}
                issues={issues}
            />
        </div>
          </main>
        </div>
      </div>
    )
}

export default App;
