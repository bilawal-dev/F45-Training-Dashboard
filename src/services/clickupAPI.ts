// ClickUp API Service for F45 Dashboard
// This service handles all ClickUp API interactions directly from frontend

const API_TOKEN = process.env.NEXT_PUBLIC_CLICKUP_API_TOKEN;
const BASE_URL = 'https://api.clickup.com/api/v2';

// Known IDs from ClickUp configuration
export const KNOWN_IDS = {
    teamId: '9013410499',
    templatesSpaceId: '90131823880',
    // projectsSpaceId: '90137209740',
    projectsSpaceId: '90137498382', // Brandon's test space "Brandon's copy"
    // projectIntakeListId: '901314460682',
    projectIntakeListId: '901316852775', // Brandon's test space "Brandon's copy" project intake list
    franchiseTemplateListId: '901314428250',
    customFields: {
        percentComplete: 'e50bab98-75cd-40c2-a193-ce2811e1713b',
        phase: 'e024c849-5312-44c7-8c28-d3642fc4163a'
    }
};

// Phase mapping from ClickUp to F45 Dashboard
export const CLICKUP_TO_F45_PHASE_MAPPING = {
    0: { name: 'DUE DILIGENCE/PLANNING', f45Phase: 'Planning', color: '#1bbc9c', emoji: '📊' },
    1: { name: 'DESIGN', f45Phase: 'Planning', color: '#1bbc9c', emoji: '🎨' },
    2: { name: 'FRANCHISE APPROVAL', f45Phase: 'Permitting', color: '#1bbc9c', emoji: '✅' },
    3: { name: 'LANDLORD APPROVAL', f45Phase: 'Permitting', color: '#1bbc9c', emoji: '🏢' },
    4: { name: 'ESTIMATING', f45Phase: 'Planning', color: '#1bbc9c', emoji: '💰' },
    5: { name: 'FRANCHISEE APPROVAL', f45Phase: 'Permitting', color: '#1bbc9c', emoji: '👥' },
    6: { name: 'PERMITTING', f45Phase: 'Permitting', color: '#1bbc9c', emoji: '📝' },
    7: { name: 'PRODUCTION', f45Phase: 'Production', color: '#1bbc9c', emoji: '🏭' },
    8: { name: 'SHIPPING', f45Phase: 'Shipping', color: '#1bbc9c', emoji: '🚚' },
    9: { name: 'INSTALLATION', f45Phase: 'Installation', color: '#1bbc9c', emoji: '🔧' },
    10: { name: 'PROJECT CLOSE-OUT', f45Phase: 'Close-out', color: '#1bbc9c', emoji: '✅' }
};

// F45 Phases in order
export const F45_PHASES = ['Planning', 'Permitting', 'Production', 'Shipping', 'Installation', 'Close-out'];

// Regional mapping - we'll map ClickUp projects to regions based on naming or custom fields
export const STATE_TO_REGION_MAPPING: Record<string, string> = {
    // Northeast
    'ME': 'Northeast', 'NH': 'Northeast', 'VT': 'Northeast', 'MA': 'Northeast', 'RI': 'Northeast', 
    'CT': 'Northeast', 'NY': 'Northeast', 'PA': 'Northeast', 'NJ': 'Northeast',
    'Maine': 'Northeast', 'New Hampshire': 'Northeast', 'Vermont': 'Northeast', 'Massachusetts': 'Northeast',
    'Rhode Island': 'Northeast', 'Connecticut': 'Northeast', 'New York': 'Northeast', 'Pennsylvania': 'Northeast', 'New Jersey': 'Northeast',

    // Southeast
    'TX': 'Southeast', 'OK': 'Southeast', 'AR': 'Southeast', 'LA': 'Southeast', 'MS': 'Southeast', 
    'AL': 'Southeast', 'GA': 'Southeast', 'FL': 'Southeast', 'SC': 'Southeast', 'NC': 'Southeast', 
    'TN': 'Southeast', 'KY': 'Southeast', 'WV': 'Southeast', 'VA': 'Southeast', 'MD': 'Southeast', 
    'DE': 'Southeast', 'DC': 'Southeast',
    'Texas': 'Southeast', 'Oklahoma': 'Southeast', 'Arkansas': 'Southeast', 'Louisiana': 'Southeast',
    'Mississippi': 'Southeast', 'Alabama': 'Southeast', 'Georgia': 'Southeast', 'Florida': 'Southeast',
    'South Carolina': 'Southeast', 'North Carolina': 'Southeast', 'Tennessee': 'Southeast', 'Kentucky': 'Southeast',
    'West Virginia': 'Southeast', 'Virginia': 'Southeast', 'Maryland': 'Southeast', 'Delaware': 'Southeast', 'District of Columbia': 'Southeast',

    // Midwest
    'ND': 'Midwest', 'SD': 'Midwest', 'NE': 'Midwest', 'KS': 'Midwest', 'MN': 'Midwest', 
    'IA': 'Midwest', 'MO': 'Midwest', 'WI': 'Midwest', 'IL': 'Midwest', 'IN': 'Midwest', 
    'MI': 'Midwest', 'OH': 'Midwest',
    'North Dakota': 'Midwest', 'South Dakota': 'Midwest', 'Nebraska': 'Midwest', 'Kansas': 'Midwest',
    'Minnesota': 'Midwest', 'Iowa': 'Midwest', 'Missouri': 'Midwest', 'Wisconsin': 'Midwest',
    'Illinois': 'Midwest', 'Indiana': 'Midwest', 'Michigan': 'Midwest', 'Ohio': 'Midwest',

    // West
    'WA': 'West', 'OR': 'West', 'CA': 'West', 'ID': 'West', 'NV': 'West', 'UT': 'West', 
    'AZ': 'West', 'MT': 'West', 'WY': 'West', 'CO': 'West', 'NM': 'West',
    'Washington': 'West', 'Oregon': 'West', 'California': 'West', 'Idaho': 'West', 'Nevada': 'West',
    'Utah': 'West', 'Arizona': 'West', 'Montana': 'West', 'Wyoming': 'West', 'Colorado': 'West', 'New Mexico': 'West'
};

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${BASE_URL}${endpoint}`;


    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': API_TOKEN || '',
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ [ClickUp API] Error (${response.status}):`, errorText);
            throw new Error(`ClickUp API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`❌ [ClickUp API] Failed for ${endpoint}:`, error);
        throw error;
    }
};

// Timeline calculation helpers
const calculateProjectTimeline = (allTasks: any[]) => {
    const tasksWithDates = allTasks.filter(task => task.dueDate || task.startDate);

    if (tasksWithDates.length === 0) {
        console.warn('⚠️ No tasks with dates found, using default timeline');
        return {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            duration: 30,
            timelineType: 'daily' as const
        };
    }

    const dates: Date[] = [];
    tasksWithDates.forEach(task => {
        if (task.startDate) dates.push(new Date(parseInt(task.startDate)));
        if (task.dueDate) dates.push(new Date(parseInt(task.dueDate)));
    });

    const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    let timelineType: 'daily' | 'weekly' | 'monthly' = 'daily';
    if (duration > 90) {
        timelineType = 'monthly';
    } else if (duration > 30) {
        timelineType = 'weekly';
    }

    return { startDate, endDate, duration, timelineType };
};

// Main ClickUp API service class
export class ClickUpAPIService {

    // Test API connection
    static async testConnection() {

        try {
            const teams = await apiCall('/team');

            if (teams.teams && teams.teams.length > 0) {
                return { success: true, teams: teams.teams };
            } else {
                console.warn('⚠️ [ClickUp] Connected but no teams found');
                return { success: true, teams: [] };
            }
        } catch (error) {
            console.error('❌ [ClickUp] API connection failed:', error);
            return { success: false, error: (error as Error).message };
        }
    }

    // Get all user projects (locations)
    static async getUserProjects() {

        try {
            // Get projects space structure
            const projectsSpace = await ClickUpAPIService.getProjectsSpace();
            if (!projectsSpace) {
                throw new Error('Projects space not found');
            }

            // Get folders and direct lists
            const [foldersData, directListsData] = await Promise.allSettled([
                apiCall(`/space/${projectsSpace.id}/folder`),
                apiCall(`/space/${projectsSpace.id}/list`)
            ]);

            const allProjects: any[] = [];

            // Process customer folders in parallel
            if (foldersData.status === 'fulfilled' && foldersData.value.folders) {
                const folderListPromises = foldersData.value.folders.map((folder: any) =>
                    apiCall(`/folder/${folder.id}/list`)
                        .then(listsData => ({ folder, listsData }))
                        .catch(err => {
                            console.warn(`⚠️ [ClickUp] Could not fetch lists for folder ${folder.name}:`, err);
                            return null;
                        })
                );

                const folderResults = await Promise.all(folderListPromises);
                folderResults
                    .filter(Boolean)
                    .forEach(({ folder, listsData }) => {
                        if (listsData.lists) {
                            listsData.lists.forEach((list: any) => {
                                allProjects.push({
                                    id: list.id,
                                    name: list.name,
                                    customerFolder: folder.name,
                                    folderId: folder.id,
                                    spaceId: projectsSpace.id,
                                    spaceName: projectsSpace.name,
                                    taskCount: list.task_count || 0,
                                    url: list.url,
                                    archived: list.archived || false
                                });
                            });
                        }
                    });
            }

            // Process direct lists
            if (directListsData.status === 'fulfilled' && directListsData.value.lists) {

                directListsData.value.lists.forEach((list: any) => {
                    allProjects.push({
                        id: list.id,
                        name: list.name,
                        customerFolder: 'No Folder',
                        folderId: null,
                        spaceId: projectsSpace.id,
                        spaceName: projectsSpace.name,
                        taskCount: list.task_count || 0,
                        url: list.url,
                        archived: list.archived || false
                    });
                });
            }

            return allProjects;

        } catch (error) {
            console.error('❌ [ClickUp] Error fetching user projects:', error);
            throw error;
        }
    }

    // Get projects space details
    static async getProjectsSpace() {
        try {
            const spacesData = await apiCall(`/team/${KNOWN_IDS.teamId}/space`);
            const projectsSpace = spacesData.spaces?.find((space: any) => space.id === KNOWN_IDS.projectsSpaceId);

            if (projectsSpace) {
                return projectsSpace;
            } else {
                console.warn(`⚠️ [ClickUp] Projects space with ID ${KNOWN_IDS.projectsSpaceId} not found`);
                return null;
            }
        } catch (error) {
            console.error('❌ [ClickUp] Error fetching Projects space:', error);
            return null;
        }
    }

    // Get tasks for a specific project
    static async getProjectTasks(projectId: string) {

        try {
            const data = await apiCall(`/list/${projectId}/task?include_closed=true&include_subtasks=true`);
            return data;
        } catch (error) {
            console.error(`❌ [ClickUp] Error fetching tasks for project ${projectId}:`, error);
            throw error;
        }
    }

    // Get processed template data (for understanding the structure)
    static async getTemplateData() {

        try {
            const [listDetails, tasksData] = await Promise.all([
                apiCall(`/list/${KNOWN_IDS.franchiseTemplateListId}`),
                apiCall(`/list/${KNOWN_IDS.franchiseTemplateListId}/task?include_closed=true&include_subtasks=true`)
            ]);


            return {
                listDetails,
                tasks: tasksData.tasks || []
            };
        } catch (error) {
            console.error('❌ [ClickUp] Error fetching template data:', error);
            throw error;
        }
    }

    // Process a project and return F45 dashboard compatible data
    static async getProcessedProjectData(projectId: string) {

        try {
            const [projectDetails, tasksData] = await Promise.all([
                apiCall(`/list/${projectId}`),
                ClickUpAPIService.getProjectTasks(projectId)
            ]);

            const phaseGroups: Record<string, any> = {};
            const allTasks: any[] = [];

            console.log('clickup api - projectDetails', projectDetails);
            console.log('clickup api - tasksData', tasksData);

            if (tasksData.tasks) {
                tasksData.tasks.forEach((task: any) => {
                    // Find phase field
                    const phaseField = task.custom_fields?.find((f: any) =>
                        f.name?.toLowerCase().includes('phase') || f.id === KNOWN_IDS.customFields.phase
                    );

                    let phaseValue = 0; // default to phase 0
                    if (phaseField?.value) {
                        if (typeof phaseField.value === 'number') {
                            phaseValue = phaseField.value;
                        } else if (phaseField.value.orderindex !== undefined) {
                            phaseValue = phaseField.value.orderindex;
                        }
                    }

                    // Find percent complete field
                    const percentField = task.custom_fields?.find((f: any) =>
                        f.name?.toLowerCase().includes('complete') ||
                        f.name?.toLowerCase().includes('%') ||
                        f.id === KNOWN_IDS.customFields.percentComplete
                    );

                    const percentComplete = parseInt(percentField?.value || '0');
                    const f45Phase = CLICKUP_TO_F45_PHASE_MAPPING[phaseValue as keyof typeof CLICKUP_TO_F45_PHASE_MAPPING]?.f45Phase || 'Planning';

                    const processedTask = {
                        id: task.id,
                        name: task.name,
                        status: task.status?.status || 'to do',
                        percentComplete,
                        phase: phaseValue,
                        phaseName: CLICKUP_TO_F45_PHASE_MAPPING[phaseValue as keyof typeof CLICKUP_TO_F45_PHASE_MAPPING]?.name || `Phase ${phaseValue}`,
                        f45Phase,
                        url: task.url,
                        dueDate: task.due_date,
                        startDate: task.start_date
                    };

                    allTasks.push(processedTask);

                    if (!phaseGroups[f45Phase]) {
                        phaseGroups[f45Phase] = {
                            name: f45Phase,
                            tasks: [],
                            totalTasks: 0,
                            completedTasks: 0,
                            averageCompletion: 0
                        };
                    }

                    phaseGroups[f45Phase].tasks.push(processedTask);
                });

                // Calculate phase statistics
                Object.values(phaseGroups).forEach((phase: any) => {
                    phase.totalTasks = phase.tasks.length;
                    phase.completedTasks = phase.tasks.filter((t: any) => t.percentComplete === 100).length;
                    const totalCompletion = phase.tasks.reduce((sum: number, t: any) => sum + t.percentComplete, 0);
                    phase.averageCompletion = Math.round(totalCompletion / phase.totalTasks);
                });
            }

            const timeline = calculateProjectTimeline(allTasks);
            const overallCompletion = allTasks.length > 0 ?
                Math.round(allTasks.reduce((sum, t) => sum + t.percentComplete, 0) / allTasks.length) : 0;


            return {
                projectDetails,
                phases: Object.values(phaseGroups),
                allTasks,
                timeline,
                overallCompletion,
                summary: {
                    totalPhases: Object.keys(phaseGroups).length,
                    totalTasks: allTasks.length,
                    overallCompletion
                }
            };

        } catch (error) {
            console.error(`❌ [ClickUp] Error processing project data for ${projectId}:`, error);
            throw error;
        }
    }
}