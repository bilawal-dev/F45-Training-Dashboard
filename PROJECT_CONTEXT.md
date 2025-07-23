# F45 Training Dashboard + ClickUp Integration: Project Context

This document details the process of integrating a static F45 Training dashboard, built with Next.js, with live data from a ClickUp workspace.

## Core Concept: The "Two-Table Solution"

The project was based on a "Two-Table Solution" proposed by stakeholders ("Brandon" and a senior developer):
1.  A central **"Project Intake" list** in ClickUp serves as a master database for location information (address, state, lat/long), with each task representing a physical store.
2.  The main **"Projects" space** contains brand-specific folders (e.g., "Crumbl"), which in turn hold project lists for each store (e.g., "Dallas Location"), containing the actual project tasks.

## Phase 1: Discovery and Validation

The first phase involved creating temporary analysis tools (`ProjectIntakeAnalyzer`, `ClickUpDataExplorer`) to explore and validate the ClickUp data structure. This phase confirmed the viability of the plan by identifying the correct custom fields (`Street`, `City`, `State`, `Zip`) in the `Project Intake` list. It also revealed the first major challenge: linking project lists (e.g., "Forest Crumbl") to their corresponding location entries in `Project Intake`, as the names did not always match.

## Phase 2: Building the Data Pipeline

The second phase focused on building a robust data pipeline. This involved creating two key services:
*   **`locationProvider.ts`**: A service to fetch data from the `Project Intake` list and use a multi-step fuzzy matching algorithm to link project names to their location data based on a naming convention (`{Brand Name} - {Location Name}`).
*   **`regionalDataAggregator.ts`**: A service to orchestrate the entire data flow. For a given brand (folder), it fetches all project lists, uses the `LocationProvider` to enrich them with location data, fetches detailed task data for each project, and aggregates all the information into a comprehensive, dashboard-ready data structure.

## Phase 3: UI Integration and Debugging

The third phase involved integrating this data pipeline into the UI and extensive debugging.
*   A **`useDashboardData` hook** was created to manage the application's state, read a `folderId` from the URL query parameters, and trigger the data fetching.
*   The **`ProjectSelectorHeader`** was updated to set this `folderId` in the URL when a user selects a brand, making the views shareable.
*   The **`OverviewView`** was refactored to consume the data from this hook.

### Critical Bugs Resolved:
*   **State Persistence:** A bug where the dashboard state would reset upon navigating between views was fixed by "lifting the state up" from the `OverviewView` to the parent `DashboardContainer`.
*   **API Authorization Errors:** A recurring `OAUTH_027` error was traced back to incorrectly using a ClickUp Space ID instead of the required List ID for the `projectIntakeListId`. This was resolved by identifying the correct ID from the ClickUp URL.
*   **Incorrect Regional Mapping:** The dashboard was failing to group stores into regions because the mapping logic expected full state names (e.g., "Texas") while the ClickUp data used abbreviations (e.g., "TX"). This was fixed by updating the `STATE_TO_REGION_MAPPING` to include abbreviations.
*   **Misleading Metrics:** Several metrics were either based on random numbers or were static leftovers from the original UI. This was addressed by replacing the random logic with a deterministic, rules-based calculation for schedule status and completely refactoring the "Project Timeline Progress" bar to be dynamically driven by the actual overall completion percentage and the correct F45 project phases.
*   **Build Errors:** Multiple Vercel build errors related to TypeScript type mismatches and Next.js server-side rendering (`useSearchParams` requiring a `<Suspense>` boundary) were resolved.

## Final Cleanup

Finally, with the core functionality proven, a cleanup phase was initiated. All temporary testing components and services were deleted, and the UI was streamlined, leaving a clean, efficient, and fully dynamic `OverviewView` ready for the next steps. 