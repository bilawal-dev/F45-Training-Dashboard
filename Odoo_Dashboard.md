# Project Context & Implementation Plan: ClickUp/Odoo Dashboard

## 1. Project Goal

The primary objective is to replace the hardcoded mock data in the F45-style project dashboard with live data. The data will be sourced from **ClickUp** for project and task management, and enriched with location data from **Odoo** and a **Geocoding API**. The end result should be a dynamic, multi-brand "owner's view" dashboard that retains the geographic UI structure (Regions -> States -> Locations).

---

## 2. Current State & The Challenge

* **Current State**: The UI is built with two main views: `OverviewView.tsx` (showing national regions) and `SoutheastView.tsx` (a drill-down for a specific region). All data in these components is currently static and hardcoded.
* **The Core Challenge**: The data from ClickUp is organized by **Franchise Brand** and **Project**, but it lacks the essential geographic information (Address, State, Region, Lat/Long) required to populate the map and the geographically structured tables in the UI.
* **Initial Analysis**: The `clickup-data-explorer.ts` script confirmed that while we can fetch projects and group them by brand (e.g., Crumbl, F45), location data is not readily available in the main project/task entities.

---

## 3. The Confirmed Solution & Data Flow

After analyzing the conversations, the definitive plan is to create a data pipeline that combines information from multiple sources.

### Data Flow Diagram:

Of course! Here is the markdown file content generated from the context you provided. It synthesizes the problem, conversations, and code files into a clear, actionable plan for implementation.

Markdown

# Project Context & Implementation Plan: ClickUp/Odoo Dashboard

## 1. Project Goal

The primary objective is to replace the hardcoded mock data in the F45-style project dashboard with live data. The data will be sourced from **ClickUp** for project and task management, and enriched with location data from **Odoo** and a **Geocoding API**. The end result should be a dynamic, multi-brand "owner's view" dashboard that retains the geographic UI structure (Regions -> States -> Locations).

---

## 2. Current State & The Challenge

* **Current State**: The UI is built with two main views: `OverviewView.tsx` (showing national regions) and `SoutheastView.tsx` (a drill-down for a specific region). All data in these components is currently static and hardcoded.
* **The Core Challenge**: The data from ClickUp is organized by **Franchise Brand** and **Project**, but it lacks the essential geographic information (Address, State, Region, Lat/Long) required to populate the map and the geographically structured tables in the UI.
* **Initial Analysis**: The `clickup-data-explorer.ts` script confirmed that while we can fetch projects and group them by brand (e.g., Crumbl, F45), location data is not readily available in the main project/task entities.

---

## 3. The Confirmed Solution & Data Flow

After analyzing the conversations, the definitive plan is to create a data pipeline that combines information from multiple sources.

### Data Flow Diagram:

[ClickUp]      ->     [Odoo]          ->     [Geocoding API]     ->     [Consolidated Data]     ->   [Dashboard UI]
(Get Project/     (Get Address using     (Get Lat/Long, State,     (Combined Project +        (Populate Map, Tables,
Task Data)       Project Name)          Region from Address)        Location Info)           & Metrics)

### Key Decisions:

* **Source of Truth for Locations**: The **Senior Dev** clarified that location data (address) resides in the **Odoo `crm.contacts` table**. The link between a ClickUp project and an Odoo contact is the **Project Name**, which should match the Odoo **Contact Name**.
* **Boss's Input**: The boss (Brandon) mentioned that the "Project Intake" list in ClickUp could also hold this address data.
* **Definitive Path**: We will prioritize checking for an address in the ClickUp "Project Intake" list first. If it's not present, we will use the project's name to query Odoo's `crm.contacts` table as the reliable fallback.
* **Geographic Enrichment**: Once we have an address, we will use a **Geocoding API** (e.g., Google Maps API) to programmatically determine the latitude, longitude, state, and region.
* **UI Structure**: The dashboard will maintain its regional structure. We will map all franchise projects geographically, regardless of the brand.

---

## 4. Implementation Plan

Here is a step-by-step plan to implement the solution.

### Step 1: Create an Odoo API Service

* **Action**: Implement a new service/module (`odooAPI.ts`) to handle the connection to Odoo.
* **Functionality**: It needs a function, `getAddressByContactName(name: string)`, that queries the `crm.contacts` table (or the equivalent Odoo model) and returns the street, city, state, and zip code for a given contact name.

### Step 2: Create a Geocoding Service

* **Action**: Implement a generic geocoding service (`geoAPI.ts`) that acts as a wrapper for a service like the Google Maps API.
* **Functionality**: It needs a function, `getCoordinatesAndRegion(address: string)`, that takes a full address and returns an object containing `{ lat, long, state, region }`. The region (Northeast, Southeast, etc.) can be determined from the state using a helper function, similar to `getRegionForState` in `clickup-data-explorer.ts`.

### Step 3: Orchestrate the Data Fetching

* **Action**: Modify the primary data-fetching logic that currently calls `ClickUpAPIService`. This logic will now manage the entire data pipeline.
* **Process**:
    1.  Fetch all projects from ClickUp using `ClickUpAPIService.getUserProjects()`.
    2.  For each project, fetch its detailed data (tasks, status, etc.) using `ClickUpAPIService.getProcessedProjectData(projectId)`.
    3.  **Get Address**:
        * First, attempt to find an address in the ClickUp "Project Intake" list for that project.
        * If not found, call `odooAPI.getAddressByContactName(project.name)`.
    4.  **Enrich Data**: If an address is found, pass it to `geoAPI.getCoordinatesAndRegion()`.
    5.  **Consolidate**: Combine the ClickUp project data with the returned geographic data into a single, comprehensive `Project` object.

### Step 4: Make UI Components Dynamic

* **Action**: Refactor `OverviewView.tsx` and `SoutheastView.tsx` to accept the consolidated data as props, removing all hardcoded data.
* **OverviewView.tsx**:
    * Group the consolidated project data by **region**.
    * Calculate metrics for the `Regional Performance Overview` table (e.g., `Locations` count, `Completion %`, `Current Phase`) based on the live data for each region.
    * Pass lat/long coordinates for all projects to the `MapComponent`.
* **SoutheastView.tsx** (and other region views):
    * Filter the consolidated data for the specific region (e.g., "Southeast").
    * Group the filtered data by **state**.
    * Populate the `State-by-State Progress` table with live data.

---

## 5. Key Files for Modification

* `services/clickupAPI.ts`: No changes may be needed, but its methods will be central to the new orchestration logic.
* `services/odooAPI.ts` **(New File)**: To connect and fetch data from Odoo.
* `services/geoAPI.ts` **(New File)**: To handle geocoding lookups.
* `views/OverviewView.tsx`: Remove hardcoded `overviewTableRows`, `REGION_STATUS_DATA`, etc. and replace with logic to process props.
* `views/SoutheastView.tsx`: Remove hardcoded `SOUTHEAST_METRICS`, `SOUTHEAST_STATES`, etc. and replace with logic to process props.
* **Data Fetching Orchestrator (Existing or New)**: The parent component or hook responsible for fetching and processing the data to be passed to the views.s