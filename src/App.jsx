import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VideoUpload from './components/VideoUpload';
import StyleSelection from './components/StyleSelection';
import CaptionEditor from './components/CaptionEditor';
import VideoQualitySettings from './components/VideoQualitySettings';
import WordLevelCaptionOverlay from './components/WordLevelCaptionOverlay';
import { Container, Title, VideoContainer, VideoElement, Button, Flex, Grid, ProgressContainer, ProgressBar, ProgressText } from './components/styled';
import './App.css';

function App() {
  const [captionStyle, setCaptionStyle] = useState({});
  const [videoQuality, setVideoQuality] = useState({});
  const [videoUrl, setVideoUrl] = useState(null); // State for video preview URL
  const [captions, setCaptions] = useState([]); // State for generated captions
  const [uploadedFilePath, setUploadedFilePath] = useState(null); // State for backend file path
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState(null);
  const [generationMessage, setGenerationMessage] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  const handleStyleChange = (newStyle) => {
    setCaptionStyle(newStyle);
    console.log('Selected Style:', newStyle); // Log style changes for now
    // TODO: Apply style to captions/video preview
  };

  // Handler for successful video upload
  const handleUploadSuccess = (url, receivedCaptions, backendFilePath) => {
    setVideoUrl(url);
    setCaptions(receivedCaptions || []); // Store received captions
    setUploadedFilePath(backendFilePath); // Store backend file path
    setFinalVideoUrl(null); // Reset final video URL on new upload
    setGenerationMessage(''); // Clear generation message
    toast.success('Video uploaded successfully!');
    console.log('Video ready for preview:', url);
    console.log('Received captions:', receivedCaptions);
    console.log('Backend file path:', backendFilePath);
  };
  
  // Handle video time update to track current position
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // Seek to a specific time in the video
  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };
  
  // Find the current caption based on video time
  const getCurrentCaption = () => {
    if (!captions.length) return null;
    return captions.find(caption => 
      currentTime >= caption.start && currentTime <= caption.end
    );
  };
  
  const currentCaption = getCurrentCaption();

  // Handler for triggering final video generation
  const handleGenerateVideo = async () => {
    if (!uploadedFilePath || captions.length === 0) {
      toast.error('Missing video file path or captions.');
      console.error('Cannot generate video without a backend file path or captions.');
      return;
    }

    toast.info('Generating final video...', { autoClose: false, toastId: 'generating' });
    setIsGenerating(true);
    setFinalVideoUrl(null);
    setGenerationProgress(0);

    console.log('Sending generation request with:', { filePath: uploadedFilePath, captions, style: captionStyle });

    try {
      const response = await fetch('http://localhost:5001/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath: uploadedFilePath,
          captions: captions,
          style: captionStyle,
          quality: videoQuality,
        }),
      });

      // Simulate progress updates while waiting for the response
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 90 ? 90 : newProgress; // Cap at 90% until complete
        });
      }, 500);

      const data = await response.json();
      clearInterval(progressInterval);

      if (response.ok) {
        setGenerationProgress(100);
        toast.dismiss('generating');
        toast.success('Video generated successfully!');
        setGenerationMessage(`Success: ${data.message}`);
        // Construct full URL for the download link (assuming backend serves from root)
        const downloadUrl = `http://localhost:5001${data.downloadPath}`;
        setFinalVideoUrl(downloadUrl);
        console.log('Final video ready:', downloadUrl);
      } else {
        toast.dismiss('generating');
        toast.error(`Error: ${data.message || response.statusText}`);
        setGenerationMessage(`Error: ${data.message || response.statusText}`);
        console.error('Generation error:', data);
      }
    } catch (error) {
      toast.dismiss('generating');
      toast.error(`Network error: ${error.message}`);
      setGenerationMessage(`Network error: ${error.message}`);
      console.error('Generation network error:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Progress tracking is handled by the state defined at the top of the component

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Title>Professional Video Captioner</Title>
      
      <Grid columns="1fr 1fr" style={{ marginBottom: '2rem' }}>
        <VideoUpload onUploadSuccess={handleUploadSuccess} />
        <StyleSelection onStyleChange={handleStyleChange} />
      </Grid>
      
      {/* Video Quality Settings */}
      {videoUrl && (
        <VideoQualitySettings onQualityChange={setVideoQuality} />
      )}

      {/* Video Preview Area with Caption Overlay */}
      {videoUrl && (
        <VideoContainer>
          <VideoElement 
            controls 
            src={videoUrl} 
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
          />
          
          {/* Word-level caption overlay */}
          {captions.length > 0 && (
            <WordLevelCaptionOverlay
              captions={captions}
              currentTime={currentTime}
              style={captionStyle}
              maxWordsPerLine={5}
            />
          )}
        </VideoContainer>
      )}

      {/* Caption Editor */}
      {captions.length > 0 && (
        <CaptionEditor 
          captions={captions} 
          setCaptions={setCaptions} 
          currentTime={currentTime}
          onSeek={handleSeek}
        />
      )}

      {/* Generate Final Video Button */}
      {captions.length > 0 && videoUrl && (
        <Flex justify="center" direction="column" align="center" style={{ margin: '2rem 0' }}>
          <Button 
            onClick={handleGenerateVideo} 
            disabled={isGenerating}
            variant="primary"
          >
            {isGenerating ? 'Generating...' : 'Generate Final Video'}
          </Button>
          
          {isGenerating && (
            <div style={{ width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
              <ProgressContainer>
                <ProgressBar progress={generationProgress} />
              </ProgressContainer>
              <ProgressText>{Math.round(generationProgress)}% Complete</ProgressText>
            </div>
          )}
        </Flex>
      )}

      {/* Download Link */}
      {finalVideoUrl && (
        <Flex justify="center" direction="column" align="center">
          <Button 
            as="a" 
            href={finalVideoUrl} 
            download 
            target="_blank" 
            rel="noopener noreferrer"
            variant="success"
          >
            Download Final Video
          </Button>
        </Flex>
      )}
    </Container>
  );
}

export default App;
