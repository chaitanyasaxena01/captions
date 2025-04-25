import React, { useState, useRef } from 'react';
import { FiUpload, FiFile } from 'react-icons/fi';
import { Section, Subtitle, Button, FormGroup, Label, Flex, Text } from './styled';

function VideoUpload({ onUploadSuccess }) { // Accept onUploadSuccess prop
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setMessage(''); // Clear previous messages
    if (file) {
      console.log('Selected file:', file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');

    const formData = new FormData();
    formData.append('video', selectedFile); // 'video' must match the backend field name

    try {
      const response = await fetch('http://localhost:5001/upload', { // Ensure backend URL is correct
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Upload successful: ${data.message}`);
        console.log('Server response:', data);
        if (onUploadSuccess) {
          // Create a local URL for preview
          const videoUrl = URL.createObjectURL(selectedFile);
          // Pass the video URL, captions, and the backend file path to the parent
          onUploadSuccess(videoUrl, data.captions, data.filePath);
        }
      } else {
        setMessage(`Upload failed: ${data.message || response.statusText}`);
        console.error('Upload error:', data);
      }
    } catch (error) {
      setMessage(`Upload error: ${error.message}`);
      console.error('Network or other error:', error);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Section>
      <Subtitle>Upload Video</Subtitle>
      <FormGroup>
        <input 
          type="file" 
          accept="video/*" 
          onChange={handleFileChange} 
          disabled={uploading}
          ref={fileInputRef}
          style={{ display: 'none' }} // Hide the native input
        />
        
        <Flex direction="column" gap="1rem">
          <Button 
            type="button" 
            onClick={triggerFileInput} 
            disabled={uploading}
            variant="secondary"
          >
            <FiFile /> Select Video File
          </Button>
          
          {selectedFile && (
            <Text>
              <FiFile /> {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </Text>
          )}
          
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
            variant="primary"
          >
            <FiUpload /> {uploading ? 'Uploading...' : 'Upload and Generate Captions'}
          </Button>
        </Flex>
        
        {message && <Text color={message.includes('Error') ? 'error' : 'success'}>{message}</Text>}
      </FormGroup>
    </Section>
  );

}

export default VideoUpload;