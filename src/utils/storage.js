// Utils untuk penyimpanan data di localStorage
const STORAGE_KEYS = {
  TICKET_FILTERS: "ticket_filters",
  MACHINE_FILTERS: "machine_filters",
  USER_FILTERS: "user_filters",
  TABLE_DENSITY: "table_density",
  COLUMN_VISIBILITY: "column_visibility",
  OVERVIEW_DATE_RANGE: "overview_date_range",
};

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

export function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
}

export function clearAppStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeFromStorage(key);
  });
}

// Specific filter storage functions
export const filterStorage = {
  // Ticket filters
  saveTicketFilters: (filters) =>
    saveToStorage(STORAGE_KEYS.TICKET_FILTERS, filters),
  loadTicketFilters: () =>
    loadFromStorage(STORAGE_KEYS.TICKET_FILTERS, {
      search: "",
      status: "all",
      priority: "all",
    }),

  // Machine filters
  saveMachineFilters: (filters) =>
    saveToStorage(STORAGE_KEYS.MACHINE_FILTERS, filters),
  loadMachineFilters: () =>
    loadFromStorage(STORAGE_KEYS.MACHINE_FILTERS, {
      search: "",
    }),

  // User filters
  saveUserFilters: (filters) =>
    saveToStorage(STORAGE_KEYS.USER_FILTERS, filters),
  loadUserFilters: () =>
    loadFromStorage(STORAGE_KEYS.USER_FILTERS, {
      search: "",
      role: "all",
      verified: "all",
    }),

  saveTableDensity: (density) =>
    saveToStorage(STORAGE_KEYS.TABLE_DENSITY, density),
  loadTableDensity: () =>
    loadFromStorage(STORAGE_KEYS.TABLE_DENSITY, "comfortable"),

  saveColumnVisibility: (tableName, columns) =>
    saveToStorage(`${STORAGE_KEYS.COLUMN_VISIBILITY}_${tableName}`, columns),
  loadColumnVisibility: (tableName, defaultColumns) =>
    loadFromStorage(
      `${STORAGE_KEYS.COLUMN_VISIBILITY}_${tableName}`,
      defaultColumns
    ),

  saveOverviewDateRange: (range) =>
    saveToStorage(STORAGE_KEYS.OVERVIEW_DATE_RANGE, range),
  loadOverviewDateRange: () =>
    loadFromStorage(STORAGE_KEYS.OVERVIEW_DATE_RANGE, "last30days"),
};

export { STORAGE_KEYS };
