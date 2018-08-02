import isCallable from 'is-callable';

class Commands {
  constructor() {
    this.commands = {};
  }

  isFreezed(command) {
    return this.commands[command] && this.commands[command].freeze;
  }

  register(command, fn, freeze) {
    if (!isCallable(fn)) {
      throw new TypeError('`fn` is not callable!');
    }

    if (this.isFreezed(command)) {
      throw new TypeError(
        `Command '${command}' is freezed, you can't replace it!`
      );
    }

    this.commands[command] = {
      name: command,
      fn: fn,
      freeze: freeze
    };

    return true;
  }

  deregister(command) {
    if (this.isFreezed(command)) {
      throw new TypeError(
        `Command '${command}' is freezed, you can't deregister it!`
      );
    }

    delete this.commands[command];

    return true;
  }

  callCmd(command, options) {
    if (this.commands[command]) {
      return this.commands[command].fn(options);
    } else {
      return false;
    }
  }
}

export default Commands;
