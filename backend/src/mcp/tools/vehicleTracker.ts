import fs from 'fs/promises';
import path from 'path';

export async function getVehicleHistory(input: {
  zone: string;
  start_time: string;
  end_time: string;
}) {
  const data = await fs.readFile(
    path.join(__dirname, '../../data/vehicleHistory.json'),
    'utf-8'
  );
  const { history } = JSON.parse(data);

  const startTime = new Date(input.start_time);
  const endTime = new Date(input.end_time);

  const filtered = history.filter((entry: any) => {
    const entryTime = new Date(entry.timestamp);
    const matchesTime = entryTime >= startTime && entryTime <= endTime;
    const matchesZone = !input.zone || entry.zone.includes(input.zone);
    return matchesTime && matchesZone;
  });

  // Group by vehicle
  const byVehicle: Record<string, any[]> = {};
  filtered.forEach((entry: any) => {
    if (!byVehicle[entry.vehicleId]) {
      byVehicle[entry.vehicleId] = [];
    }
    byVehicle[entry.vehicleId].push(entry);
  });

  return {
    zone: input.zone,
    time_range: {
      start: input.start_time,
      end: input.end_time
    },
    total_entries: filtered.length,
    vehicles: Object.keys(byVehicle).length,
    vehicle_paths: byVehicle
  };
}