/**
 * Regional Data Aggregator Service
 * 
 * This service orchestrates the complete data pipeline for processing ClickUp data
 * by folder and generating dashboard-ready regional metrics.
 */

import { ClickUpAPIService } from '@/services/clickupAPI';
import { locationProvider, LocationData } from '@/services/locationProvider';
import { POI, RegionStatus, StateProgress, ActivityItem, MetricCard } from '@/types/dashboard';

interface ProjectWithLocation {
  id: string;
  name: string;
  customerFolder: string;
  taskCount: number;
  locationData: LocationData | null;
  projectData?: any; // Detailed project data from ClickUp
}

interface RegionalMetrics {
  region: string;
  totalLocations: number;
  completedLocations: number;
  completionPercentage: number;
  currentPhase: string;
  scheduleStatus: string;
  issuesCount: number;
  states: string[];
}

interface DashboardData {
  folderName: string;
  totalProjects: number;
  projectsWithLocation: number;
  overview: {
    totalLocations: number;
    completedLocations: number;
    overallCompletion: number;
    projectHealthScore: number;
    scheduleStatus: string;
    daysAheadBehind: number;
    projectTimeline: {
      phases: string[];
      currentPhaseIndex: number;
    };
  };
  regions: RegionalMetrics[];
  mapPOIs: POI[];
  activityFeed: ActivityItem[];
  lastUpdated: Date;
}

export class RegionalDataAggregator {
  private cache = new Map<string, { data: DashboardData; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get complete dashboard data for a specific folder
   */
  async getDashboardDataByFolder(folderId: string): Promise<DashboardData> {
    console.log(`🔄 [RegionalAggregator] Processing data for folder: ${folderId}`);

    // Check cache first
    const cached = this.cache.get(folderId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`💾 [RegionalAggregator] Returning cached data for folder: ${folderId}`);
      return cached.data;
    }

    try {
      // Step 1: Get all projects (lists) in the folder
      const allProjects = await ClickUpAPIService.getUserProjects();
      const folderProjects = allProjects.filter(project => project.folderId === folderId && !project.archived);
      
      if (folderProjects.length === 0) {
        throw new Error(`No projects found in folder: ${folderId}`);
      }

      const folderName = folderProjects[0].customerFolder;
      console.log(`📁 [RegionalAggregator] Processing ${folderProjects.length} projects in folder: ${folderName}`);

      // Step 2: Process projects with location data
      const projectsWithLocation = await this.processProjectsWithLocation(folderProjects);

      // Step 3: Generate regional metrics
      const regionalMetrics = this.generateRegionalMetrics(projectsWithLocation);

      // Step 4: Generate overview metrics
      const overview = this.generateOverviewMetrics(projectsWithLocation, regionalMetrics);

      // Step 5: Generate map POIs
      const mapPOIs = this.generateMapPOIs(projectsWithLocation);

      // Step 6: Generate activity feed
      const activityFeed = this.generateActivityFeed(projectsWithLocation);

      const dashboardData: DashboardData = {
        folderName,
        totalProjects: folderProjects.length,
        projectsWithLocation: projectsWithLocation.filter(p => p.locationData).length,
        overview,
        regions: regionalMetrics,
        mapPOIs,
        activityFeed,
        lastUpdated: new Date()
      };

      // Cache the result
      this.cache.set(folderId, {
        data: dashboardData,
        timestamp: Date.now()
      });

      console.log(`✅ [RegionalAggregator] Generated dashboard data for ${folderName}:`, {
        totalProjects: dashboardData.totalProjects,
        projectsWithLocation: dashboardData.projectsWithLocation,
        regions: dashboardData.regions.length,
        mapPoints: dashboardData.mapPOIs.length
      });

      return dashboardData;

    } catch (error) {
      console.error(`❌ [RegionalAggregator] Failed to process folder ${folderId}:`, error);
      throw error;
    }
  }

  /**
   * Process projects and enrich with location data and detailed project metrics
   */
  private async processProjectsWithLocation(projects: any[]): Promise<ProjectWithLocation[]> {
    console.log(`🔍 [RegionalAggregator] Enriching ${projects.length} projects with location and task data...`);

    const projectsWithLocation: ProjectWithLocation[] = [];

    // Process projects in parallel batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < projects.length; i += batchSize) {
      const batch = projects.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (project) => {
        try {
          // Get location data for this project
          const locationData = await locationProvider.getLocationForProject(project.name);
          
          const projectWithLocation: ProjectWithLocation = {
            id: project.id,
            name: project.name,
            customerFolder: project.customerFolder,
            taskCount: project.taskCount,
            locationData
          };

          // Only fetch detailed project data if the project has tasks and location
          if (project.taskCount > 0 && locationData) {
            try {
              const projectData = await ClickUpAPIService.getProcessedProjectData(project.id);
              projectWithLocation.projectData = projectData;
              console.log(`📊 [RegionalAggregator] Enriched "${project.name}" with ${projectData.allTasks.length} tasks, ${projectData.overallCompletion}% complete`);
            } catch (projectError) {
              console.warn(`⚠️ [RegionalAggregator] Could not fetch project data for "${project.name}":`, projectError);
            }
          }

          return projectWithLocation;
        } catch (error) {
          console.warn(`⚠️ [RegionalAggregator] Error processing project "${project.name}":`, error);
          return {
            id: project.id,
            name: project.name,
            customerFolder: project.customerFolder,
            taskCount: project.taskCount,
            locationData: null
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      projectsWithLocation.push(...batchResults);
    }

    return projectsWithLocation;
  }

  /**
   * Generate regional metrics from processed projects
   */
  private generateRegionalMetrics(projects: ProjectWithLocation[]): RegionalMetrics[] {
    const regionMap = new Map<string, ProjectWithLocation[]>();

    // Group projects by region
    projects.forEach(project => {
      if (project.locationData?.region) {
        const region = project.locationData.region;
        if (!regionMap.has(region)) {
          regionMap.set(region, []);
        }
        regionMap.get(region)!.push(project);
      }
    });

    // Generate metrics for each region
    const regionalMetrics: RegionalMetrics[] = [];

    // Ensure all 4 regions are represented
    const allRegions = ['Northeast', 'Southeast', 'Midwest', 'West'];
    
    allRegions.forEach(region => {
      const regionProjects = regionMap.get(region) || [];
      
      if (regionProjects.length === 0) {
        // No projects in this region
        regionalMetrics.push({
          region,
          totalLocations: 0,
          completedLocations: 0,
          completionPercentage: 0,
          currentPhase: 'N/A',
          scheduleStatus: 'No Data',
          issuesCount: 0,
          states: []
        });
      } else {
        const completedLocations = regionProjects.filter(p => 
          p.projectData?.overallCompletion === 100
        ).length;
        
        const totalCompletion = regionProjects
          .filter(p => p.projectData)
          .reduce((sum, p) => sum + (p.projectData?.overallCompletion || 0), 0);
        
        const projectsWithData = regionProjects.filter(p => p.projectData).length;
        const avgCompletion = projectsWithData > 0 ? Math.round(totalCompletion / projectsWithData) : 0;
        
        const currentPhase = this.getMostCommonPhase(regionProjects);
        const issuesCount = this.countIssues(regionProjects);
        const scheduleStatus = this.determineScheduleStatus(regionProjects, avgCompletion);
        
        const states = [...new Set(regionProjects
          .map(p => p.locationData?.state)
          .filter(Boolean)
        )] as string[];

        regionalMetrics.push({
          region,
          totalLocations: regionProjects.length,
          completedLocations,
          completionPercentage: avgCompletion,
          currentPhase,
          scheduleStatus,
          issuesCount,
          states
        });
      }
    });

    return regionalMetrics;
  }

  /**
   * Generate overview metrics
   */
  private generateOverviewMetrics(projects: ProjectWithLocation[], regionalMetrics: RegionalMetrics[]) {
    const projectsWithData = projects.filter(p => p.projectData && p.locationData);
    const totalLocations = projects.filter(p => p.locationData).length;
    const completedLocations = projects.filter(p => 
      p.projectData?.overallCompletion === 100 && p.locationData
    ).length;

    const totalCompletion = projectsWithData.reduce((sum, p) => sum + (p.projectData?.overallCompletion || 0), 0);
    const overallCompletion = projectsWithData.length > 0 ? Math.round(totalCompletion / projectsWithData.length) : 0;

    // Calculate project health score (weighted average considering various factors)
    const healthScore = this.calculateProjectHealthScore(projectsWithData, regionalMetrics);
    
    // Determine overall schedule status based on completion and issues (deterministic)
    const totalIssues = regionalMetrics.reduce((sum, r) => sum + r.issuesCount, 0);
    
    let scheduleStatus: string;
    let daysAheadBehind: number;

    if (overallCompletion >= 95 && totalIssues === 0) {
        scheduleStatus = 'Ahead of Schedule';
        daysAheadBehind = 5; // Consistent value
    } else if (overallCompletion >= 75 && totalIssues === 0) {
        scheduleStatus = 'On Track';
        daysAheadBehind = 2; // Consistent value
    } else if (overallCompletion > 0) {
        if (totalIssues === 0) {
            scheduleStatus = 'On Track';
            daysAheadBehind = 1; // Consistent value
        } else if (totalIssues <= 2) {
            scheduleStatus = 'Minor Delays';
            daysAheadBehind = -3 * totalIssues; // Deterministic calculation
        } else {
            scheduleStatus = 'Behind Schedule';
            daysAheadBehind = -5 * totalIssues; // Deterministic calculation
        }
    } else { // overallCompletion is 0
        if (totalLocations > 0 && totalIssues > 0) {
             scheduleStatus = 'At Risk';
             daysAheadBehind = -10; // Consistent value for projects at risk
        } else if (totalLocations > 0) {
            scheduleStatus = 'On Track'; // No issues, just not started
            daysAheadBehind = 0;
        } else {
            scheduleStatus = 'Scheduled';
            daysAheadBehind = 0;
        }
    }

    // Determine project timeline progress
    const projectTimeline = this.calculateProjectTimeline(overallCompletion);

    return {
      totalLocations,
      completedLocations,
      overallCompletion,
      projectHealthScore: healthScore,
      scheduleStatus,
      daysAheadBehind,
      projectTimeline
    };
  }

  /**
   * Generate map POIs from projects with location data
   */
  private generateMapPOIs(projects: ProjectWithLocation[]): POI[] {
    return projects
      .filter(p => p.locationData?.latitude && p.locationData?.longitude)
      .map(project => ({
        lat: project.locationData!.latitude!,
        lng: project.locationData!.longitude!,
        text: `${project.name}<br/>${project.locationData!.city}, ${project.locationData!.state}`
      }));
  }

  /**
   * Generate activity feed from recent project updates
   */
  private generateActivityFeed(projects: ProjectWithLocation[]): ActivityItem[] {
    const activities: ActivityItem[] = [];
    
    projects
      .filter(p => p.projectData && p.locationData)
      .slice(0, 5) // Take first 5 projects with data
      .forEach((project, index) => {
        const completion = project.projectData?.overallCompletion || 0;
        const location = `${project.locationData!.city}, ${project.locationData!.state}`;
        
        if (completion === 100) {
          activities.push({
            id: `activity-${project.id}`,
            type: 'success',
            text: `${project.name} completed in ${location}`,
            time: `${index + 1} ${index === 0 ? 'hour' : 'hours'} ago`
          });
        } else if (completion > 80) {
          activities.push({
            id: `activity-${project.id}`,
            type: 'info',
            text: `${project.name} nearing completion in ${location} (${completion}%)`,
            time: `${index + 2} hours ago`
          });
        } else if (completion > 0) {
          activities.push({
            id: `activity-${project.id}`,
            type: 'info',
            text: `Progress update for ${project.name} in ${location} (${completion}%)`,
            time: `${index + 1} day${index > 0 ? 's' : ''} ago`
          });
        }
      });

    return activities;
  }

  /**
   * Helper method to determine the most common phase across projects
   */
  private getMostCommonPhase(projects: ProjectWithLocation[]): string {
    const phaseCount = new Map<string, number>();
    
    projects
      .filter(p => p.projectData?.phases)
      .forEach(project => {
        project.projectData.phases.forEach((phase: any) => {
          const currentCount = phaseCount.get(phase.name) || 0;
          phaseCount.set(phase.name, currentCount + 1);
        });
      });

    if (phaseCount.size === 0) return 'Planning';

    let mostCommonPhase = 'Planning';
    let maxCount = 0;
    
    phaseCount.forEach((count, phase) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonPhase = phase;
      }
    });

    return mostCommonPhase;
  }

  /**
   * Helper method to count issues across projects
   */
  private countIssues(projects: ProjectWithLocation[]): number {
    return projects.filter(p => {
      if (!p.projectData) return false;
      const completion = p.projectData.overallCompletion || 0;
      const taskCount = p.projectData.allTasks?.length || 0;
      
      // Consider a project to have issues if it has low completion relative to task count
      // or if it has been updated recently but has low progress
      return completion < 50 && taskCount > 5;
    }).length;
  }

  /**
   * Helper method to determine schedule status for a region
   */
  private determineScheduleStatus(projects: ProjectWithLocation[], avgCompletion: number): string {
    const issuesCount = this.countIssues(projects);
    
    if (avgCompletion >= 90) return 'Ahead of Schedule';
    if (avgCompletion >= 70 && issuesCount === 0) return 'On Track';
    if (issuesCount <= 1) return 'Minor Delays';
    return 'Behind Schedule';
  }

  /**
   * Calculate overall project health score
   */
  private calculateProjectHealthScore(projects: ProjectWithLocation[], regionalMetrics: RegionalMetrics[]): number {
    const projectsWithData = projects.filter(p => p.projectData && p.locationData);
    
    if (projectsWithData.length === 0) return 0;

    const completionScore = projectsWithData.reduce((sum, p) => sum + (p.projectData?.overallCompletion || 0), 0) / projectsWithData.length;
    const issuesScore = Math.max(0, 100 - (regionalMetrics.reduce((sum, r) => sum + r.issuesCount, 0) * 10));
    const dataQualityScore = (projectsWithData.length / projects.length) * 100;

    return Math.round((completionScore * 0.5 + issuesScore * 0.3 + dataQualityScore * 0.2));
  }

  /**
   * Calculate project timeline phase based on overall completion
   */
  private calculateProjectTimeline(completion: number) {
    const phases = ['Planning', 'Permitting', 'Production', 'Shipping', 'Installation', 'Close-out'];
    
    // Map completion percentage to phase index
    if (completion >= 100) {
      return { phases, currentPhaseIndex: 5 }; // Close-out
    } else if (completion >= 80) {
      return { phases, currentPhaseIndex: 4 }; // Installation
    } else if (completion >= 60) {
      return { phases, currentPhaseIndex: 3 }; // Shipping
    } else if (completion >= 40) {
      return { phases, currentPhaseIndex: 2 }; // Production
    } else if (completion >= 15) {
      return { phases, currentPhaseIndex: 1 }; // Permitting
    } else {
      return { phases, currentPhaseIndex: 0 }; // Planning
    }
  }

  /**
   * Clear cache for a specific folder or all cache
   */
  clearCache(folderId?: string): void {
    if (folderId) {
      this.cache.delete(folderId);
      console.log(`🧹 [RegionalAggregator] Cleared cache for folder: ${folderId}`);
    } else {
      this.cache.clear();
      console.log(`🧹 [RegionalAggregator] Cleared all cache`);
    }
  }
}

// Singleton instance
export const regionalDataAggregator = new RegionalDataAggregator(); 