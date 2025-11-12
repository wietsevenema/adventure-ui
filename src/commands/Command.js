class Command {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.needsRefresh = true;
  }

  execute(args) {
    throw new Error('Not implemented');
  }

  updateHistory(response, addHistory) {
    addHistory(response);
  }
}

export default Command;
