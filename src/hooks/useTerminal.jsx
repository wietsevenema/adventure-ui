import { useState } from 'react';
import CommandRegistry from '../commands/CommandRegistry';
import * as api from '../api/ApiService';
import { formatRoomOutput } from '../utils/formatting';

const commandRegistry = new CommandRegistry();

export const useTerminal = (initialOutput = null, initialRoom = null) => {
  const [history, setHistory] = useState(() => {
    const initialHistory = initialOutput ? [initialOutput] : ["Welcome to the Temple of the Forgotten Prompt!"];
    if (initialRoom) {
        const lines = formatRoomOutput(initialRoom.name, initialRoom.description);
        initialHistory.push(...lines);
    }
    return initialHistory.map(text => ({ text, type: 'response' }));
  });
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [room, setRoom] = useState(initialRoom);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);
  const [stagedInput, setStagedInput] = useState('');

  const addHistory = (text, type = 'response') => {
    setHistory(prev => [...prev, { text, type }]);
  };

  const processCommand = async (command) => {
    const [cmd, ...args] = command.toLowerCase().split(' ');
    const argString = args.join(' ');
    const commandInstance = commandRegistry.get(cmd);

    if (commandInstance) {
      setIsProcessing(true);
      try {
        const response = await commandInstance.execute(argString);
        commandInstance.updateHistory(response, addHistory);

        if (commandInstance.needsRefresh) {
          const lookResponse = await api.look();
          setRoom(lookResponse.data);
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
          addHistory(error.response.data.detail);
        } else {
          addHistory('An error occurred.');
        }
      } finally {
        setIsProcessing(false);
      }
    }
    else {
      addHistory(`Unknown command: ${command}`);
    }
  };

  const handleInputChange = (e) => {
    setCommandHistoryIndex(-1); // Reset index on new input
    setStagedInput('');
    setInput(e.target.value);
  };

  const handleKeyDown = async (e) => {
    const commandHistory = history.filter(line => line.type === 'command').map(line => line.text);

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      let newIndex;
      if (commandHistoryIndex === -1) {
        setStagedInput(input);
        newIndex = commandHistory.length - 1;
      } else {
        newIndex = commandHistoryIndex - 1;
      }
      if (newIndex < 0) newIndex = 0;
      
      setInput(commandHistory[newIndex]);
      setCommandHistoryIndex(newIndex);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || commandHistoryIndex === -1) return;

      let newIndex = commandHistoryIndex + 1;
      if (newIndex >= commandHistory.length) {
        setInput(stagedInput);
        newIndex = -1; // Indicate no history selected
      } else {
        setInput(commandHistory[newIndex]);
      }
      setCommandHistoryIndex(newIndex);
    } else if (e.key === 'Enter') {
      if (isProcessing || input.trim() === '') return;
      addHistory(input, 'command');
      const commandToProcess = input;
      setInput('');
      await processCommand(commandToProcess);
      setStagedInput('');
      setCommandHistoryIndex(-1); // Reset index after command submission
    }
  };

  return {
    history,
    input,
    isProcessing,
    handleInputChange,
    handleKeyDown,
  };
};
