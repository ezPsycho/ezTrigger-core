import fs from 'fs';
import path from 'path';
import util from 'util';
import EventEmitter from 'events';

import moment from 'moment';
import stringify from 'csv-stringify';

import getTimestamp from './getTimestamp';

class Records extends EventEmitter {
  constructor(defaultPath) {
    super();

    this.data = [];
    this.defaultPath = defaultPath;
  }

  add(data) {
    this.data.push(Object.assign({ time: getTimestamp() }, data));
    this.emit('record-updated');
  }

  async export(filename, dir = this.defaultPath, appendTime = true) {
    const timestamp = appendTime
      ? `${moment().format('YYYYMMDD-HHmmss')} ${getTimestamp()}`
      : '';

    const columns = new Set();

    this.data.forEach(line =>
      Object.keys(line).forEach(item => columns.add(item))
    );

    const fd = `${path.join(dir, `${filename} ${timestamp}`)}.csv`;
    const csv = await new Promise((resolve, reject) =>
      stringify(
        this.data,
        {
          header: true,
          columns: [...columns]
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

  clear() {
    this.data = [];
    this.emit('record-updated');
  }
}

export default Records;
