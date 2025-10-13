import { describe, it, expect } from 'vitest';
import CommandRegistry from '../commands/CommandRegistry';
import LookCommand from '../commands/LookCommand';

describe('CommandRegistry', () => {
  it('should register and get a command', () => {
    const commandRegistry = new CommandRegistry();
    const lookCommand = new LookCommand();
    commandRegistry.register(lookCommand);
    const retrievedCommand = commandRegistry.get('look');
    expect(retrievedCommand).toBeInstanceOf(LookCommand);
  });

  it('should get all commands', () => {
    const commandRegistry = new CommandRegistry();
    const commands = commandRegistry.getAll();
    expect(commands.length).toBeGreaterThan(0);
  });
});
