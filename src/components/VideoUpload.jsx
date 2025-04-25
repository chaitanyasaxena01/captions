import React, { useState } from 'react';

function VideoUpload({ onUploadSuccess }) { // Accept onUploadSuccess prop
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

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

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} disabled={uploading} />
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VideoUpload;