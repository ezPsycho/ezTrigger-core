import fs from 'fs';
import path from 'path';
import util from 'util';
import stringify from 'csv-stringify';

class Records {
  constructor(defaultPath) {
    this.data = [];
    this.defaultPath = defaultPath;
  }

  add(data) {
    this.data.push(data);
  }

  async export(filename, dir = this.defaultPath) {
    const fd = `${path.join(dir, filename)}.csv`;
    const csv = await new Promise((resolve, reject) =>
      stringify(
        this.data,
        {
          header: true
        },
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        }
      )
    );

    await util.promisify(fs.writeFile)(fd, csv);

    return fd;
  }
}

export default Records;