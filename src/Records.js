import fs from 'fs';
import path from 'path';
import util from 'util';

import moment from 'moment';
import stringify from 'csv-stringify';

import getTimestamp from './getTimestamp';

class Records {
  constructor(defaultPath) {
    this.data = [];
    this.defaultPath = defaultPath;
  }

  add(data) {
    this.data.push(Object.assign({ time: getTimestamp() }, data));
  }

  async export(filename, dir = this.defaultPath, appendTime = true) {
    const timestamp = appendTime
      ? `${moment().format('YYYYMMDD-hhmmss')}~${getTimestamp()}`
      : '';
    const fd = `${path.join(dir, `${filename} ${timestamp}`)}.csv`;
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
