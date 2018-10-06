import process from 'process';

const getTimestamp = () => {
  const time = process.hrtime();
  return `${time[0]}.${String(time[1]).padStart(9, '0')}`
}

export default getTimestamp;