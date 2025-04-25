import React, { useState } from 'react';
import { FiType, FiSliders } from 'react-icons/fi';
import { Section, Subtitle, FormGroup, Label, Input, Select, Grid } from './styled';
import AdvancedStyleOptions from './AdvancedStyleOptions';

function StyleSelection({ onStyleChange }) {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('24');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [highlightColor, setHighlightColor] = useState('#FFFF00'); // Default highlight: Yellow
  const [backgroundColor, setBackgroundColor] = useState('rgba(0, 0, 0, 0.5)');
  const [fontWeight, setFontWeight] = useState('normal');
  const [textShadow, setTextShadow] = useState('none');
  const [captionStyle, setCaptionStyle] = useState({});

  const handleStyleUpdate = () => {
    const newStyle = {
      fontFamily,
      fontSize: `${fontSize}px`,
      color: fontColor,
      highlightColor,
      backgroundColor,
      fontWeight,
      textShadow,
      ...captionStyle
    };
    
    setCaptionStyle(newStyle);
    onStyleChange(newStyle);
  };

  // Call handleStyleUpdate initially and whenever a style changes
  React.useEffect(() => {
    handleStyleUpdate();
  }, [fontFamily, fontSize, fontColor, highlightColor, backgroundColor, fontWeight, textShadow]);

  // Handle advanced style changes from the AdvancedStyleOptions component
  const handleAdvancedStyleChange = (advancedStyle) => {
    setCaptionStyle(advancedStyle);
    onStyleChange(advancedStyle);
  };

  return (
    <>
      <Section>
        <Subtitle><FiSliders /> Caption Style</Subtitle>
        <Grid columns="1fr 1fr" gap="1rem">
        <FormGroup>
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select id="fontFamily" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Lato">Lato</option>
            <option value="Oswald">Oswald</option>
            <option value="Impact">Impact</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="fontSize">Font Size (px)</Label>
          <Input
            type="number"
            id="fontSize"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            min="10"
            max="72"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="fontWeight">Font Weight</Label>
          <Select id="fontWeight" value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="textShadow">Text Shadow</Label>
          <Select id="textShadow" value={textShadow} onChange={(e) => setTextShadow(e.target.value)}>
            <option value="none">None</option>
            <option value="1px 1px 2px black">Light</option>
            <option value="2px 2px 4px black">Medium</option>
            <option value="3px 3px 6px black">Heavy</option>
            <option value="0px 0px 8px rgba(255,255,255,0.8)">Glow</option>
            <option value="1px 1px 0px black, -1px -1px 0px black">Outline</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="fontColor">Font Color</Label>
          <Input
            type="color"
            id="fontColor"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="highlightColor">Highlight Color</Label>
          <Input
            type="color"
            id="highlightColor"
            value={highlightColor}
            onChange={(e) => setHighlightColor(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="backgroundOpacity">Background Opacity</Label>
          <Input
            type="range"
            id="backgroundOpacity"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.5"
            onChange={(e) => {
              const opacity = e.target.value;
              const rgbaColor = backgroundColor.startsWith('#') 
                ? `rgba(${parseInt(backgroundColor.slice(1, 3), 16)}, ${parseInt(backgroundColor.slice(3, 5), 16)}, ${parseInt(backgroundColor.slice(5, 7), 16)}, ${opacity})` 
                : backgroundColor;
              setBackgroundColor(rgbaColor);
            }}
          />
        </FormGroup>
      </Grid>
    </Section>
    <AdvancedStyleOptions style={captionStyle} onStyleChange={handleAdvancedStyleChange} />
    </>
  );
}

export default StyleSelection;