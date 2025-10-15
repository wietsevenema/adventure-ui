import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import CommandRegistry from '../commands/CommandRegistry';

const commandRegistry = new CommandRegistry();

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

const Terminal = () => {
  const [history, setHistory] = useState(() => {
    const initialHistory = ["Welcome to the Temple of the Forgotten Prompt!"];
    return initialHistory.map(text => ({ text, type: 'response' }));
  });
  const [input, setInput] = useState('');
  const [room, setRoom] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const outputAreaRef = useRef(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (outputAreaRef.current) {
      outputAreaRef.current.scrollTop = outputAreaRef.current.scrollHeight;
    }
  }, [history]);

  const initGame = async () => {
    const lookResponse = await import('../api/ApiService').then(api => api.look());
    setRoom(lookResponse.data);
    const inventoryResponse = await import('../api/ApiService').then(api => api.inventory());
    setInventory(inventoryResponse.data.inventory);
  };

  useEffect(() => {
    if (localStorage.getItem('apiKey')) {
      initGame();
    }
  }, []);

  const addHistory = (text, type = 'response') => {
    setHistory(prev => [...prev, { text, type }]);
  }

  const processCommand = async (command) => {
    const [cmd, ...args] = command.toLowerCase().split(' ');
    const argString = args.join(' ');

    const commandInstance = commandRegistry.get(cmd);

    if (commandInstance) {
      try {
        const response = await commandInstance.execute(argString);
        commandInstance.updateHistory(response, addHistory);

        if (commandInstance.needsRefresh) {
          const lookResponse = await import('../api/ApiService').then(api => api.look());
          setRoom(lookResponse.data);
          const inventoryResponse = await import('../api/ApiService').then(api => api.inventory());
          setInventory(inventoryResponse.data.inventory);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
          addHistory(error.response.data.detail);
        } else {
          addHistory('An error occurred.');
        }
      }
    } else {
      addHistory(`Unknown command: ${command}`);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setCurrentSuggestions([]); // Reset suggestions on new input
    setSuggestionIndex(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addHistory(input, 'command');
      processCommand(input);
      setInput('');
      setCurrentSuggestions([]);
      setSuggestionIndex(0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  const handleTabCompletion = () => {
    console.log('handleTabCompletion');
    const parts = input.toLowerCase().split(' ');
    const currentWord = parts[parts.length - 1];
    console.log('parts', parts);
    console.log('currentWord', currentWord);

    let suggestions = currentSuggestions;
    if (suggestions.length === 0) {
      if (parts.length === 1) {
        const commands = commandRegistry.getAll();
        suggestions = commands.map(c => c.name).filter(name => name.startsWith(currentWord));
      } else {
        const cmd = parts[0];
        const command = commandRegistry.get(cmd);
        if (command) {
          const argString = parts.slice(1).join(' ');
          console.log('argString', argString);
          suggestions = command.getSuggestions(argString, room, inventory);
        }
      }
    }
    console.log('suggestions', suggestions);

    if (suggestions.length > 0) {
      const nextSuggestion = suggestions[suggestionIndex % suggestions.length];
      const newParts = [...parts.slice(0, parts.length - 1), nextSuggestion];
      setInput(newParts.join(' '));
      setCurrentSuggestions(suggestions);
      setSuggestionIndex(suggestionIndex + 1);
    }
  };



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
          <Prompt>&gt;</Prompt>
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
