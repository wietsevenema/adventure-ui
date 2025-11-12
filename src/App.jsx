import React, { useState, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import TerminalWrapper from './components/TerminalWrapper';
import LevelSelect from './components/LevelSelect';
import IntroScreen from './components/IntroScreen';
import * as api from './api/ApiService';
import ScreenContainer from './components/ScreenContainer';

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

      const title = `${levelName}`;
      const underline = '='.repeat(title.length);
      setInitialTerminalOutput(`${title}\n${underline}\n-> Type 'help' to list commands\n\n`);

      // Fetch initial game state
      const lookResponse = await api.look();
      setInitialRoom(lookResponse.data);

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

  const handleLevelComplete = () => {
    setAppState(APP_STATE.LEVEL_SELECT);
    setInitialTerminalOutput(null);
    setInitialRoom(null);
  };

  let content;
  switch (appState) {
    case APP_STATE.LOADING:
      content = (
        <ScreenContainer>
          Loading...
        </ScreenContainer>
      );
      break;
    case APP_STATE.LEVEL_SELECT:
      content = <LevelSelect onLevelSelect={handleLevelSelectWithInfo} />;
      break;
    case APP_STATE.INTRO:
      content = <IntroScreen text={introText} onComplete={handleIntroComplete} />;
      break;
    case APP_STATE.PLAYING:
      content = (
        <GameScreen
          initialOutput={initialTerminalOutput}
          initialRoom={initialRoom}
          onLevelComplete={handleLevelComplete}
        />
      );
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
