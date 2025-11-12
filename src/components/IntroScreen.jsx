import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ScreenContainer from './ScreenContainer';

const StyledContainer = styled(ScreenContainer)`
  padding: 40px;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const PressAnyKey = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  font-size: 1rem;
`;

const IntroScreen = ({ text, onComplete }) => {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  useEffect(() => {
    const handleKeyPress = () => {
      if (currentParagraphIndex < text.length - 1) {
        setCurrentParagraphIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    // Also allow clicks to advance
    window.addEventListener('click', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleKeyPress);
    };
  }, [currentParagraphIndex, text, onComplete]);

  if (!text || text.length === 0) {
    onComplete();
    return null;
  }

  return (
    <StyledContainer>
      {text[currentParagraphIndex]}
      <PressAnyKey>Press any key to continue...</PressAnyKey>
    </StyledContainer>
  );
};

export default IntroScreen;
