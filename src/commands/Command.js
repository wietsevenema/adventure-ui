class Command {
  constructor(name, description, aliases = []) {
    this.name = name;
    this.description = description;
    this.aliases = aliases;
  }

  execute(args) {
    throw new Error('Not implemented');
  }

  updateHistory(response, addHistory) {
    addHistory(response);
  }
}

export default Command;
