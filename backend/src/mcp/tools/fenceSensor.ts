import fs from 'fs/promises';
import path from 'path';

export async function checkFenceSensors(input: {
  sensor_id: string;
  start_time: string;
  end_time: string;
}) {
  const data = await fs.readFile(
    path.join(__dirname, '../../data/events.json'),
    'utf-8'
  );
  const { events } = JSON.parse(data);

  const startTime = new Date(input.start_time);
  const endTime = new Date(input.end_time);

  const fenceEvents = events.filter((event: any) => {
    if (event.type !== 'fence_alert') return false;
    const eventTime = new Date(event.timestamp);
    const matchesTime = eventTime >= startTime && eventTime <= endTime;
    const matchesSensor = !input.sensor_id || event.metadata?.sensorId === input.sensor_id;
    return matchesTime && matchesSensor;
  });

  return {
    sensor_id: input.sensor_id,
    time_range: {
      start: input.start_time,
      end: input.end_time
    },
    total_alerts: fenceEvents.length,
    alerts: fenceEvents,
    analysis: fenceEvents.length > 0 ? {
      likely_cause: fenceEvents[0].metadata?.weatherCondition === 'windy' 
        ? 'Environmental (wind)'
        : 'Unknown - requires investigation',
      avg_trigger_strength: fenceEvents.reduce((sum: number, e: any) => 
        sum + (e.metadata?.triggerStrength || 0), 0) / fenceEvents.length
    } : null
  };
}