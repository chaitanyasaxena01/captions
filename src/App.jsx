import React, { useState } from 'react';
import VideoUpload from './components/VideoUpload';
import StyleSelection from './components/StyleSelection';
import './App.css';

function App() {
  const [captionStyle, setCaptionStyle] = useState({});
  const [videoUrl, setVideoUrl] = useState(null); // State for video preview URL
  const [captions, setCaptions] = useState([]); // State for generated captions
  const [uploadedFilePath, setUploadedFilePath] = useState(null); // State for backend file path
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState(null);
  const [generationMessage, setGenerationMessage] = useState('');

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
    console.log('Video ready for preview:', url);
    console.log('Received captions:', receivedCaptions);
    console.log('Backend file path:', backendFilePath);
  };

  // Handler for triggering final video generation
  const handleGenerateVideo = async () => {
    if (!uploadedFilePath || captions.length === 0) {
      setGenerationMessage('Error: Missing video file path or captions.');
      console.error('Cannot generate video without a backend file path or captions.');
      return;
    }

    setGenerationMessage('Generating final video...');
    setIsGenerating(true);
    setFinalVideoUrl(null);

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGenerationMessage(`Success: ${data.message}`);
        // Construct full URL for the download link (assuming backend serves from root)
        const downloadUrl = `http://localhost:5001${data.downloadPath}`;
        setFinalVideoUrl(downloadUrl);
        console.log('Final video ready (simulated):', downloadUrl);
      } else {
        setGenerationMessage(`Error: ${data.message || response.statusText}`);
        console.error('Generation error:', data);
      }
    } catch (error) {
      setGenerationMessage(`Network error: ${error.message}`);
      console.error('Generation network error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="App">
      <h1>Video Captioner</h1>
      {/* Pass the handler to VideoUpload */}
      <VideoUpload onUploadSuccess={handleUploadSuccess} />
      <StyleSelection onStyleChange={handleStyleChange} />

      {/* Video Preview Area */}
      {videoUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Video Preview</h2>
          <video controls width="400" src={videoUrl}></video>
        </div>
      )}

      {/* Caption Display Area */}
      {captions.length > 0 && (
        <div style={{ marginTop: '20px', border: '1px dashed blue', padding: '10px' }}>
          <h2>Generated Captions (Simulated)</h2>
          <ul>
            {captions.map((caption, index) => (
              <li key={index} style={captionStyle}> {/* Apply captionStyle here */}
                [{caption.start.toFixed(1)}s - {caption.end.toFixed(1)}s]: {caption.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Styles are now applied to the caption list above */}
      {/* Button to Generate Final Video */}
      {captions.length > 0 && videoUrl && (
        <button onClick={handleGenerateVideo} disabled={isGenerating} style={{ marginTop: '20px', padding: '10px 15px' }}>
          {isGenerating ? 'Generating...' : 'Generate Final Video'}
        </button>
      )}

      {/* Generation Status and Download Link */}
      {generationMessage && <p style={{ marginTop: '10px' }}>{generationMessage}</p>}
      {finalVideoUrl && (
        <div style={{ marginTop: '10px' }}>
          <a href={finalVideoUrl} download target="_blank" rel="noopener noreferrer">
            Download Final Video (Simulated)
          </a>
        </div>
      )}

      {/* Style Preview (for debugging) */}
      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>Current Style Preview (for debugging):</h3>
        <pre>{JSON.stringify(captionStyle, null, 2)}</pre>
        <p style={captionStyle}>Sample Caption Text</p>
      </div>
    </div>
  );
}

export default App;
