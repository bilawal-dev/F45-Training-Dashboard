import React, { useState, useEffect } from 'react';
import { ChevronDown, Briefcase, Search, Folder, Loader2 } from 'lucide-react';

interface ClickUpProject {
  id: string;
  name: string;
  customerFolder: string;
  folderId: string;
  spaceId: string;
  spaceName: string;
  taskCount: number;
  archived: boolean;
}

interface ProjectSelectorHeaderProps {
  onFolderSelect?: (folderId: string, folderName: string) => void;
  selectedFolderName?: string;
}

const ProjectSelectorHeader: React.FC<ProjectSelectorHeaderProps> = ({
  onFolderSelect,
  selectedFolderName
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(selectedFolderName || null);
  const [projects, setProjects] = useState<ClickUpProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load projects from ClickUp API directly (no backend dependency)
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoadingProjects(true);
      
      try {
        
        // Import ClickUpAPIService dynamically to avoid SSR issues
        const { ClickUpAPIService } = await import('@/services/clickupAPI');
        const allProjects = await ClickUpAPIService.getUserProjects();

        if (allProjects && allProjects.length > 0) {
          // Filter out archived projects and sort by customer folder
          const activeProjects = allProjects
            .filter((project: ClickUpProject) => !project.archived)
            .sort((a: ClickUpProject, b: ClickUpProject) => {
              // Sort by customer folder first, then by name
              if (a.customerFolder !== b.customerFolder) {
                return a.customerFolder.localeCompare(b.customerFolder);
              }
              return a.name.localeCompare(b.name);
            });

          setProjects(activeProjects);
        } else {
          console.warn('⚠️ [ProjectSelector] No projects returned from ClickUp');
          setProjects([]);
        }

      } catch (error) {
        console.error('❌ [ProjectSelector] Failed to load projects:', error);
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const handleFolderSelect = (folderName: string, folderId: string) => {
    setSelectedFolder(folderName);
    setShowProjectDropdown(false);
    setSearchTerm('');
        
    if (onFolderSelect) {
      onFolderSelect(folderId, folderName);
    }
  };

  const getFilteredProjects = () => {
    if (!searchTerm.trim()) return projects;

    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customerFolder.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const clearSelection = () => {
    setSelectedFolder(null);
    if (onFolderSelect) {
      onFolderSelect('', ''); // Clear the selection
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Regional Performance Overview</h1>
          {selectedFolder && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span>Currently viewing: <span className="font-medium">{selectedFolder}</span></span>
              <button
                onClick={clearSelection}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProjectDropdown(!showProjectDropdown);
              // Clear search when opening
              if (!showProjectDropdown) {
                setSearchTerm('');
              }
            }}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Briefcase className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium truncate">
              {selectedFolder || (isLoadingProjects ? 'Loading...' : 'Select Location')}
            </span>
            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
            {isLoadingProjects && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
          </button>

          {showProjectDropdown && (
            <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[320px] max-h-[400px] overflow-hidden flex flex-col">
              {/* Header and Search */}
              <div className="p-3 border-b border-gray-100">
                <div className="font-semibold text-sm text-gray-800 mb-2">Franchise Locations</div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search folders or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-2">
                {/* Loading State */}
                {isLoadingProjects && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Loading locations...</span>
                  </div>
                )}

                {/* Franchise Locations by Customer Folder */}
                {!isLoadingProjects && projects.length > 0 && (
                  <div className="space-y-1">
                    {(() => {
                      // Group filtered projects by customer folder
                      const filteredProjects = getFilteredProjects();
                      const groupedProjects = filteredProjects.reduce((groups, project) => {
                        const customerFolder = project.customerFolder || 'No Folder';
                        if (!groups[customerFolder]) {
                          groups[customerFolder] = [];
                        }
                        groups[customerFolder].push(project);
                        return groups;
                      }, {} as Record<string, ClickUpProject[]>);

                      return Object.entries(groupedProjects)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([customerFolder, locations]) => {
                          // For folder selection, we need the folderId from any project in the folder
                          const folderId = locations[0]?.folderId || '';
                          
                          return (
                            <button
                              key={customerFolder}
                              onClick={() => window.location.href = `/?folderId=${folderId}`}
                              className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors group ${
                                selectedFolder === customerFolder
                                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500 font-semibold'
                                  : 'hover:bg-gray-100 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-500 transition-transform ${
                                        selectedFolder === customerFolder ? 'rotate-0' : '-rotate-90'
                                    }`}
                                />
                                <Folder className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-800">
                                  {customerFolder}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                {locations.length}
                              </span>
                            </button>
                          );
                        });
                    })()}
                  </div>
                )}

                {/* Empty State */}
                {!isLoadingProjects && projects.length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-1">No franchise locations found</div>
                    <div className="text-xs text-gray-500">Check your ClickUp API configuration</div>
                  </div>
                )}

                {/* No Search Results */}
                {!isLoadingProjects && projects.length > 0 && getFilteredProjects().length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-1">No matches found</div>
                    <div className="text-xs text-gray-500">Try a different search term</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectorHeader; 