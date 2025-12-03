// ============================================================================
// 11-GRADUAL-MIGRATION: Legacy JavaScript Code
// ============================================================================
// DEMO: Pretend this came from an old codebase - dynamic objects, no types
// ============================================================================

// --- LEGACY UTILITY FUNCTION ---
// This function has been in the codebase for years.
// Nobody quite remembers all the ways it's used.

function formatCurrency(amount, options) {
  // options might have: locale, currency, decimals, showSymbol
  // But who knows at this point?
  
  const locale = options?.locale || "en-US";
  const currency = options?.currency || "USD";
  const decimals = options?.decimals ?? 2;
  const showSymbol = options?.showSymbol !== false;
  
  const formatted = amount.toFixed(decimals);
  
  if (showSymbol) {
    return `$${formatted}`;
  }
  return formatted;
}

// Various usages across the codebase:
console.log(formatCurrency(99.99));  // "$99.99"
console.log(formatCurrency(99.99, { decimals: 0 }));  // "$100"
console.log(formatCurrency(99.99, { showSymbol: false }));  // "99.99"

// --- LEGACY DATA TRANSFORMER ---

function transformUserData(rawData) {
  // rawData comes from various sources with different shapes
  // This function tries to normalize it
  
  return {
    id: rawData.id || rawData.userId || rawData.user_id,
    name: rawData.name || rawData.fullName || `${rawData.firstName} ${rawData.lastName}`,
    email: rawData.email || rawData.emailAddress || rawData.mail,
    active: rawData.active ?? rawData.isActive ?? rawData.status === "active",
    createdAt: rawData.createdAt || rawData.created_at || rawData.dateCreated || new Date(),
  };
}

// Used with various data shapes:
const user1 = transformUserData({ id: 1, name: "Alice", email: "a@x.com", active: true });
const user2 = transformUserData({ userId: 2, fullName: "Bob", mail: "b@x.com", isActive: false });
const user3 = transformUserData({ user_id: 3, firstName: "Carol", lastName: "Smith", emailAddress: "c@x.com" });

console.log(user1, user2, user3);

// --- LEGACY EVENT HANDLER ---

function handleEvent(event) {
  // event could be many different shapes depending on source
  
  if (event.type === "click") {
    console.log(`Clicked on ${event.target?.id || "unknown"}`);
  } else if (event.type === "submit") {
    console.log(`Form submitted: ${JSON.stringify(event.data)}`);
  } else if (event.type === "error") {
    console.log(`Error: ${event.message || event.error?.message || "Unknown error"}`);
  }
}

// --- LEGACY API CLIENT ---

const apiClient = {
  baseUrl: "https://api.example.com",
  
  async get(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Used throughout the app with no type info:
// const users = await apiClient.get("/users");
// users[0].nmae  -- typo not caught!

// --- LEGACY CONFIGURATION ---

const config = {
  api: {
    timeout: 5000,
    retries: 3,
  },
  features: {
    darkMode: true,
    betaFeatures: false,
  },
  version: "1.0.0",
};

function getConfig(path) {
  // Get nested config value by dot-notation path
  return path.split(".").reduce((obj, key) => obj?.[key], config);
}

console.log(getConfig("api.timeout"));  // 5000
console.log(getConfig("features.darkMode"));  // true
console.log(getConfig("api.timout"));  // undefined (typo!)

// ============================================================================
// MIGRATION NOTES:
// This file represents "legacy" JavaScript that needs to be gradually typed.
// The TypeScript version shows how to:
// 1. Add types without changing behavior
// 2. Use 'any' as a temporary escape hatch
// 3. Create .d.ts declaration files for JS modules
// 4. Use type assertions carefully
// ============================================================================

module.exports = {
  formatCurrency,
  transformUserData,
  handleEvent,
  apiClient,
  getConfig,
};

