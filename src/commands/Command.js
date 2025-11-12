class Command {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  execute(args) {
    throw new Error('Not implemented');
  }

  updateHistory(response, addHistory) {
    addHistory(response);
  }
}

export default Command;
