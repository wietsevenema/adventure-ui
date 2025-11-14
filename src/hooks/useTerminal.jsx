import { useState } from 'react';
import CommandRegistry from '../commands/CommandRegistry';
import * as api from '../api/ApiService';
import { formatRoomOutput } from '../utils/formatting';

const commandRegistry = new CommandRegistry();

export const useTerminal = (initialOutput = null, initialRoom = null) => {
  const [history, setHistory] = useState(() => {
    const initialHistory = initialOutput ? [initialOutput] : ["Welcome to the Garden of the Forgotten Prompt!"];
    if (initialRoom) {
      const lines = formatRoomOutput(initialRoom.name, initialRoom.description);
      initialHistory.push(...lines);
    }
    return initialHistory.map(text => ({ text, type: 'response' }));
  });
  const [commandHistory, setCommandHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);
  const [stagedInput, setStagedInput] = useState('');
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const addHistory = (text, type = 'response') => {
    setHistory(prev => [...prev, { text, type }]);
  };

  const processCommand = async (command) => {
    const [cmd, ...args] = command.trim().toLowerCase().split(/\s+/);
    const argString = args.join(' ');
    const commandInstance = commandRegistry.get(cmd);

    if (commandInstance) {
      setIsProcessing(true);
      try {
        const response = await commandInstance.execute(argString);
        commandInstance.updateHistory(response, addHistory);

        if (response && response.data && response.data.level_complete) {
          setIsLevelComplete(true);
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
    // Ctrl+L: Clear Screen
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
      return;
    }

    // Ctrl+A: Start of line
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      e.target.setSelectionRange(0, 0);
      return;
    }

    // Ctrl+E: End of line
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      e.target.setSelectionRange(input.length, input.length);
      return;
    }

    // Ctrl+K: Kill to end
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      const cursor = e.target.selectionStart;
      setInput(input.slice(0, cursor));
      return;
    }

    // Ctrl+U: Kill to start
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      const cursor = e.target.selectionStart;
      setInput(input.slice(cursor));
      setTimeout(() => {
        if (e.target) e.target.setSelectionRange(0, 0);
      }, 0);
      return;
    }

    if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      let newIndex;
      if (commandHistoryIndex === -1) {
        // Save current input before navigating history
        setStagedInput(input);
        newIndex = commandHistory.length - 1;
      } else {
        newIndex = commandHistoryIndex - 1;
      }
      if (newIndex < 0) newIndex = 0;

      setInput(commandHistory[newIndex]);
      setCommandHistoryIndex(newIndex);

      setTimeout(() => {
        if (e.target) e.target.setSelectionRange(e.target.value.length, e.target.value.length);
      }, 0);
    } else if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) {
      e.preventDefault();
      if (commandHistory.length === 0 || commandHistoryIndex === -1) return;

      let newIndex = commandHistoryIndex + 1;
      if (newIndex >= commandHistory.length) {
        // Restore staged input when navigating past the most recent command
        setInput(stagedInput);
        newIndex = -1; // Indicate no history selected
      } else {
        setInput(commandHistory[newIndex]);
      }
      setCommandHistoryIndex(newIndex);

      setTimeout(() => {
        if (e.target) e.target.setSelectionRange(e.target.value.length, e.target.value.length);
      }, 0);
    } else if (e.key === 'Enter') {
      if (isProcessing || input.trim() === '') return;
      addHistory(input, 'command');
      setCommandHistory(prev => [...prev, input]);
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
    isLevelComplete,
  };
};
