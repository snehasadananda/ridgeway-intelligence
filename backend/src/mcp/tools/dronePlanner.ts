import fs from 'fs/promises';
import path from 'path';

export async function planDroneMission(input: {
  target_zone: string;
  investigation_reason: string;
}) {
  const layoutData = await fs.readFile(
    path.join(__dirname, '../../data/sitelayout.json'),
    'utf-8'
  );
  const { zones, center } = JSON.parse(layoutData);

  const targetZone = zones.find((z: any) => 
    z.id.includes(input.target_zone) || z.name.includes(input.target_zone)
  );

  if (!targetZone) {
    throw new Error(`Zone not found: ${input.target_zone}`);
  }

  // Calculate simple patrol route around zone
  const route = calculatePatrolRoute(targetZone.polygon, center);

  // Simulate mission findings based on the zone and reason
  const findings = simulateFindings(input.target_zone, input.investigation_reason);

  return {
    mission_id: `MISSION-${Date.now()}`,
    target_zone: input.target_zone,
    reason: input.investigation_reason,
    status: 'planned',
    route: route,
    estimated_duration_minutes: 8,
    planned_altitude_meters: 50,
    simulated_findings: findings
  };
}

function calculatePatrolRoute(polygon: any[], center: any) {
  // Simple route: fly around the perimeter of the zone
  const route = [...polygon];
  // Add center point for complete coverage
  route.push(center);
  route.push(polygon[0]); // Return to start
  return route;
}

function simulateFindings(zone: string, reason: string) {
  // Simulate realistic findings based on zone and reason
  if (zone.includes('Block-C') || zone.includes('blockc')) {
    return [
      'Vehicle observed parked near Block C Secondary Access',
      'No visible personnel in the area',
      'Building exterior shows no signs of forced entry',
      'Recommend checking badge logs for access attempts in this timeframe'
    ];
  } else if (zone.includes('Gate-3') || zone.includes('gate3')) {
    return [
      'Gate 3 perimeter fence intact',
      'Wind conditions moderate (20-25 km/h)',
      'No unauthorized personnel detected',
      'Fence sensor alert likely environmental'
    ];
  }
  return ['No anomalies detected during patrol'];
}
