import React, { useState } from 'react';
import { FiSettings, FiSliders } from 'react-icons/fi';
import { Section, Subtitle, FormGroup, Label, Input, Select, Grid, Button, Flex } from './styled';

function AdvancedStyleOptions({ style, onStyleChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [textAlign, setTextAlign] = useState(style.textAlign || 'center');
  const [textPosition, setTextPosition] = useState(style.textPosition || 'bottom');
  const [letterSpacing, setLetterSpacing] = useState(style.letterSpacing || '0');
  const [lineHeight, setLineHeight] = useState(style.lineHeight || '1.2');
  const [textOutline, setTextOutline] = useState(style.textOutline || 'none');
  const [textTransform, setTextTransform] = useState(style.textTransform || 'none');
  const [animationStyle, setAnimationStyle] = useState(style.animationStyle || 'karaoke');
  
  const handleApplyChanges = () => {
    onStyleChange({
      ...style,
      textAlign,
      textPosition,
      letterSpacing: `${letterSpacing}px`,
      lineHeight,
      textOutline,
      textTransform,
      animationStyle
    });
  };

  return (
    <Section>
      <Flex justify="space-between" align="center">
        <Subtitle><FiSettings /> Advanced Options</Subtitle>
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
              <Label htmlFor="textAlign">Text Alignment</Label>
              <Select 
                id="textAlign" 
                value={textAlign} 
                onChange={(e) => setTextAlign(e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="textPosition">Caption Position</Label>
              <Select 
                id="textPosition" 
                value={textPosition} 
                onChange={(e) => setTextPosition(e.target.value)}
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="letterSpacing">Letter Spacing (px)</Label>
              <Input
                type="number"
                id="letterSpacing"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(e.target.value)}
                min="-3"
                max="10"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lineHeight">Line Height</Label>
              <Input
                type="number"
                id="lineHeight"
                value={lineHeight}
                onChange={(e) => setLineHeight(e.target.value)}
                min="0.8"
                max="3"
                step="0.1"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="textOutline">Text Outline</Label>
              <Select 
                id="textOutline" 
                value={textOutline} 
                onChange={(e) => setTextOutline(e.target.value)}
              >
                <option value="none">None</option>
                <option value="1px black">Thin Black</option>
                <option value="2px black">Medium Black</option>
                <option value="1px white">Thin White</option>
                <option value="2px white">Medium White</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="textTransform">Text Transform</Label>
              <Select 
                id="textTransform" 
                value={textTransform} 
                onChange={(e) => setTextTransform(e.target.value)}
              >
                <option value="none">None</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="lowercase">lowercase</option>
                <option value="capitalize">Capitalize</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="animationStyle">Animation Style</Label>
              <Select 
                id="animationStyle" 
                value={animationStyle} 
                onChange={(e) => setAnimationStyle(e.target.value)}
              >
                <option value="karaoke">Karaoke (Highlight Words)</option>
                <option value="fade">Fade In/Out</option>
                <option value="typewriter">Typewriter</option>
                <option value="none">None</option>
              </Select>
            </FormGroup>
          </Grid>
          
          <Flex justify="center" style={{ marginTop: '1rem' }}>
            <Button onClick={handleApplyChanges}>Apply Advanced Settings</Button>
          </Flex>
        </>
      )}
    </Section>
  );
}

export default AdvancedStyleOptions;