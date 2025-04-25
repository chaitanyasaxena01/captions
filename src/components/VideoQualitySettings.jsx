import React, { useState } from 'react';
import { FiVideo, FiSettings } from 'react-icons/fi';
import { Section, Subtitle, FormGroup, Label, Select, Grid, Button, Flex } from './styled';

function VideoQualitySettings({ onQualityChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [resolution, setResolution] = useState('720p');
  const [frameRate, setFrameRate] = useState('30');
  const [videoBitrate, setVideoBitrate] = useState('2000');
  const [audioBitrate, setAudioBitrate] = useState('128');
  const [preset, setPreset] = useState('medium');
  
  const handleApplyChanges = () => {
    onQualityChange({
      resolution,
      frameRate,
      videoBitrate,
      audioBitrate,
      preset
    });
  };

  return (
    <Section>
      <Flex justify="space-between" align="center">
        <Subtitle><FiVideo /> Video Quality Settings</Subtitle>
        <Button 
          variant="secondary" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {isOpen ? 'Hide' : 'Show'}
        </Button>
      </Flex>
      
      {isOpen && (
        <>
          <Grid columns="1fr 1fr" gap="1rem" style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label htmlFor="resolution">Resolution</Label>
              <Select 
                id="resolution" 
                value={resolution} 
                onChange={(e) => setResolution(e.target.value)}
              >
                <option value="480p">480p (SD)</option>
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="original">Original Resolution</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="frameRate">Frame Rate (fps)</Label>
              <Select 
                id="frameRate" 
                value={frameRate} 
                onChange={(e) => setFrameRate(e.target.value)}
              >
                <option value="24">24 fps (Film)</option>
                <option value="30">30 fps (Standard)</option>
                <option value="60">60 fps (Smooth)</option>
                <option value="original">Original Frame Rate</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="videoBitrate">Video Bitrate (kbps)</Label>
              <Select
                id="videoBitrate"
                value={videoBitrate}
                onChange={(e) => setVideoBitrate(e.target.value)}
              >
                <option value="1000">1000 (Low)</option>
                <option value="2000">2000 (Medium)</option>
                <option value="4000">4000 (High)</option>
                <option value="8000">8000 (Very High)</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="audioBitrate">Audio Bitrate (kbps)</Label>
              <Select
                id="audioBitrate"
                value={audioBitrate}
                onChange={(e) => setAudioBitrate(e.target.value)}
              >
                <option value="96">96 (Low)</option>
                <option value="128">128 (Medium)</option>
                <option value="192">192 (High)</option>
                <option value="256">256 (Very High)</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="preset">Encoding Preset</Label>
              <Select 
                id="preset" 
                value={preset} 
                onChange={(e) => setPreset(e.target.value)}
              >
                <option value="ultrafast">Ultrafast (Lowest Quality)</option>
                <option value="fast">Fast</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="slow">Slow (Better Quality)</option>
                <option value="veryslow">Very Slow (Best Quality)</option>
              </Select>
            </FormGroup>
          </Grid>
          
          <Flex justify="center" style={{ marginTop: '1rem' }}>
            <Button onClick={handleApplyChanges}>Apply Quality Settings</Button>
          </Flex>
        </>
      )}
    </Section>
  );
}

export default VideoQualitySettings;