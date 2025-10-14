import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TerminalWrapper from '../components/TerminalWrapper';

describe('TerminalWrapper', () => {
  it('renders the TerminalWrapper component', () => {
    const { container } = render(<TerminalWrapper />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
