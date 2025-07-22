# ClickUp Integration Plan

## Current Status: Phase 2 Complete - Moving to Phase 3

✅ **Phase 1: Data Verification** - COMPLETED
✅ **Phase 2: Data Aggregation Engine** - COMPLETED  
🔄 **Phase 3: UI Connection** - IN PROGRESS

---

## Project Intake List Structure (Master Location Data)

**List ID:** `901314460682`

### Naming Convention
Each task in Project Intake follows this convention:
**`{Parent Folder Name} - {List Name}`**

Examples:
- `Crumbl - Dallas Location` → Links to `Dallas Location` list in `Crumbl` folder
- `Crumbl - Forest Crumbl` → Links to `Forest Crumbl` list in `Crumbl` folder

### Custom Fields Added In Project Intake List
- **Latitude** (Number) - Geographic latitude coordinate
- **Longitude** (Number) - Geographic longitude coordinate

### Current Location Data
1. **Crumbl - Dallas Location**
   - Address: 123 Main St, Dallas, TX 75201
   - Coordinates: 32.7767, -96.797
   - Project Type: New Install

2. **Crumbl - Forest Crumbl**
   - Address: 456 Oak Ave, Forest Hills, NY 11375  
   - Coordinates: 40.7196, -73.8448
   - Project Type: New Install

---

## Data Flow Architecture

### 1. LocationProvider Service
- Fetches all tasks from Project Intake list
- Extracts location data from custom fields
- Uses naming convention to match projects: `"Dallas Location"` matches `"Crumbl - Dallas Location"`
- Groups locations by region using STATE_TO_REGION_MAPPING

### 2. RegionalDataAggregator Service  
- Fetches all ClickUp projects via getUserProjects()
- Links each project to location data via LocationProvider
- Calculates regional metrics (completion %, issues, active projects, phases)
- Generates dashboard-ready data structure

### 3. Dynamic Dashboard Views
- `DynamicOverviewView` - Shows aggregated regional data from all ClickUp projects
- Toggle between static demo data and live ClickUp data
- Regional breakdown with state-level details

---

## Technical Implementation

### Fuzzy Matching Logic
Our LocationProvider handles project-to-location linking with multiple fallback strategies:

1. **Exact Match**: `"Dallas Location"` → `"Dallas Location"`
2. **Convention Match**: `"Dallas Location"` → `"Crumbl - Dallas Location"` 
3. **Keyword Match**: Shared words between project and location names
4. **Demo Fallback**: For testing purposes

### Regional Mapping
Projects are assigned to regions based on the **State** field from Project Intake:
- **Northeast**: NY, NJ, MA, CT, etc.
- **Southeast**: TX, FL, GA, NC, etc.  
- **Midwest**: IL, IN, OH, MI, etc.
- **West**: CA, WA, OR, AZ, etc.

---

## Next Steps

### Phase 3: UI Connection (Current)
- [x] Connect aggregated data to OverviewView  
- [ ] Connect filtered data to SoutheastView
- [ ] Test with real project data
- [ ] Enhance project name matching if needed

### Future Enhancements
- Add caching layer for better performance
- Implement real-time data updates
- Add more granular location filtering
- Consider ClickUp webhook integration for live updates

---

## Notes
- Project Intake serves as the "master location table" - similar to Odoo's crm.contacts
- Each physical store location has one entry in Project Intake
- Individual project lists (Dallas Location, Forest Crumbl, etc.) contain the tasks/workflow
- Location data flows from Project Intake → LocationProvider → RegionalAggregator → Dashboard UI 