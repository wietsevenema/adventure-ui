import { describe, it, expect } from 'vitest';
import CommandRegistry from '../commands/CommandRegistry';
import MoveCommand from '../commands/MoveCommand';
import LookCommand from '../commands/LookCommand';
import InventoryCommand from '../commands/InventoryCommand';
import TakeCommand from '../commands/TakeCommand';
import DropCommand from '../commands/DropCommand';
import UseCommand from '../commands/UseCommand';
import ExamineCommand from '../commands/ExamineCommand';
import HelpCommand from '../commands/HelpCommand';
import QuitCommand from '../commands/QuitCommand';

describe('Command Aliases', () => {
  const commandRegistry = new CommandRegistry();

  it('should resolve "m", "go", "cd", "walk" to MoveCommand', () => {
    expect(commandRegistry.get('m')).toBeInstanceOf(MoveCommand);
    expect(commandRegistry.get('go')).toBeInstanceOf(MoveCommand);
    expect(commandRegistry.get('cd')).toBeInstanceOf(MoveCommand);
    expect(commandRegistry.get('walk')).toBeInstanceOf(MoveCommand);
  });

  it('should resolve "l", "ls", "view", "see" to LookCommand', () => {
    expect(commandRegistry.get('l')).toBeInstanceOf(LookCommand);
    expect(commandRegistry.get('ls')).toBeInstanceOf(LookCommand);
    expect(commandRegistry.get('view')).toBeInstanceOf(LookCommand);
    expect(commandRegistry.get('see')).toBeInstanceOf(LookCommand);
  });

  it('should resolve "i", "bag", "items" to InventoryCommand', () => {
    expect(commandRegistry.get('i')).toBeInstanceOf(InventoryCommand);
    expect(commandRegistry.get('bag')).toBeInstanceOf(InventoryCommand);
    expect(commandRegistry.get('items')).toBeInstanceOf(InventoryCommand);
  });

  it('should resolve "t", "get", "grab" to TakeCommand', () => {
    expect(commandRegistry.get('t')).toBeInstanceOf(TakeCommand);
    expect(commandRegistry.get('get')).toBeInstanceOf(TakeCommand);
    expect(commandRegistry.get('grab')).toBeInstanceOf(TakeCommand);
  });

  it('should resolve "d", "discard", "release" to DropCommand', () => {
    expect(commandRegistry.get('d')).toBeInstanceOf(DropCommand);
    expect(commandRegistry.get('discard')).toBeInstanceOf(DropCommand);
    expect(commandRegistry.get('release')).toBeInstanceOf(DropCommand);
  });

  it('should resolve "u", "apply" to UseCommand', () => {
    expect(commandRegistry.get('u')).toBeInstanceOf(UseCommand);
    expect(commandRegistry.get('apply')).toBeInstanceOf(UseCommand);
  });

  it('should resolve "x", "inspect", "check" to ExamineCommand', () => {
    expect(commandRegistry.get('x')).toBeInstanceOf(ExamineCommand);
    expect(commandRegistry.get('inspect')).toBeInstanceOf(ExamineCommand);
    expect(commandRegistry.get('check')).toBeInstanceOf(ExamineCommand);
  });

  it('should resolve "h", "?", "man", "info" to HelpCommand', () => {
    expect(commandRegistry.get('h')).toBeInstanceOf(HelpCommand);
    expect(commandRegistry.get('?')).toBeInstanceOf(HelpCommand);
    expect(commandRegistry.get('man')).toBeInstanceOf(HelpCommand);
    expect(commandRegistry.get('info')).toBeInstanceOf(HelpCommand);
  });

  it('should resolve "q", "exit", ":q!" to QuitCommand', () => {
    expect(commandRegistry.get('q')).toBeInstanceOf(QuitCommand);
    expect(commandRegistry.get('exit')).toBeInstanceOf(QuitCommand);
    expect(commandRegistry.get(':q!')).toBeInstanceOf(QuitCommand);
  });
});