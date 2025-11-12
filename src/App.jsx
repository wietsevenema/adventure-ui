import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal';
import TerminalWrapper from './components/TerminalWrapper';
import LevelSelect from './components/LevelSelect';
import IntroScreen from './components/IntroScreen';
import * as api from './api/ApiService';

const APP_STATE = {
  LOADING: 'LOADING',
  LEVEL_SELECT: 'LEVEL_SELECT',
  INTRO: 'INTRO',
  PLAYING: 'PLAYING',
};

function App() {
  const [appState, setAppState] = useState(APP_STATE.LOADING);
  const [introText, setIntroText] = useState([]);
  const [initialTerminalOutput, setInitialTerminalOutput] = useState(null);
  const [initialRoom, setInitialRoom] = useState(null);
  const [initialInventory, setInitialInventory] = useState([]);

  useEffect(() => {
    // Check if we have an API key, if so, go to level select.
    // Otherwise, we might want to show a login prompt, but for now
    // let's assume the user is authenticated if they are here,
    // or the API calls will fail and redirect them (handled by axios interceptors ideally,
    // but for now we just rely on the happy path or basic error handling).
    // Since the original code checked for apiKey in localStorage, we keep that check.
    // Actually, the new auth uses cookies, so we might not need to check localStorage for apiKey anymore.
    // Let's assume we are good to go to LEVEL_SELECT.
    setAppState(APP_STATE.LEVEL_SELECT);
  }, []);

  // Updated to accept levelName for the initial output
  const handleLevelSelectWithInfo = async (levelId, levelName) => {
      try {
        setAppState(APP_STATE.LOADING);
        const response = await api.startLevel(levelId);
        const { intro_text } = response.data;

        setInitialTerminalOutput(`Welcome to ${levelName}!`);

        // Fetch initial game state
        const lookResponse = await api.look();
        setInitialRoom(lookResponse.data);
        const inventoryResponse = await api.inventory();
        setInitialInventory(inventoryResponse.data.inventory);

        if (intro_text && intro_text.length > 0) {
          setIntroText(intro_text);
          setAppState(APP_STATE.INTRO);
        } else {
          setAppState(APP_STATE.PLAYING);
        }
      } catch (error) {
        console.error("Failed to start level:", error);
        setAppState(APP_STATE.LEVEL_SELECT);
      }
  }

  const handleIntroComplete = () => {
    setAppState(APP_STATE.PLAYING);
  };

  let content;
  switch (appState) {
    case APP_STATE.LOADING:
      content = <div style={{color: '#00B600', padding: '20px'}}>Loading...</div>;
      break;
    case APP_STATE.LEVEL_SELECT:
      content = <LevelSelect onLevelSelect={handleLevelSelectWithInfo} />;
      break;
    case APP_STATE.INTRO:
      content = <IntroScreen text={introText} onComplete={handleIntroComplete} />;
      break;
    case APP_STATE.PLAYING:
      content = <Terminal initialOutput={initialTerminalOutput} initialRoom={initialRoom} initialInventory={initialInventory} />;
      break;
    default:
      content = null;
  }

  return (
    <TerminalWrapper>
      {content}
    </TerminalWrapper>
  );
}

export default App;
