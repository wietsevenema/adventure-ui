import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTerminal } from '../hooks/useTerminal.jsx';
import ScreenContainer from './ScreenContainer';

const flicker = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
`;

const ScanlineEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 1px,
    rgba(0, 0, 0, 0.4) 2px
  );
  pointer-events: none;
  animation: ${flicker} 0.15s infinite;
`;

const OutputArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const OutputLine = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
  color: ${(props) => (props.$isCommand ? '#00FF00' : 'inherit')};
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
`;

const Prompt = styled.span`
  margin-right: 10px;
  font-weight: bold;
  color: #00FF00;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  color: #00FF00;
  font-family: inherit;
  font-size: 1em;
  flex-grow: 1;
  outline: none;
`;

const GameScreen = ({ initialOutput, initialRoom, onLevelComplete, sessionId }) => {
  const {
    history,
    input,
    isProcessing,
    handleInputChange,
    handleKeyDown,
    isLevelComplete,
  } = useTerminal(initialOutput, initialRoom, sessionId);

  const outputAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (outputAreaRef.current) {
      outputAreaRef.current.scrollTop = outputAreaRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (isLevelComplete) {
      const handleAnyKey = () => {
        if (onLevelComplete) onLevelComplete();
      };
      
      // Small delay to prevent accidental skipping
      const timer = setTimeout(() => {
        window.addEventListener('keydown', handleAnyKey);
        window.addEventListener('click', handleAnyKey);
      }, 500);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleAnyKey);
        window.removeEventListener('click', handleAnyKey);
      };
    }
  }, [isLevelComplete, onLevelComplete]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <ScreenContainer onClick={handleContainerClick}>
      <ScanlineEffect />
      <OutputArea ref={outputAreaRef}>
        {history.map((line, index) => (
          <OutputLine key={index} $isCommand={line.type === 'command'}>{line.type === 'command' ? `> ${line.text}` : line.text}</OutputLine>
        ))}
        {!isLevelComplete ? (
          <InputLine>
            {!isProcessing && <Prompt>&gt;</Prompt>}
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </InputLine>
        ) : (
          <div style={{ marginTop: '1rem', color: '#00FF00', textAlign: 'center' }}>
            Press any key to continue...
          </div>
        )}
      </OutputArea>
    </ScreenContainer>
  );
};

export default GameScreen;
