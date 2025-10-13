import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    background: '#000000',
    text: '#00FF00',
  },
  fonts: {
    body: 'Roboto Mono, monospace',
  },
};

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-family: ${(props) => props.theme.fonts.body};
    margin: 0;
    padding: 0;
  }
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);