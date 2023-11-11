import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { UsePlay } from '../Context';
const WaveformDisplay = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const [videoPaused, setVideoPaused] = UsePlay();
  var wavesurfer=null;
  useEffect(() => {
    // Initialize Wavesurfer
    wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'white',
      progressColor: 'blue',
      cursorColor: 'white',
      barWidth:2,
      responsive: true,
    });

    // Load the audio file
    wavesurfer.load(audioUrl);
    wavesurfer.on('interaction', () => {
      wavesurfer.play();
      
    })
    // Clean up on component unmount
    return () => wavesurfer.destroy();
    

  }, [audioUrl]);
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on('play', () => {
        setVideoPaused(false);
      });
      
      wavesurfer.on('pause', () => {
        setVideoPaused(true);
      });
    }
 }, [wavesurfer]);
  return <div ref={waveformRef} style={{ height: '140px' ,padding:'1%'}} />;
};

export default WaveformDisplay;
