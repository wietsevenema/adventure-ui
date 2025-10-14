import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 150px rgba(0, 255, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 150px rgba(0, 255, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 150px rgba(0, 255, 0, 0.5);
  }
`;

const TerminalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #333;

  & > div {
    width: 100%;
    height: 100vh;
  }

  @media (min-width: 800px) and (min-height: 600px) {
    & > div {
      width: 800px;
      height: 600px;
      border: 2px solid #0F0;
      animation: ${pulse} 5s infinite;
    }
  }
`;

export default TerminalWrapper;
