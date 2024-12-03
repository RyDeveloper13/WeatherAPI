import { promises as fs } from 'fs';

// Define a City class
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class HistoryService {
  private filePath = './db/db.json';

  // Read method: Reads data from the JSON file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      // If the file doesn't exist, return an empty array
      if (error) {
        return [];
      }
      throw error;
    }
  }

  // Write method: Writes data to the JSON file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  // Get cities method: Returns all cities from the JSON file
  public async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add city method: Adds a new city to the JSON file
  public async addCity(name: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(this.generateId(), name);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // Remove city method: Removes a city by its ID
  public async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    if (cities.length === updatedCities.length) {
      return false; // No city found with the given ID
    }
    await this.write(updatedCities);
    return true;
  }

  // Utility method: Generate a unique ID for each city
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default new HistoryService();
