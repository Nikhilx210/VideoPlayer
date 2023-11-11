import React, { useRef, useState, useEffect } from 'react';
import { UsePlay } from '../Context';

const VideoPlayer = ({ onFileChange }) => {
  const canvas = useRef();
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [videoName, setVideoName] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoSize, setVideoSize] = useState(0);
  const myvid = document.getElementById('myvid')
  const [videoPaused, setVideoPaused] = UsePlay();


  const handlePlayPause = () => {
    if (videoPaused === false) {
      myvid?.play();
      setVideoPaused(true);
    } else {
      myvid?.pause();
      setVideoPaused(false);
    }
  };
  function updateCanvas() {
    const context = canvas.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.current.width, canvas.current.height);
    window.requestAnimationFrame(updateCanvas);
  }
  useEffect(() => {
    requestAnimationFrame(updateCanvas);
  }, [updateCanvas]);

  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onFileChange(file);

    if (file) {
      checkVideoAudio(file)
        .then((hasAudio) => {
          const video = videoRef.current;

          if (hasAudio) {
            video.src = URL.createObjectURL(file);
            setVideoName(file.name);
            setVideoSize(file.size);
          } else {
            video.src = null; // Set video source to null if it doesn't have audio
            setVideoName('');
            setVideoDuration(0);
            setVideoSize(0);
            window.location.reload();

            alert('No audio Found');
            // Additional logic, if needed
          }
        })
        .catch((error) => {
          console.error('Error checking video audio:', error);

          // Handle the case where decoding audio data fails (muted file)
          alert('Error decoding audio data. Please choose a different video.');
          const video = videoRef.current;
          video.src = null; // Set video source to null if decoding fails
          setVideoName('');
          setVideoDuration(0);
          setVideoSize(0);
          window.location.reload();
        });
    }
  };

  const checkVideoAudio = (file) => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const reader = new FileReader();

      reader.onload = (event) => {
        const buffer = event.target.result;

        audioContext.decodeAudioData(
          buffer,
          () => resolve(true), // Resolve as true if audio decoding is successful
          (decodeError) => {
            console.error('Error decoding audio data:', decodeError);

            // Check if the error is related to the absence of audio data
            if (decodeError.message.includes('audio buffer is empty')) {
              resolve(false); // Resolve as false if decoding fails due to no audio data
            } else {
              reject(decodeError); // Reject for other decoding errors
            }
          }
        );
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  };


  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>

      <div className='d1'>
        <div className='d2'>
          <button className='b1' onClick={handleFileButtonClick}>Upload Video</button>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <div className='mdata'>
            <p> File Name: {videoName}</p>
            <p> File Duration: {videoDuration.toFixed(2)} seconds</p>
            <p> File Size: {videoSize}</p>
          </div>
        </div>
        <div >
          <video id='myvid' ref={videoRef} width={0} height={0} controls />
          <canvas ref={canvas} onClick={() => handlePlayPause()}></canvas>
        </div>
      </div>


    </div>
  );
};


export default VideoPlayer;
