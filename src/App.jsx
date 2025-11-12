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

  const handleLevelSelect = async (levelId) => {
    try {
      setAppState(APP_STATE.LOADING);
      const response = await api.startLevel(levelId);
      const { intro_text, level_id } = response.data;

      // We might want to get the level name for the initial output.
      // We could have passed it from LevelSelect, or fetch it again.
      // For simplicity, let's just use the level_id or fetch it if needed.
      // A better way is to have listLevels return it and we pass it here.
      // Let's re-fetch the level list to get the name, or just use a placeholder.
      // Actually, let's just use a generic welcome message + first look.
      // The requirement said "Print the level title, and the first room description."
      // We can get the level title from the level list if we cached it, or just fetch it.
      // Let's try to get it from the response if possible, but it's not there.
      // We will fetch the level list again or just rely on `look` to provide enough info if we want.
      // Wait, `api.listLevels` returns the name. We can pass it from `LevelSelect`.
      // Let's update `handleLevelSelect` to accept the level object or name.

      // Re-reading requirement: "Print the level title, and the first room description."
      // I'll update LevelSelect to pass the whole level object or just the name.
      // For now, I will just set a placeholder and we can refine it.
      // Actually, let's fetch the levels again to get the name, it's safer.
      // Or better, pass it from LevelSelect. I will update LevelSelect next if needed,
      // but I can just change the signature of this function in App.jsx and LevelSelect.jsx

      if (intro_text && intro_text.length > 0) {
        setIntroText(intro_text);
        setAppState(APP_STATE.INTRO);
      } else {
        setAppState(APP_STATE.PLAYING);
      }
    } catch (error) {
      console.error("Failed to start level:", error);
      // Handle error, maybe go back to level select with an error message
      setAppState(APP_STATE.LEVEL_SELECT);
    }
  };

  // Updated to accept levelName for the initial output
  const handleLevelSelectWithInfo = async (levelId, levelName) => {
      try {
        setAppState(APP_STATE.LOADING);
        const response = await api.startLevel(levelId);
        const { intro_text } = response.data;

        setInitialTerminalOutput(`Welcome to ${levelName}!`);

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
      content = <Terminal initialOutput={initialTerminalOutput} />;
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
