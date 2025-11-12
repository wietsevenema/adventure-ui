import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as api from '../api/ApiService';

const Container = styled.div`
  background-color: #000;
  color: #00B600;
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto Mono', monospace;
`;

const Title = styled.h1`
  color: #00FF00;
  text-align: center;
  margin-bottom: 2rem;
`;

const LevelList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
`;

const LevelItem = styled.li`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #00B600;
  cursor: ${(props) => (props.$selectable ? 'pointer' : 'not-allowed')};
  opacity: ${(props) => (props.$selectable ? 1 : 0.5)};
  background-color: ${(props) => (props.$selected ? '#003300' : 'transparent')};

  &:hover {
    background-color: ${(props) => (props.$selectable ? '#002200' : 'transparent')};
  }
`;

const LevelName = styled.div`
  font-weight: bold;
  color: #00FF00;
  margin-bottom: 0.5rem;
`;

const LevelDescription = styled.div`
  margin-bottom: 0.5rem;
`;

const LevelStatus = styled.div`
  font-size: 0.8em;
  text-transform: uppercase;
`;

const LevelSelect = ({ onLevelSelect }) => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await api.listLevels();
        setLevels(response.data);
        // Pre-select the first available or in-progress level
        const firstSelectable = response.data.findIndex(
          l => l.state === 'available' || l.state === 'in_progress' || l.state === 'played'
        );
        if (firstSelectable !== -1) {
          setSelectedIndex(firstSelectable);
        }
      } catch (err) {
        setError('Failed to load levels.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const handleKeyDown = (e) => {
    if (loading || error || levels.length === 0) return;

    if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev < levels.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'Enter') {
      const selectedLevel = levels[selectedIndex];
      if (selectedLevel && selectedLevel.state !== 'locked') {
        onLevelSelect(selectedLevel.id, selectedLevel.name);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading, error, levels, selectedIndex, onLevelSelect]);

  if (loading) return <Container>Loading levels...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Title>SELECT LEVEL</Title>
      <LevelList>
        {levels.map((level, index) => (
          <LevelItem
            key={level.id}
            $selectable={level.state !== 'locked'}
            $selected={index === selectedIndex}
            onClick={() => level.state !== 'locked' && onLevelSelect(level.id, level.name)}
          >
            <LevelName>{level.name}</LevelName>
            <LevelDescription>{level.description}</LevelDescription>
            <LevelStatus>Status: {level.state.replace('_', ' ')}</LevelStatus>
            {level.highscore !== null && <div>High Score: {level.highscore}</div>}
          </LevelItem>
        ))}
      </LevelList>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        Use UP/DOWN arrows to navigate, ENTER to select.
      </div>
    </Container>
  );
};

export default LevelSelect;
