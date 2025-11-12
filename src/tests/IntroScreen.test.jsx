import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IntroScreen from '../components/IntroScreen';

describe('IntroScreen', () => {
  it('renders the intro text and the "Press any key" message', () => {
    const text = ['Welcome to the game!', 'Prepare for adventure.'];
    const onComplete = vi.fn();

    render(<IntroScreen text={text} onComplete={onComplete} />);

    expect(screen.getByText('Welcome to the game!')).toBeInTheDocument();
    expect(screen.getByText('Press any key to continue...')).toBeInTheDocument();
  });

  it('advances text on key press', () => {
    const text = ['Page 1', 'Page 2'];
    const onComplete = vi.fn();

    render(<IntroScreen text={text} onComplete={onComplete} />);

    expect(screen.getByText('Page 1')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });

  it('calls onComplete when text is finished', () => {
    const text = ['Page 1'];
    const onComplete = vi.fn();

    render(<IntroScreen text={text} onComplete={onComplete} />);

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(onComplete).toHaveBeenCalled();
  });
});
