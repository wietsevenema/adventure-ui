import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTerminal } from '../hooks/useTerminal.jsx';

const TerminalContainer = styled.div`
  background-color: #000;
  color: #00B600;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
`;

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

const Terminal = ({ initialOutput }) => {
  const {
    history,
    input,
    isProcessing,
    handleInputChange,
    handleKeyDown,
  } = useTerminal(initialOutput);

  const outputAreaRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (outputAreaRef.current) {
      outputAreaRef.current.scrollTop = outputAreaRef.current.scrollHeight;
    }
  }, [history]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <TerminalContainer onClick={handleContainerClick}>
      <ScanlineEffect />
      <OutputArea ref={outputAreaRef}>
        {history.map((line, index) => (
          <OutputLine key={index} $isCommand={line.type === 'command'}>{line.type === 'command' ? `> ${line.text}` : line.text}</OutputLine>
        ))}
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
      </OutputArea>
    </TerminalContainer>
  );
};

export default Terminal;
