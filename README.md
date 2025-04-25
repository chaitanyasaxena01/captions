# Professional Video Captioner

A modern web application for adding professional captions to videos with advanced styling and editing capabilities.

## Features

- **Modern UI/UX**: Clean, responsive interface built with styled-components
- **Video Upload**: Easy video uploading with progress feedback
- **Automatic Caption Generation**: Uses AssemblyAI to generate accurate captions
- **Real-time Caption Preview**: See captions overlaid on your video during playback
- **Caption Editing**: Edit, delete, or adjust auto-generated captions
- **Advanced Styling Options**: Customize font, size, color, weight, shadows, and background
- **Karaoke-style Highlighting**: Words are highlighted as they're spoken
- **Final Video Generation**: Create downloadable videos with burned-in captions
- **User Notifications**: Toast notifications for important events

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- FFmpeg installed on your system
- AssemblyAI API key

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   cd captions
   npm install
   ```
3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
4. Create a `.env` file in the backend directory with your AssemblyAI API key:
   ```
   ASSEMBLYAI_API_KEY=your_api_key_here
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   node server.js
   ```
2. Start the frontend development server:
   ```
   cd captions
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload a Video**: Click "Select Video File" and choose a video from your computer
2. **Customize Caption Style**: Adjust font, size, colors, and other styling options
3. **Edit Captions**: Modify the auto-generated captions as needed
4. **Preview**: Watch your video with captions in real-time
5. **Generate Final Video**: Click "Generate Final Video" to create the final version
6. **Download**: Once processing is complete, download your captioned video

## Technologies Used

- **Frontend**: React, styled-components, react-toastify, react-icons
- **Backend**: Node.js, Express, fluent-ffmpeg, AssemblyAI API
- **Video Processing**: FFmpeg for caption burning and video manipulation
