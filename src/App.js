import './App.css';
import React from 'react'
import WaveformDisplay from './components/audioPlayer.js';
// import VideoPlayer from './components/videoPlayer.js';
// import VideoPlayer from './components/extra.js';
import VideoPlayer from './components/vcplay.js';
// import VideoCanvas from './components/canvas.js';
import { useState } from 'react';

function App() {
  const [audioUrl, setAudioUrl] = useState(null);
  // const [videoSrc , setVideoSrc] = useState(null);

  const handleFileChange = (file) => {
    setAudioUrl(file)
    // setVideoSrc(file)

    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setAudioUrl(audioUrl);
    }
  };
  return (
    <div className='main-box'>
      <h1>Video Player</h1>
      <VideoPlayer onFileChange={handleFileChange} />
      <div className='wave'>
      <WaveformDisplay audioUrl={audioUrl} />
      </div>
    </div>
  );
}

export default App;

