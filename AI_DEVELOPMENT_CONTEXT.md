# AI Development Context: F45 Dashboard Custom Chat Widget

This document provides a comprehensive summary of the development work performed on the custom chat widget for the F45 Dashboard project. Its purpose is to provide immediate context to any AI assistant or developer joining the project.

## 1. High-Level Goal

The primary objective is to replace the standard, limited Chatwoot widget with a custom, feature-rich chat application built directly within the F45 Dashboard. This new widget must be self-contained and handle everything from authentication to real-time messaging, with a specific focus on a location-based architecture.

The business logic is to organize conversations based on a `Company -> Location -> Thread` hierarchy.

## 2. Architecture: Headless Chatwoot

After careful consideration and validation against official documentation, we adopted a **"headless" architecture**.

-   **Chatwoot as a Backend**: We are using Chatwoot purely as a backend service for its robust conversation and messaging APIs.
-   **Custom React Frontend**: We have built the entire chat UI from scratch using React and Next.js. This gives us full control over the user experience.
-   **API-Driven**: All interactions (authentication, fetching data, sending messages) are handled through API calls to a separate backend, which then communicates with Chatwoot and Slack.

## 3. Self-Contained Authentication

A major architectural decision was to embed the entire authentication flow within the `ChatWidget` itself, removing the need for separate `/login` and `/signup` pages.

-   **`AuthContainer.tsx`**: This component acts as a controller, conditionally rendering either the `Login` or `Signup` component based on user state.
-   **Reusable Auth Components**: The original `login` and `signup` pages were converted into reusable components (`src/components/chat-widget/auth/Login.tsx`, `src/components/chat-widget/auth/Signup.tsx`).
-   **`AuthContext.tsx` Refactor**: The `login`, `signup`, and `logout` functions in the `AuthContext` were modified to remove all page redirects (`router.push` and `window.location.href`). Instead, they now simply update the user state, allowing the `ChatWidget` to reactively display the correct view.
-   **State-Driven UI**: The `ChatWidget` uses the `useAuth` hook to check the `user` and `loading` state, and renders one of three views:
    1.  `AuthLoader`: Shown during initial token verification.
    2.  `AuthContainer`: Shown if there is no authenticated user.
    3.  Main Chat Interface: Shown when a user is successfully authenticated.

## 4. API Integration

We have successfully integrated several key backend endpoints. The `NEXT_PUBLIC_BACKEND_URL` environment variable is used as the base URL for all API calls.

### Locations API

-   **Endpoint**: `GET /api/chat/locations/:folderId`
-   **Implementation**: A `useEffect` hook in `ChatWidget.tsx` fetches the list of locations when an authenticated user is present and a `folderId` is available in the URL query parameters.
-   **State Management**: The fetched locations are stored in the `locations` state variable, with a `locationsLoading` state to handle the loading UI.

### Threads API (CRUD)

-   **Endpoint**: `GET, POST, PUT, DELETE /api/chat/threads`
-   **Implementation**:
    -   **Fetch (`GET` a "listId")**: When a location is selected, another `useEffect` hook triggers `fetchThreads` to get all associated threads.
    -   **Create (`POST`)**: The `ChatSidebar` contains a UI for creating a new thread, which calls the `handleCreateThread` function passed down from `ChatWidget`.
    -   **Update (`PUT` a "threadId")**: The `ChatSidebar` allows for inline editing of a thread's name, triggering `handleUpdateThread`.
    -   **Delete (`DELETE` a "threadId")**: A context menu on each thread item allows for deletion, which calls `handleDeleteThread` after a confirmation prompt.
-   **Data Transformation**: The data fetched from the backend is transformed in `ChatWidget.tsx` to match the `Thread` type definition, which is designed to support the UI's needs (e.g., `title`, `lastMessage`).

## 5. Component Structure

The entire chat widget is organized under `src/components/chat-widget/`.

-   **`ChatWidget.tsx`**: The main stateful component that orchestrates all logic.
-   **`ChatSidebar.tsx`**: Displays the list of locations and threads. Handles the UI for thread creation, editing, and deletion.
-   **`ChatThread.tsx`**: Renders the conversation messages for the selected thread (currently using static data).
-   **`ChatInput.tsx`**: The message input component (currently logs to console).
-   **`types.ts`**: A centralized file for all TypeScript interfaces and type definitions used across the widget.
-   **`/auth/`**: A sub-directory containing the `AuthContainer`, `AuthLoader`, `Login`, and `Signup` components.

## 6. Key Bug Fixes and UX Improvements

-   **Default State**: The chat widget's initial state was changed to be minimized by default.
-   **Dropdown Menu Logic**: The edit/delete thread menu in the `ChatSidebar` was refactored to toggle correctly on a dedicated icon click, rather than on general item selection. It also now closes when the user clicks outside of it.

This summary should provide a solid foundation for understanding the current state of the chat widget. 