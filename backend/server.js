const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const { AssemblyAI } = require('assemblyai');
require('dotenv').config(); // Load environment variables from .env file

// Initialize AssemblyAI Client
// Ensure ASSEMBLYAI_API_KEY environment variable is set in .env file
// See: https://www.assemblyai.com/docs/getting-started/authentication
const assemblyaiClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY, // Use the environment variable
});

const app = express();
const port = process.env.PORT || 5001; // Use a different port than the frontend

// Middleware
app.use(cors()); // Allow requests from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for file uploads (basic setup, configure as needed)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ensure uploads directory exists
const fs = require('fs'); // Keep this one
const path = require('path'); // Keep this one
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Routes
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Endpoint for video upload and caption generation
app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  console.log('File uploaded:', req.file);

  const videoPath = req.file.path;
  const audioPath = path.join(path.dirname(videoPath), `${path.basename(videoPath, path.extname(videoPath))}.wav`);

  try {
    // 1. Extract audio from video using fluent-ffmpeg
    console.log(`Extracting audio from ${videoPath} to ${audioPath}...`);
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .toFormat('wav')
        .audioCodec('pcm_s16le') // Ensure compatible codec
        .audioFrequency(16000) // Common frequency for speech recognition
        .audioChannels(1) // Mono channel
        .on('error', (err) => {
          console.error('Error extracting audio:', err);
          reject(new Error(`Audio extraction failed: ${err.message}`));
        })
        .on('end', () => {
          console.log('Audio extraction complete.');
          resolve();
        })
        .save(audioPath);
    });

    // 2. Perform speech-to-text using AssemblyAI API
    console.log(`Performing speech-to-text on ${audioPath} using AssemblyAI...`);

    if (!process.env.ASSEMBLYAI_API_KEY) {
      console.error('ASSEMBLYAI_API_KEY environment variable not set. Please check your .env file.');
      throw new Error('ASSEMBLYAI_API_KEY environment variable not set.');
    }

    const params = {
      audio: audioPath, // Pass the file path directly
      speaker_labels: false, // Disable speaker labels for simplicity, enable if needed
      // language_code: 'en_us', // Optional: Specify language, defaults usually work well
    };

    const transcript = await assemblyaiClient.transcripts.transcribe(params);

    if (transcript.status === 'error') {
      console.error('AssemblyAI Transcription Error:', transcript.error);
      throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
    }

    console.log('AssemblyAI transcription complete.');

    // 3. Format captions from the AssemblyAI response
    // AssemblyAI provides word timings directly in the 'words' array
    const captions = [];
    if (transcript.words && transcript.words.length > 0) {
      // Create individual captions for each word for dynamic display
      transcript.words.forEach(word => {
        captions.push({
          start: word.start / 1000, // Convert ms to seconds
          end: word.end / 1000,     // Convert ms to seconds
          text: word.text
        });
      });
    } else {
      console.warn('No words found in AssemblyAI transcript.');
    }

    console.log('Generated captions:', captions);

    // Clean up the temporary audio file
    fs.unlink(audioPath, (err) => {
      if (err) console.error('Error deleting temporary audio file:', err);
      else console.log('Temporary audio file deleted:', audioPath);
    });

    res.json({
      message: 'File uploaded and captions generated successfully.',
      filePath: videoPath, // Send back the original video path
      captions: captions
    });

  } catch (error) {
    console.error('Error processing video:', error);
    // Clean up audio file on error too
    if (fs.existsSync(audioPath)) {
      fs.unlink(audioPath, (err) => {
        if (err) console.error('Error deleting temporary audio file after error:', err);
      });
    }
    res.status(500).json({ message: `Error processing video: ${error.message}` });
  }
});

// Helper function to convert seconds to HH:MM:SS.ms format for ASS
function formatTimeASS(seconds) {
  const date = new Date(0);
  date.setSeconds(seconds);
  const timeString = date.toISOString().substr(11, 12);
  // ASS uses HH:MM:SS.ss (hundredths of a second)
  return timeString.slice(0, 9) + timeString.slice(10, 12);
}

// Helper function to convert hex color (#RRGGBB) to ASS BGR format (&HBBGGRR&)
function hexToAssBgr(hexColor) {
  if (!hexColor || hexColor.length !== 7 || hexColor[0] !== '#') {
    return 'FFFFFF'; // Default to white if invalid
  }
  const r = hexColor.substring(1, 3);
  const g = hexColor.substring(3, 5);
  const b = hexColor.substring(5, 7);
  return `${b}${g}${r}`.toUpperCase();
}

// Helper function to generate ASS subtitle content with Karaoke effect
function generateAssSubtitles(captions, style) {
  const primaryColorHex = style.color || '#FFFFFF';
  const highlightColorHex = style.highlightColor || '#FFFF00'; // Default highlight: Yellow
  const fontSize = parseInt(style.fontSize) || 20;
  const fontFamily = style.fontFamily || 'Arial'; // Use selected font family

  const primaryAssColor = `&H00${hexToAssBgr(primaryColorHex)}`;
  const highlightAssColor = `&H00${hexToAssBgr(highlightColorHex)}`; // ASS format: &HBBGGRR&
  // Use a semi-transparent background based on style.backgroundColor if available, otherwise default
  // ASS BackColour format: &HAABBGGRR& (AA is alpha, 00=opaque, 80=50% transparent, FF=fully transparent)
  // We need to parse the RGBA color from the style
  let backAssColor = '&H80000000'; // Default: 50% transparent black
  if (style.backgroundColor && style.backgroundColor.startsWith('rgba')) {
    try {
      const parts = style.backgroundColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (parts) {
        const r = parseInt(parts[1]).toString(16).padStart(2, '0');
        const g = parseInt(parts[2]).toString(16).padStart(2, '0');
        const b = parseInt(parts[3]).toString(16).padStart(2, '0');
        const alpha = Math.round((1 - parseFloat(parts[4])) * 255).toString(16).padStart(2, '0'); // Convert CSS alpha (0-1) to ASS alpha (00-FF)
        backAssColor = `&H${alpha}${b}${g}${r}`.toUpperCase();
      }
    } catch (e) {
      console.warn('Could not parse background color for ASS:', style.backgroundColor, e);
    }
  } else if (style.backgroundColor && style.backgroundColor.startsWith('#')) {
      // Handle hex background color (assuming full opacity)
      backAssColor = `&H00${hexToAssBgr(style.backgroundColor)}`;
  }


  // Basic ASS header
  let assContent = `[Script Info]
Title: Generated Captions
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 384
PlayResY: 288
ScaledBorderAndShadow: yes
YCbCr Matrix: None

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${fontFamily},${fontSize},${primaryAssColor},${highlightAssColor},&H00000000,${backAssColor},${style.fontWeight === 'bold' ? -1 : 0},0,0,0,100,100,0,0,1,1,1,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  // Group words into lines/segments if needed (simple approach: one line per original caption segment)
  // For true karaoke, we process word by word.
  // Assuming 'captions' now contains word-level timing from AssemblyAI

  if (!captions || captions.length === 0) {
    return assContent; // Return header if no captions
  }

  // Determine the overall start and end time for the dialogue line
  const dialogueStart = formatTimeASS(captions[0].start);
  // Use the end time of the *last* word for the dialogue line end time
  const dialogueEnd = formatTimeASS(captions[captions.length - 1].end);

  let dialogueText = '';
  // Set the initial color for the line to the primary color
  dialogueText += `{\c${primaryAssColor}}`; // \c is equivalent to \1c

  captions.forEach((word, index) => {
    // Calculate word duration in centiseconds for \k tag
    const duration = Math.round((word.end - word.start) * 100);

    // \k<duration> changes the *primary* color to the *secondary* color for 'duration' centiseconds
    // So, we set PrimaryColour to the normal text color and SecondaryColour to the highlight color in the Style definition.
    // The text starts as PrimaryColour. \k<dur> highlights it using SecondaryColour.
    dialogueText += `{\k${duration}}${word.text}`;

    if (index < captions.length - 1) {
      dialogueText += ' '; // Add space between words
    }
  });

  // Add the dialogue line with karaoke tags
  assContent += `Dialogue: 0,${dialogueStart},${dialogueEnd},Default,,0,0,0,,${dialogueText}\n`;

  return assContent;
}

// Endpoint to receive style preferences and trigger final video generation
app.post('/generate-video', async (req, res) => {
  const { filePath, captions, style } = req.body;

  if (!filePath || !captions || !style) {
    return res.status(400).json({ message: 'Missing required data: filePath, captions, or style.' });
  }

  if (!fs.existsSync(filePath)) {
    console.error('Input video file not found:', filePath);
    return res.status(404).json({ message: `Input video file not found: ${filePath}` });
  }

  console.log('Received request to generate final video:');
  console.log(' - File Path:', filePath);
  // console.log(' - Captions:', captions); // Can be long, log if needed
  console.log(' - Style:', style);

  const finalVideoFileName = `final-${Date.now()}-${path.basename(filePath)}`;
  const finalVideosDir = path.join(__dirname, 'final_videos');
  const finalVideoPath = path.join(finalVideosDir, finalVideoFileName);
  const tempAssPath = path.join(uploadsDir, `temp-${Date.now()}.ass`); // Temporary ASS file in uploads

  // Ensure final_videos directory exists
  if (!fs.existsSync(finalVideosDir)) {
    fs.mkdirSync(finalVideosDir);
  }

  try {
    // 1. Generate ASS subtitle content
    const assContent = generateAssSubtitles(captions, style);
    fs.writeFileSync(tempAssPath, assContent);
    console.log('Temporary ASS subtitle file created:', tempAssPath);

    // 2. Use FFmpeg to burn subtitles onto the video
    console.log(`Burning captions into video: ${finalVideoPath}`);
    await new Promise((resolve, reject) => {
      ffmpeg(filePath)
        // Use the subtitles filter with the generated ASS file
        // Ensure FFmpeg build has libass enabled
        // Correctly format the path for the subtitles filter using filename= syntax
        .videoFilters(`subtitles=filename='${tempAssPath}'`)
        .on('error', (err) => {
          console.error('Error during FFmpeg processing:', err);
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .on('end', () => {
          console.log('FFmpeg processing finished.');
          resolve();
        })
        .save(finalVideoPath);
    });

    console.log(`Final video with burned captions created at: ${finalVideoPath}`);

    // Clean up temporary ASS file
    fs.unlink(tempAssPath, (err) => {
      if (err) console.error('Error deleting temporary ASS file:', err);
      else console.log('Temporary ASS file deleted:', tempAssPath);
    });

    // Provide the download path for the final video
    res.json({
      message: 'Final video generated successfully with burned captions.',
      downloadPath: `/final_videos/${finalVideoFileName}` // Relative path for download
    });

  } catch (error) {
    console.error('Error generating final video:', error);
    // Clean up temp ASS file on error too
    if (fs.existsSync(tempAssPath)) {
      fs.unlink(tempAssPath, (err) => {
        if (err) console.error('Error deleting temporary ASS file after error:', err);
      });
    }
    res.status(500).json({ message: `Error generating final video: ${error.message}` });
  }
});

// TODO: Add endpoint for actual caption generation (currently simulated in /upload)

// Serve static files from the 'final_videos' directory (for simulated download)
app.use('/final_videos', express.static(path.join(__dirname, 'final_videos')));

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});