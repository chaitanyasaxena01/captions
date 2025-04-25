import styled from 'styled-components';
import { theme } from '../../theme';

// Layout Components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.space.lg};
  background-color: ${theme.colors.background};
  border-radius: ${theme.radii.lg};
  box-shadow: ${theme.shadows.md};
`;

export const Section = styled.section`
  margin: ${theme.space.xl} 0;
  padding: ${theme.space.lg};
  background-color: white;
  border-radius: ${theme.radii.md};
  box-shadow: ${theme.shadows.sm};
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  gap: ${props => props.gap || theme.space.md};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(1, 1fr)'};
  gap: ${props => props.gap || theme.space.md};
`;

// Typography
export const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['3xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.space.md};
`;

export const Subtitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.text};
  margin-bottom: ${theme.space.sm};
`;

export const Text = styled.p`
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.md};
  color: ${props => props.color || theme.colors.text};
  margin-bottom: ${theme.space.sm};
`;

// Form Elements
export const FormGroup = styled.div`
  margin-bottom: ${theme.space.md};
`;

export const Label = styled.label`
  display: block;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.space.xs};
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.space.sm} ${theme.space.md};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  background-color: white;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  transition: ${theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${theme.space.sm} ${theme.space.md};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  background-color: white;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  transition: ${theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.space.sm} ${theme.space.lg};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  color: white;
  background-color: ${props => props.variant === 'secondary' ? theme.colors.secondary : 
                     props.variant === 'success' ? theme.colors.success : 
                     props.variant === 'error' ? theme.colors.error : theme.colors.primary};
  border: none;
  border-radius: ${theme.radii.md};
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.25);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  & > svg {
    margin-right: ${theme.space.xs};
  }
`;

// Video Components
export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: ${theme.radii.md};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
`;

export const VideoElement = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;

export const CaptionOverlay = styled.div`
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
  text-align: center;
  padding: ${theme.space.sm};
  z-index: 10;
`;

export const CaptionText = styled.div`
  display: inline-block;
  padding: ${theme.space.xs} ${theme.space.sm};
  font-family: ${props => props.fontFamily || theme.fonts.body};
  font-size: ${props => props.fontSize || theme.fontSizes.lg};
  color: ${props => props.color || 'white'};
  background-color: ${props => props.backgroundColor || 'rgba(0, 0, 0, 0.7)'};
  border-radius: ${theme.radii.sm};
  max-width: 80%;
  margin: 0 auto;
  text-align: ${props => props.style?.textAlign || 'center'};
  
  /* Animation styles based on the selected animation style */
  animation: ${props => {
    switch(props.style?.animationStyle) {
      case 'fade':
        return 'captionFade 0.5s ease-in-out';
      case 'typewriter':
        return 'typewriter 1s steps(40, end)';
      default:
        return 'none';
    }
  }};
  
  @keyframes captionFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
`;

// Progress indicator for video processing
export const ProgressContainer = styled.div`
  width: 100%;
  background-color: ${theme.colors.lightBorder};
  border-radius: ${theme.radii.full};
  margin: ${theme.space.md} 0;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  height: 8px;
  background-color: ${theme.colors.primary};
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div`
  text-align: center;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textLight};
  margin-top: ${theme.space.xs};
`;

// Caption Editor Components
export const CaptionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.space.md} 0;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
`;

export const CaptionItem = styled.li`
  padding: ${theme.space.sm} ${theme.space.md};
  border-bottom: 1px solid ${theme.colors.lightBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: ${theme.transitions.default};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${theme.colors.background};
  }
  
  &.active {
    background-color: rgba(67, 97, 238, 0.1);
  }
`;

export const CaptionTime = styled.span`
  font-family: ${theme.fonts.monospace};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.lightText};
  min-width: 120px;
`;

export const CaptionContent = styled.div`
  flex: 1;
  margin: 0 ${theme.space.md};
`;

export const CaptionActions = styled.div`
  display: flex;
  gap: ${theme.space.xs};
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${theme.radii.full};
  background-color: transparent;
  color: ${theme.colors.lightText};
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.colors.lightBorder};
    color: ${theme.colors.text};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }
`;

// Toast Notification
export const Toast = styled.div`
  padding: ${theme.space.md};
  background-color: ${props => 
    props.type === 'success' ? theme.colors.success : 
    props.type === 'error' ? theme.colors.error : 
    props.type === 'warning' ? theme.colors.warning : 
    theme.colors.info
  };
  color: white;
  border-radius: ${theme.radii.md};
  box-shadow: ${theme.shadows.md};
`;