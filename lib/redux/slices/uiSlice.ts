import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Default values for sidebar
const COLLAPSED_WIDTH = "70px";
const EXPANDED_WIDTH = "225px";

// These must match the server-side defaults to prevent hydration errors
const DEFAULT_SIDEBAR_COLLAPSED = true;

export interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  sidebarWidth: string;

  // Chat state
  chatOpen: boolean;

  // Spotlight state
  spotlightOpen: boolean;

  // Mobile responsiveness
  isMobileView: boolean;

  // Additional UI flags
  demoSelectorOpen: boolean;
  demoSelectorPinned: boolean;
  demoSelectorCollapsed: boolean;

  // Track whether client-side hydration has occurred
  isHydrated: boolean;
}

const initialState: UIState = {
  sidebarCollapsed: DEFAULT_SIDEBAR_COLLAPSED,
  sidebarWidth: DEFAULT_SIDEBAR_COLLAPSED ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
  chatOpen: false,
  spotlightOpen: false,
  isMobileView: false,
  demoSelectorOpen: true,
  demoSelectorPinned: false,
  demoSelectorCollapsed: false,
  isHydrated: false,
};

// Theme definitions - composable and extensible
export const themeConfigs = {
  default: {
    sidebar: {
      item: {
        active: "bg-pastel-blue text-gray-800",
        inactive: "text-gray-500",
        hover: "hover:bg-pastel-blue hover:text-gray-800",
        icon: {
          active: "text-primary",
          inactive: "text-gray-500",
        },
        text: {
          active: "font-medium",
          inactive: "",
        },
      },
    },
  },
  cvs: {
    sidebar: {
      item: {
        active: "bg-gradient-to-r from-pastel-blue to-pastel-red text-gray-800",
        inactive: "text-gray-500",
        hover:
          "hover:bg-gradient-to-r hover:from-pastel-blue hover:to-pastel-red hover:text-gray-800",
        icon: {
          active: "text-gray-800", // Dark text for better contrast on gradient
          inactive: "text-gray-500",
        },
        text: {
          active: "font-semibold", // Slightly bolder for CVS
          inactive: "",
        },
      },
    },
  },
  // Additional themes can be added here
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.isHydrated = action.payload;
    },

    loadSavedState: (state, action: PayloadAction<Partial<UIState>>) => {
      // Only update state after hydration to prevent mismatches
      if (state.isHydrated) {
        // Only restore specifically allowed properties
        if (action.payload.sidebarCollapsed !== undefined) {
          state.sidebarCollapsed = action.payload.sidebarCollapsed;
          state.sidebarWidth = action.payload.sidebarCollapsed
            ? COLLAPSED_WIDTH
            : EXPANDED_WIDTH;

          // Apply CSS variables but don't store them in localStorage
          updateCssVariables(state);
        }
      }
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      state.sidebarWidth = action.payload ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

      updateCssVariables(state);
    },

    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      state.sidebarWidth = state.sidebarCollapsed
        ? COLLAPSED_WIDTH
        : EXPANDED_WIDTH;

      updateCssVariables(state);
    },

    setChatOpen: (state, action: PayloadAction<boolean>) => {
      state.chatOpen = action.payload;
    },

    toggleChat: (state) => {
      state.chatOpen = !state.chatOpen;
    },

    setSpotlightOpen: (state, action: PayloadAction<boolean>) => {
      state.spotlightOpen = action.payload;
    },

    toggleSpotlight: (state) => {
      state.spotlightOpen = !state.spotlightOpen;
    },

    setIsMobileView: (state, action: PayloadAction<boolean>) => {
      state.isMobileView = action.payload;

      // Auto-collapse sidebar on mobile
      if (action.payload && !state.sidebarCollapsed) {
        state.sidebarCollapsed = true;
        state.sidebarWidth = COLLAPSED_WIDTH;

        updateCssVariables(state);
      }
    },

    // Demo selector actions
    setDemoSelectorOpen: (state, action: PayloadAction<boolean>) => {
      state.demoSelectorOpen = action.payload;
    },

    toggleDemoSelector: (state) => {
      if (!state.demoSelectorPinned) {
        state.demoSelectorOpen = !state.demoSelectorOpen;
      }
    },

    setDemoSelectorPinned: (state, action: PayloadAction<boolean>) => {
      state.demoSelectorPinned = action.payload;
    },

    setDemoSelectorCollapsed: (state, action: PayloadAction<boolean>) => {
      state.demoSelectorCollapsed = action.payload;
    },
  },
});

// Helper function to update CSS variables based on state
function updateCssVariables(state: UIState) {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      state.sidebarWidth
    );

    document.documentElement.style.setProperty(
      "--content-padding-left",
      `calc(${state.sidebarWidth} + 1.5rem)`
    );
  }
}

export const {
  setHydrated,
  loadSavedState,
  setSidebarCollapsed,
  toggleSidebar,
  setChatOpen,
  toggleChat,
  setSpotlightOpen,
  toggleSpotlight,
  setIsMobileView,
  setDemoSelectorOpen,
  toggleDemoSelector,
  setDemoSelectorPinned,
  setDemoSelectorCollapsed,
} = uiSlice.actions;

export default uiSlice.reducer;
