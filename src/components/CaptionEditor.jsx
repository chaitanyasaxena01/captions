import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import {
  Section,
  Subtitle,
  CaptionList,
  CaptionItem,
  CaptionTime,
  CaptionContent,
  CaptionActions,
  IconButton,
  Input,
  Button,
  Flex
} from './styled';

const CaptionEditor = ({ captions, setCaptions, currentTime, onSeek }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  // Start editing a caption
  const handleEdit = (index, text) => {
    setEditingIndex(index);
    setEditText(text);
  };

  // Save edited caption
  const handleSave = (index) => {
    if (editText.trim() === '') return;
    
    const updatedCaptions = [...captions];
    updatedCaptions[index] = {
      ...updatedCaptions[index],
      text: editText.trim()
    };
    
    setCaptions(updatedCaptions);
    setEditingIndex(null);
    setEditText('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingIndex(null);
    setEditText('');
  };

  // Delete a caption
  const handleDelete = (index) => {
    const updatedCaptions = captions.filter((_, i) => i !== index);
    setCaptions(updatedCaptions);
  };

  // Seek to caption time in video
  const handleSeek = (time) => {
    if (onSeek) onSeek(time);
  };

  // Check if a caption is currently active based on video currentTime
  const isActive = (start, end) => {
    return currentTime >= start && currentTime <= end;
  };

  return (
    <Section>
      <Subtitle>Edit Captions</Subtitle>
      
      {captions.length === 0 ? (
        <p>No captions available. Upload a video to generate captions.</p>
      ) : (
        <>
          <CaptionList>
            {captions.map((caption, index) => (
              <CaptionItem 
                key={index}
                className={isActive(caption.start, caption.end) ? 'active' : ''}
              >
                <CaptionTime onClick={() => handleSeek(caption.start)}>
                  [{caption.start.toFixed(1)}s - {caption.end.toFixed(1)}s]
                </CaptionTime>
                
                {editingIndex === index ? (
                  <CaptionContent>
                    <Input 
                      type="text" 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                  </CaptionContent>
                ) : (
                  <CaptionContent onClick={() => handleSeek(caption.start)}>
                    {caption.text}
                  </CaptionContent>
                )}
                
                <CaptionActions>
                  {editingIndex === index ? (
                    <>
                      <IconButton onClick={() => handleSave(index)} title="Save">
                        <FiSave />
                      </IconButton>
                      <IconButton onClick={handleCancel} title="Cancel">
                        <FiX />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(index, caption.text)} title="Edit">
                        <FiEdit2 />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(index)} title="Delete">
                        <FiTrash2 />
                      </IconButton>
                    </>
                  )}
                </CaptionActions>
              </CaptionItem>
            ))}
          </CaptionList>
          
          <Flex justify="center" style={{ marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setCaptions([])}>Clear All</Button>
          </Flex>
        </>
      )}
    </Section>
  );
};

export default CaptionEditor;