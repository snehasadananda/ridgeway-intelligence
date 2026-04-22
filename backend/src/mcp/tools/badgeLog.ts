import fs from 'fs/promises';
import path from 'path';

export async function queryBadgeLogs(input: {
  access_point: string;
  start_time: string;
  end_time: string;
}) {
  const data = await fs.readFile(
    path.join(__dirname, '../../data/badgeLogs.json'),
    'utf-8'
  );
  const { logs } = JSON.parse(data);

  const startTime = new Date(input.start_time);
  const endTime = new Date(input.end_time);

  const filtered = logs.filter((log: any) => {
    const logTime = new Date(log.timestamp);
    const matchesTime = logTime >= startTime && logTime <= endTime;
    const matchesPoint = !input.access_point || log.accessPoint === input.access_point;
    return matchesTime && matchesPoint;
  });

  return {
    access_point: input.access_point,
    time_range: {
      start: input.start_time,
      end: input.end_time
    },
    total_records: filtered.length,
    records: filtered
  };
}