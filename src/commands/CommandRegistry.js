import commands from './index';

class CommandRegistry {
  constructor() {
    this.commands = {};
    commands.forEach(Command => {
      const command = new Command();
      this.commands[command.name] = command;
    });
  }

  register(command) {
    this.commands[command.name] = command;
  }

  get(name) {
    return this.commands[name];
  }

  getAll() {
    return Object.values(this.commands);
  }
}

export default CommandRegistry;
