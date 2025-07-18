import { Region, POI, RegionStatus, StateProgress, ActivityItem, MetricCard, AIResponse } from '@/types/dashboard';

export const REGIONS: Record<string, Region> = {
  "Northeast": {
    name: "Northeast",
    states: ["Maine", "New Hampshire", "Vermont", "Massachusetts", "Rhode Island", "Connecticut", "New York", "Pennsylvania", "New Jersey"],
    status: "to_be_started"
  },
  "Southeast": {
    name: "Southeast", 
    states: ["Texas", "Oklahoma", "Arkansas", "Louisiana", "Mississippi", "Alabama", "Georgia", "Florida", "South Carolina", "North Carolina", "Tennessee", "Kentucky", "West Virginia", "Virginia", "Maryland", "Delaware", "District of Columbia"],
    status: "current"
  },
  "Midwest": {
    name: "Midwest",
    states: ["North Dakota", "South Dakota", "Nebraska", "Kansas", "Minnesota", "Iowa", "Missouri", "Wisconsin", "Illinois", "Indiana", "Michigan", "Ohio"],
    status: "finished"
  },
  "West": {
    name: "West",
    states: ["Washington", "Oregon", "California", "Idaho", "Nevada", "Utah", "Arizona", "Montana", "Wyoming", "Colorado", "New Mexico"],
    status: "finished"
  }
};

export const POIS: POI[] = [
  { lat: 37.568203, lng: -77.71166, text: "Midlothian<br>VA" },
  { lat: 38.449296, lng: -77.461177, text: "Stafford<br>VA" },
  { lat: 28.062, lng: -82.413225, text: "University Park<br>FL (Sarasota UTC)" },
  { lat: 35.812933, lng: -78.627485, text: "F45 training - Raleigh<br>NC (Five Points)" },
  { lat: 32.814405, lng: -96.78501, text: "Dallas<br>TX (Old East Dallas)" },
  { lat: 40.940311, lng: -73.96092, text: "F45 - Cresskill<br>NJ" },
  { lat: 29.647048, lng: -98.622749, text: "San Antonio<br>TX" },
  { lat: 39.96, lng: -85.919452, text: "F45 - Fishers Geist<br>IN" },
  { lat: 29.753133, lng: -95.388518, text: "FS8 Studios- Houston<br>TX" },
  { lat: 32.571582, lng: -97.089052, text: "Mansfield<br>TX" },
  { lat: 40.054016, lng: -74.137126, text: "Brick<br>NJ" },
  { lat: 41.29034, lng: -96.213792, text: "Elkhorn<br>NE" },
  { lat: 40.967055, lng: -74.243376, text: "Wayne<br>NJ" },
  { lat: 32.795547, lng: -79.93986, text: "Charleston<br>SC" },
  { lat: 36.334708, lng: -94.15875, text: "Rogers<br>AR" },
  { lat: 29.692688, lng: -95.439841, text: "Houston<br>TX (Central Houston)" },
  { lat: 42.075345, lng: -88.184541, text: "South Barrington<br>IL" },
  { lat: 30.613509, lng: -96.317607, text: "College Station<br>TX" },
  { lat: 33.484772, lng: -117.078876, text: "Temecula<br>CA" },
  { lat: 41.786577, lng: -72.745705, text: "F45 training - West Hartford<br>CT" },
  { lat: 40.411357, lng: -104.995398, text: "Loveland<br>CO" },
  { lat: 32.457036, lng: -96.990869, text: "Midlothian<br>TX" },
  { lat: 38.838472, lng: -104.780239, text: "Jimmy Donnellon" },
  { lat: 32.791792, lng: -96.808697, text: "Dallas<br>TX" },
  { lat: 30.226845, lng: -97.760258, text: "Austin<br>TX (SOCO)" },
  { lat: 30.359974, lng: -91.107708, text: "Baton Rouge<br>LA" },
  { lat: 29.745215, lng: -95.596531, text: "Houston<br>TX" },
  { lat: 40.296319, lng: -74.299261, text: "Manalapan<br>NJ" },
  { lat: 41.939499, lng: -87.667455, text: "F45 Training - Chicago<br>IL (Roscoe Village)" },
  { lat: 42.024258, lng: -87.850469, text: "West Park Ridge<br>IL" },
  { lat: 39.594139, lng: -104.857006, text: "Engelwood<br>CO (Centennial)" },
  { lat: 39.981696, lng: -75.12769, text: "FS8 Studios - Philadelphia<br>PA" },
  { lat: 40.746688, lng: -74.038106, text: "Hoboken North<br>NJ" },
  { lat: 42.559619, lng: -71.137734, text: "Wilmington<br>MA" },
  { lat: 31.709123, lng: -97.248878, text: "Waco<br>TX" }
];

export const REGION_STATUS_DATA: RegionStatus[] = [
  {
    name: "Northeast",
    completedStores: 0,
    totalStores: 195,
    status: "planned"
  },
  {
    name: "Southeast", 
    completedStores: 102,
    totalStores: 210,
    status: "in-progress"
  },
  {
    name: "Midwest",
    completedStores: 185,
    totalStores: 185,
    status: "completed"
  },
  {
    name: "West",
    completedStores: 210,
    totalStores: 210,
    status: "completed"
  }
];

export const SOUTHEAST_STATES: StateProgress[] = [
  {
    name: "Texas",
    completed: "28/52",
    currentPhase: "Installation",
    status: "ahead",
    issues: 1,
    lastUpdated: "2 hours ago"
  },
  {
    name: "Florida",
    completed: "18/31", 
    currentPhase: "Installation",
    status: "on-track",
    issues: 0,
    lastUpdated: "4 hours ago"
  },
  {
    name: "Georgia",
    completed: "15/24",
    currentPhase: "Installation", 
    status: "on-track",
    issues: 0,
    lastUpdated: "1 day ago"
  },
  {
    name: "North Carolina",
    completed: "12/22",
    currentPhase: "Shipping",
    status: "behind",
    issues: 1,
    hasAISummary: true,
    aiSummaryData: "north-carolina",
    lastUpdated: "6 hours ago"
  },
  {
    name: "Virginia",
    completed: "11/19",
    currentPhase: "Installation",
    status: "on-track", 
    issues: 0,
    lastUpdated: "3 hours ago"
  },
  {
    name: "South Carolina",
    completed: "9/15",
    currentPhase: "Installation",
    status: "on-track",
    issues: 0,
    lastUpdated: "1 day ago"
  },
  {
    name: "Tennessee",
    completed: "6/13",
    currentPhase: "Shipping",
    status: "on-track",
    issues: 0,
    lastUpdated: "8 hours ago"
  },
  {
    name: "Maryland",
    completed: "3/11", 
    currentPhase: "Production",
    status: "on-track",
    issues: 0,
    lastUpdated: "5 hours ago"
  },
  {
    name: "Alabama",
    completed: "0/8",
    currentPhase: "Permitting",
    status: "on-track",
    issues: 0,
    lastUpdated: "2 days ago"
  },
  {
    name: "Other States",
    completed: "0/15",
    currentPhase: "Planning",
    status: "scheduled",
    issues: 0,
    lastUpdated: "1 week ago"
  }
];

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "1",
    type: "success",
    text: "3 locations completed in Houston, TX",
    time: "2 hours ago"
  },
  {
    id: "2", 
    type: "info",
    text: "Permit approved for Charlotte, NC batch",
    time: "6 hours ago"
  },
  {
    id: "3",
    type: "warning",
    text: "Weather delay resolved in Raleigh, NC", 
    time: "1 day ago"
  },
  {
    id: "4",
    type: "success",
    text: "Production shipment arrived in Atlanta",
    time: "2 days ago"
  },
  {
    id: "5",
    type: "info",
    text: "Virginia batch entered installation phase",
    time: "3 days ago"
  }
];

export const OVERVIEW_METRICS: MetricCard[] = [
  {
    number: "87%",
    label: "Project Health Score",
    status: { type: "good", text: "Good" }
  },
  {
    number: "7 days", 
    label: "Ahead of Schedule",
    status: { type: "ahead", text: "Ahead" }
  }
];

export const SOUTHEAST_METRICS: MetricCard[] = [
  {
    number: "102/210",
    label: "Locations Completed",
    status: { type: "ahead", text: "49% Complete" }
  },
  {
    number: "7 days",
    label: "Ahead of Schedule", 
    status: { type: "ahead", text: "On Track" }
  },
  {
    number: "Installation",
    label: "Current Phase",
    status: { type: "on-track", text: "Active" }
  },
  {
    number: "2",
    label: "Locations Need Attention",
    status: { type: "behind", text: "Action Required" }
  }
];

export const AI_RESPONSES: Record<string, AIResponse> = {
  'project-status': {
    user: "Get project status summary",
    ai: "📊 **Project Status Summary**\n\n✅ **Overall Health:** 87% - Good\n⏰ **Timeline:** 7 days ahead of schedule\n📍 **Current Focus:** Southeast region (49% complete)\n\n**Key Metrics:**\n• 497/800 locations completed (62%)\n• 2 regions fully completed (West, Midwest)\n• 1 active region with strong progress\n• 0 critical blockers\n\n**Next 30 Days:** Complete Southeast region, begin Northeast planning phase."
  },
  'southeast-update': {
    user: "Southeast region update", 
    ai: "🎯 **Southeast Region Update**\n\n**Progress:** 102/210 locations (49%)\n**Status:** 7 days ahead of schedule ✨\n**Current Phase:** Installation\n\n**State Breakdown:**\n• Texas: 28/52 (Leading, 1 minor issue)\n• Florida: 18/31 (On track)\n• Georgia: 15/24 (On track)\n• N. Carolina: 12/22 (Behind due to permits)\n\n**Immediate Actions Needed:**\n🚨 Dallas Downtown, TX - Permit amendment\n⚠️ Charlotte Metro, NC - Material delivery\n\n**Forecast:** Region completion by Dec 28 (original target: Jan 4)"
  },
  'upcoming-deadlines': {
    user: "Show upcoming deadlines",
    ai: "⏰ **Upcoming Deadlines & Milestones**\n\n**This Week:**\n• Dec 12: Dallas permit amendment resolution\n• Dec 13: 4 permit applications due (Alabama)\n• Dec 15: Alabama → Production phase transition\n\n**Next Week:**\n• Dec 18-22: 18 installations scheduled\n• Dec 20: Crew rotation in Southeast\n• Dec 22: 6 production shipments arriving\n\n**Month End:**\n• Dec 28: Southeast region target completion\n• Dec 31: Q4 milestone review\n\n**Critical Path:** Maintain Alabama timeline to avoid Northeast delays."
  },
  'resource-allocation': {
    user: "Resource allocation analysis",
    ai: "👥 **Resource Allocation Analysis**\n\n**Current Capacity:**\n• 6 active installation crews\n• 2 standby crews available\n• 22-25 locations/week throughput\n\n**Utilization:**\n• Southeast: 85% capacity (optimal)\n• Support teams: 78% utilization\n• Equipment: 92% availability\n\n**Recommendations:**\n🔄 **Crew Rotation:** Dec 20th as planned\n📈 **Capacity Boost:** Add 1 crew for Northeast launch\n⚡ **Bottleneck:** Urban permit processing (not crew-related)\n\n**Cost Efficiency:** 3% under budget due to early completions"
  },
  'issue-resolution': {
    user: "Help resolve current issues",
    ai: "🚨 **Current Issues & Resolutions**\n\n**Issue #1: Dallas Downtown, TX**\n• Problem: Permit amendment required\n• Impact: 2 days behind schedule\n• Resolution: Amendment submitted Dec 10\n• Expected Clear: Dec 12\n• Action: Monitor city review process\n\n**Issue #2: Charlotte Metro, NC**\n• Problem: Material delivery delay\n• Impact: 1 day behind schedule\n• Resolution: Expedited shipping arranged\n• Expected Delivery: Tomorrow AM\n• Action: Crew standing by for install\n\n**Preventive Measures:**\n✅ Buffer inventory increased by 15%\n✅ Backup permit applications filed earlier\n\n**Risk Level:** Low - both issues have clear resolution paths"
  },
  'leave-message': {
    user: "Leave message with team",
    ai: "💬 **Message Center**\n\nI can help you send a message to:\n\n🏗️ **Field Operations Team**\n📋 **Project Managers**\n🎯 **Regional Coordinators**\n📊 **Executive Dashboard**\n\n**Quick Messages:**\n• Request status update\n• Report field observations\n• Escalate urgent issue\n• Schedule coordination call\n• Resource request\n\n*Note: All messages are logged and routed to appropriate team members based on urgency and content.*\n\nWhat would you like to communicate?"
  }
}; 