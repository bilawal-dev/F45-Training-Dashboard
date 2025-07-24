/**
 * LocationProvider Service
 * 
 * This service fetches location data from the Project Intake list and provides
 * mapping between project names and their geographic information.
 */

import { ClickUpAPIService, KNOWN_IDS, STATE_TO_REGION_MAPPING } from '@/services/clickupAPI';

export interface LocationData {
  projectName: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  franchiseeName?: string;
  orderTotal?: number;
  projectType?: string;
}

export interface RegionalSummary {
  region: string;
  totalLocations: number;
  states: string[];
  averageOrderValue: number;
}

export class LocationProvider {
  private locationMap = new Map<string, LocationData>();
  private regionalSummaries = new Map<string, RegionalSummary>();
  private isInitialized = false;

  /**
   * Initialize the LocationProvider by fetching Project Intake data
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      
      const projectIntakeListId = KNOWN_IDS.projectIntakeListId;
      if (!projectIntakeListId) {
        throw new Error("Project Intake List ID is not configured in KNOWN_IDS. Please check your configuration.");
      }
      

      // Fetch Project Intake tasks
      const tasksData = await ClickUpAPIService.getProjectTasks(projectIntakeListId);
      
      if (!tasksData?.tasks) {
        throw new Error('No tasks found in Project Intake list');
      }

      // Process each task to extract location data
      tasksData.tasks.forEach((task: any) => {
        const locationData = this.extractLocationFromTask(task);
        
        if (locationData) {
          // Store by exact project name
          this.locationMap.set(locationData.projectName, locationData);
          
          // Store by cleaned project name for fuzzy matching
          const cleanName = this.cleanProjectName(locationData.projectName);
          this.locationMap.set(cleanName, locationData);
          
        }
      });

      // Build regional summaries
      this.buildRegionalSummaries();

      this.isInitialized = true;

    } catch (error) {
      console.error('❌ [LocationProvider] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Extract location data from a Project Intake task using custom fields
   */
  private extractLocationFromTask(task: any): LocationData | null {
    const locationData: LocationData = {
      projectName: task.name
    };

    // Process custom fields using field names from Project Intake
    if (task.custom_fields) {
      task.custom_fields.forEach((field: any) => {
        const fieldName = field.name;
        const fieldValue = field.value;

        switch (fieldName) {
          case 'Street':
            locationData.street = fieldValue;
            break;
          case 'City':
            locationData.city = fieldValue;
            break;
          case 'State':
            locationData.state = fieldValue;
            break;
          case 'Zip':
            locationData.zip = fieldValue;
            break;
          case 'Latitude':
            locationData.latitude = parseFloat(fieldValue) || undefined;
            break;
          case 'Longitude':
            locationData.longitude = parseFloat(fieldValue) || undefined;
            break;
          case 'Franchisee Name':
            locationData.franchiseeName = fieldValue;
            break;
          case 'Order Total':
            locationData.orderTotal = parseInt(fieldValue) || 0;
            break;
          case 'Project Type':
            locationData.projectType = fieldValue;
            break;
        }
      });
    }

    // Determine region from state
    if (locationData.state) {
      locationData.region = STATE_TO_REGION_MAPPING[locationData.state as keyof typeof STATE_TO_REGION_MAPPING] || 'Unknown';
    }

    // Only return if we have at least state or coordinates
    if (locationData.state || (locationData.latitude && locationData.longitude)) {
      return locationData;
    }

    return null;
  }

  /**
   * Clean project name for fuzzy matching
   */
  private cleanProjectName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Build regional summary data
   */
  private buildRegionalSummaries(): void {
    const regions = new Map<string, LocationData[]>();

    // Group locations by region
    this.locationMap.forEach((location) => {
      if (location.region && location.region !== 'Unknown') {
        if (!regions.has(location.region)) {
          regions.set(location.region, []);
        }
        regions.get(location.region)!.push(location);
      }
    });

    // Create regional summary objects
    regions.forEach((locations, region) => {
      const states = [...new Set(locations.map(loc => loc.state).filter((state): state is string => Boolean(state)))];
      const totalOrderValue = locations.reduce((sum, loc) => sum + (loc.orderTotal || 0), 0);
      const averageOrderValue = Math.round(totalOrderValue / locations.length) || 0;

      this.regionalSummaries.set(region, {
        region,
        totalLocations: locations.length,
        states,
        averageOrderValue
      });
    });
  }

  /**
   * Get location data for a specific project with enhanced matching
   */
  async getLocationForProject(projectName: string): Promise<LocationData | null> {
    await this.initialize();

    // Try exact match first
    let location = this.locationMap.get(projectName);
    if (location) {
      return location;
    }

    // Try convention-based matching: "Dallas Location" → "Crumbl - Dallas Location"
    for (const [key, loc] of this.locationMap) {
      if (key.includes(' - ') && key.endsWith(projectName)) {
        return loc;
      }
    }

    // Try cleaned name match
    const cleanName = this.cleanProjectName(projectName);
    location = this.locationMap.get(cleanName);
    if (location) {
      return location;
    }

    // Try fuzzy word matching
    for (const [key, loc] of this.locationMap) {
      const cleanKey = this.cleanProjectName(key);
      
      // Check for shared meaningful words
      const projectWords = cleanName.split(' ').filter(word => word.length > 2);
      const locationWords = cleanKey.split(' ').filter(word => word.length > 2);
      
      const matchingWords = projectWords.filter(word => 
        locationWords.some(locWord => locWord.includes(word) || word.includes(locWord))
      );

      if (matchingWords.length > 0 && matchingWords.length >= Math.min(projectWords.length * 0.5, 1)) {
        return loc;
      }
    }

    return null;
  }

  /**
   * Get all locations for a specific region
   */
  async getLocationsForRegion(region: string): Promise<LocationData[]> {
    await this.initialize();
    const locations: LocationData[] = [];
    
    this.locationMap.forEach((location) => {
      if (location.region === region) {
        locations.push(location);
      }
    });
    
    return locations;
  }

  /**
   * Get regional summary data
   */
  async getRegionalSummaries(): Promise<RegionalSummary[]> {
    await this.initialize();
    return Array.from(this.regionalSummaries.values());
  }

  /**
   * Get all location mappings (for debugging)
   */
  async getAllLocationMappings(): Promise<Map<string, LocationData>> {
    await this.initialize();
    return new Map(this.locationMap);
  }
}

// Singleton instance
export const locationProvider = new LocationProvider(); 