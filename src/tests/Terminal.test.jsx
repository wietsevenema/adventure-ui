import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Terminal from '../components/Terminal';

describe('Terminal', () => {
  it('should render the terminal and process commands', async () => {
    const { getByRole, findByText } = render(<Terminal />);
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: 'look' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await findByText('> look');
  });
});
