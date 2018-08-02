const commandMatcher = /(.*?) (.*)[\r\n]*/;
const cleanMatcher = /(.*)[\r\n]*/;

const ParseCmd = data => {
  const message = data.toString().split('\r\n');

  return message
    .map(line => {
      const match = line.match(commandMatcher);
      const validCommand = match !== null;

      const command = validCommand ? match[1] : line.match(cleanMatcher)[1];
      if (command === '') return false;
      const options = validCommand ? match[2] : '';

      return {
        command: command,
        options: options
      };
    })
    .filter(x => x !== false);
};

export default ParseCmd;
