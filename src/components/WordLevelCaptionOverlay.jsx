import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

// Styled components for the word-level caption overlay
const OverlayContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  padding: ${theme.space.sm};
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CaptionLine = styled.div`
  display: inline-block;
  padding: ${theme.space.xs} ${theme.space.sm};
  background-color: ${props => props.backgroundColor || 'rgba(0, 0, 0, 0.7)'};
  border-radius: ${theme.radii.sm};
  max-width: 80%;
  margin: 0 auto;
  text-align: ${props => props.textAlign || 'center'};
`;

const Word = styled.span`
  font-family: ${props => props.fontFamily || theme.fonts.body};
  font-size: ${props => props.fontSize || theme.fontSizes.lg};
  color: ${props => props.isActive ? (props.highlightColor || '#FFFF00') : (props.color || 'white')};
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
  margin: 0 2px;
  transition: color 0.1s ease-in-out;
  text-transform: ${props => props.textTransform || 'none'};
  letter-spacing: ${props => props.letterSpacing || 'normal'};
  text-shadow: ${props => props.textShadow || 'none'};
  -webkit-text-stroke: ${props => props.isActive && props.textOutline !== 'none' ? props.textOutline : 'none'};
`;

const WordLevelCaptionOverlay = ({ 
  captions, 
  currentTime, 
  style,
  maxWordsPerLine = 5 
}) => {
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [visibleWords, setVisibleWords] = useState([]);

  // Find the active word based on current video time
  useEffect(() => {
    if (!captions || captions.length === 0) return;

    // Find the current active word
    const currentWordIndex = captions.findIndex(
      word => currentTime >= word.start && currentTime <= word.end
    );

    if (currentWordIndex !== activeWordIndex) {
      setActiveWordIndex(currentWordIndex);

      // Calculate which words should be visible (max 5 words centered around the active word)
      if (currentWordIndex !== -1) {
        // Calculate start index to show words centered around the active word
        let startIndex = Math.max(0, currentWordIndex - Math.floor(maxWordsPerLine / 2));
        
        // Adjust startIndex if we're near the end of the captions
        if (startIndex + maxWordsPerLine > captions.length) {
          startIndex = Math.max(0, captions.length - maxWordsPerLine);
        }
        
        // Get the visible words
        const newVisibleWords = captions.slice(startIndex, startIndex + maxWordsPerLine);
        setVisibleWords(newVisibleWords);
      } else {
        setVisibleWords([]);
      }
    }
  }, [captions, currentTime, activeWordIndex, maxWordsPerLine]);

  if (visibleWords.length === 0) return null;

  return (
    <OverlayContainer
      style={{
        bottom: style.textPosition === 'bottom' ? '10%' : 'auto',
        top: style.textPosition === 'top' ? '10%' : 
             style.textPosition === 'middle' ? '45%' : 'auto'
      }}
    >
      <CaptionLine 
        backgroundColor={style.backgroundColor}
        textAlign={style.textAlign}
      >
        {visibleWords.map((word, index) => {
          const isActive = captions.indexOf(word) === activeWordIndex;
          
          return (
            <Word
              key={`${word.start}-${index}`}
              isActive={isActive}
              fontFamily={style.fontFamily}
              fontSize={style.fontSize}
              color={style.color}
              highlightColor={style.highlightColor || '#FFFF00'}
              textTransform={style.textTransform}
              letterSpacing={style.letterSpacing}
              textShadow={style.textShadow}
              textOutline={style.textOutline}
              style={{
                fontWeight: isActive ? 'bold' : style.fontWeight,
              }}
            >
              {word.text}
            </Word>
          );
        })}
      </CaptionLine>
    </OverlayContainer>
  );
};

export default WordLevelCaptionOverlay;