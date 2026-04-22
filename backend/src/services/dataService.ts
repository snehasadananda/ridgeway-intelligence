import fs from 'fs/promises';
import path from 'path';

export class DataService {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(__dirname, '../data');
  }

  async getEvents() {
    const data = await fs.readFile(path.join(this.dataDir, 'events.json'), 'utf-8');
    return JSON.parse(data);
  }

  async getSiteLayout() {
    const data = await fs.readFile(path.join(this.dataDir, 'sitelayout.json'), 'utf-8');
    return JSON.parse(data);
  }

  async getBadgeLogs() {
    const data = await fs.readFile(path.join(this.dataDir, 'badgeLogs.json'), 'utf-8');
    return JSON.parse(data);
  }

  async getVehicleHistory() {
    const data = await fs.readFile(path.join(this.dataDir, 'vehicleHistory.json'), 'utf-8');
    return JSON.parse(data);
  }

  async saveInvestigation(investigation: any) {
    // In a real app, this would save to a database
    // For now, we're using in-memory storage
    return investigation;
  }

  async getInvestigation(id: string) {
    // In a real app, this would fetch from a database
    return null;
  }
}

export const dataService = new DataService();
