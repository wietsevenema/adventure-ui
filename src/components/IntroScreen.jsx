import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #000;
  color: #00B600;
  padding: 40px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto Mono', monospace;
  font-size: 1.5rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const PressAnyKey = styled.div`
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  opacity: 0.7;
  animation: blink 1s step-end infinite;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
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
    <Container>
      {text[currentParagraphIndex]}
      <PressAnyKey>Press any key to continue...</PressAnyKey>
    </Container>
  );
};

export default IntroScreen;
