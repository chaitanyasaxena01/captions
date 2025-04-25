import React, { useState } from 'react';

function StyleSelection({ onStyleChange }) {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('24');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [highlightColor, setHighlightColor] = useState('#FFFF00'); // Default highlight: Yellow
  const [backgroundColor, setBackgroundColor] = useState('rgba(0, 0, 0, 0.5)');

  const handleStyleUpdate = () => {
    onStyleChange({
      fontFamily,
      fontSize: `${fontSize}px`,
      color: fontColor,
      highlightColor, // Add highlight color
      backgroundColor,
    });
  };

  // Call handleStyleUpdate initially and whenever a style changes
  React.useEffect(() => {
    handleStyleUpdate();
  }, [fontFamily, fontSize, fontColor, highlightColor, backgroundColor]); // Add highlightColor to dependencies

  return (
    <div>
      <h2>Caption Style</h2>
      <div>
        <label htmlFor="fontFamily">Font Family:</label>
        <select id="fontFamily" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>
      <div>
        <label htmlFor="fontSize">Font Size (px):</label>
        <input
          type="number"
          id="fontSize"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          min="10"
          max="72"
        />
      </div>
      <div>
        <label htmlFor="fontColor">Font Color:</label>
        <input
          type="color"
          id="fontColor"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="highlightColor">Highlight Color:</label>
        <input
          type="color"
          id="highlightColor"
          value={highlightColor}
          onChange={(e) => setHighlightColor(e.target.value)}
        />
      </div>
       <div>
        <label htmlFor="backgroundColor">Background Color:</label>
        <input
          type="color"
          id="backgroundColor"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)} // Note: Opacity might need separate handling depending on final implementation
        />
      </div>
      {/* Add more style options as needed (e.g., position, background opacity) */}
    </div>
  );
}

export default StyleSelection;