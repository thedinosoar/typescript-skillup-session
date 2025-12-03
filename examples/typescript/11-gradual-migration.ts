// ============================================================================
// 11-GRADUAL-MIGRATION: Adding Types to Legacy JavaScript
// ============================================================================
// DEMO: Typing legacy code, any as escape hatch, type assertions, .d.ts
// ============================================================================

// --- STEP 1: Define Interfaces for Options ---

interface CurrencyOptions {
  locale?: string;
  currency?: string;
  decimals?: number;
  showSymbol?: boolean;
}

function formatCurrency(amount: number, options?: CurrencyOptions): string {
  const locale = options?.locale ?? "en-US";
  const currency = options?.currency ?? "USD";
  const decimals = options?.decimals ?? 2;
  const showSymbol = options?.showSymbol !== false;
  
  const formatted = amount.toFixed(decimals);
  
  if (showSymbol) {
    return `$${formatted}`;
  }
  return formatted;
}

// Now callers get autocomplete and validation!
console.log(formatCurrency(99.99));  // "$99.99" ✅
console.log(formatCurrency(99.99, { decimals: 0 }));  // "$100" ✅
// formatCurrency("99.99");  // ❌ Error: string not assignable to number
// formatCurrency(99.99, { decmals: 0 });  // ❌ Error: 'decmals' does not exist

// --- STEP 2: Use Union Types for Multiple Input Shapes ---

// Define all the possible input shapes
interface LegacyUserV1 {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

interface LegacyUserV2 {
  userId: number;
  fullName: string;
  mail: string;
  isActive: boolean;
}

interface LegacyUserV3 {
  user_id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  status?: "active" | "inactive";
}

type RawUserData = LegacyUserV1 | LegacyUserV2 | LegacyUserV3;

// Normalized output type
interface NormalizedUser {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: Date;
}

// Type guard functions for narrowing
function isV1User(data: RawUserData): data is LegacyUserV1 {
  return "id" in data && "name" in data;
}

function isV2User(data: RawUserData): data is LegacyUserV2 {
  return "userId" in data && "fullName" in data;
}

function transformUserData(rawData: RawUserData): NormalizedUser {
  if (isV1User(rawData)) {
    return {
      id: rawData.id,
      name: rawData.name,
      email: rawData.email,
      active: rawData.active,
      createdAt: new Date(),
    };
  } else if (isV2User(rawData)) {
    return {
      id: rawData.userId,
      name: rawData.fullName,
      email: rawData.mail,
      active: rawData.isActive,
      createdAt: new Date(),
    };
  } else {
    // TypeScript knows this is LegacyUserV3
    return {
      id: rawData.user_id,
      name: `${rawData.firstName} ${rawData.lastName}`,
      email: rawData.emailAddress,
      active: rawData.status === "active",
      createdAt: new Date(),
    };
  }
}

// --- STEP 3: Discriminated Unions for Events ---

interface ClickEvent {
  type: "click";
  target: { id: string };
}

interface SubmitEvent {
  type: "submit";
  data: Record<string, unknown>;
}

interface ErrorEvent {
  type: "error";
  message?: string;
  error?: Error;
}

type AppEvent = ClickEvent | SubmitEvent | ErrorEvent;

function handleEvent(event: AppEvent): void {
  switch (event.type) {
    case "click":
      // TypeScript knows this is ClickEvent
      console.log(`Clicked on ${event.target.id}`);
      break;
    case "submit":
      // TypeScript knows this is SubmitEvent
      console.log(`Form submitted: ${JSON.stringify(event.data)}`);
      break;
    case "error":
      // TypeScript knows this is ErrorEvent
      console.log(`Error: ${event.message ?? event.error?.message ?? "Unknown"}`);
      break;
  }
}

// --- STEP 4: Generic Typed API Client ---

class ApiClient {
  constructor(private baseUrl: string) {}
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json() as Promise<T>;
  }
  
  async post<TRequest, TResponse>(
    endpoint: string,
    data: TRequest
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json() as Promise<TResponse>;
  }
}

// Usage with types:
interface User {
  id: number;
  name: string;
  email: string;
}

const apiClient = new ApiClient("https://api.example.com");
// const users = await apiClient.get<User[]>("/users");
// users[0].name  // ✅ Autocomplete works!
// users[0].nmae  // ❌ Error!

// --- STEP 5: Type-Safe Configuration ---

interface AppConfig {
  api: {
    timeout: number;
    retries: number;
  };
  features: {
    darkMode: boolean;
    betaFeatures: boolean;
  };
  version: string;
}

const config: AppConfig = {
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

// Type-safe config access
console.log(config.api.timeout);  // ✅ Autocomplete!
// config.api.timout  // ❌ Error: Property 'timout' does not exist

// --- STEP 6: Using 'any' as Escape Hatch ---

// Sometimes you NEED any for truly dynamic data
function processExternalData(data: any): void {
  // Use any sparingly! Add runtime checks:
  if (typeof data?.name === "string") {
    console.log(data.name.toUpperCase());
  }
}

// Better alternative: 'unknown' + type guards
function processUnknownData(data: unknown): void {
  if (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof (data as { name: unknown }).name === "string"
  ) {
    console.log((data as { name: string }).name.toUpperCase());
  }
}

// --- STEP 7: Type Assertions (use carefully!) ---

interface ApiResponse {
  success: boolean;
  data: User[];
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  // We KNOW the API returns ApiResponse, so we assert it
  const result = (await response.json()) as ApiResponse;
  return result.data;
}

// ⚠️ Warning: Type assertions bypass checking!
// Only use when you're SURE about the type.

// --- .d.ts DECLARATION FILE EXAMPLE ---
// For typing external JS modules, create a .d.ts file:

/*
// legacy-module.d.ts

declare module "legacy-module" {
  export function formatCurrency(amount: number, options?: CurrencyOptions): string;
  
  export interface CurrencyOptions {
    locale?: string;
    currency?: string;
    decimals?: number;
    showSymbol?: boolean;
  }
}
*/

// Then in TypeScript:
// import { formatCurrency } from "legacy-module";
// formatCurrency(99.99);  // ✅ Typed!

// ============================================================================
// GRADUAL MIGRATION STRATEGY:
// 1. Start with .d.ts files for external modules
// 2. Add interfaces for function options
// 3. Type function parameters and returns
// 4. Use 'any' temporarily, then refine to proper types
// 5. Use union types for legacy data shapes
// 6. Add type guards for runtime narrowing
// 7. Replace any with unknown where possible
// ============================================================================

export {
  formatCurrency,
  transformUserData,
  handleEvent,
  ApiClient,
  config,
  type CurrencyOptions,
  type NormalizedUser,
  type AppEvent,
  type AppConfig,
};

