// ============================================================================
// 11-LEGACY-MODULE.D.TS: Type Declarations for JavaScript Modules
// ============================================================================
// DEMO: How to add types to existing JavaScript without modifying it
// ============================================================================

// This file provides type information for 11-gradual-migration.js
// TypeScript will use these types when importing from that JS file.

/**
 * Options for formatting currency values
 */
export interface CurrencyOptions {
  /** Locale for number formatting (default: "en-US") */
  locale?: string;
  /** Currency code (default: "USD") */
  currency?: string;
  /** Number of decimal places (default: 2) */
  decimals?: number;
  /** Whether to show currency symbol (default: true) */
  showSymbol?: boolean;
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  options?: CurrencyOptions
): string;

/**
 * Possible input shapes for user data transformation
 */
export type RawUserData =
  | { id: number; name: string; email: string; active: boolean }
  | { userId: number; fullName: string; mail: string; isActive: boolean }
  | {
      user_id: number;
      firstName: string;
      lastName: string;
      emailAddress: string;
      status?: "active" | "inactive";
    };

/**
 * Normalized user data output
 */
export interface NormalizedUser {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: Date;
}

/**
 * Transform various user data formats into a normalized shape
 */
export function transformUserData(rawData: RawUserData): NormalizedUser;

/**
 * Event types that can be handled
 */
export type AppEvent =
  | { type: "click"; target: { id: string } }
  | { type: "submit"; data: Record<string, unknown> }
  | { type: "error"; message?: string; error?: Error };

/**
 * Handle application events
 */
export function handleEvent(event: AppEvent): void;

/**
 * API client for making HTTP requests
 */
export interface ApiClient {
  baseUrl: string;
  get<T = unknown>(endpoint: string): Promise<T>;
  post<T = unknown>(endpoint: string, data: unknown): Promise<T>;
}

export const apiClient: ApiClient;

/**
 * Get a nested configuration value by dot-notation path
 */
export function getConfig(path: string): unknown;

// ============================================================================
// HOW TO USE THIS FILE:
// 
// 1. Name it the same as the JS file but with .d.ts extension
//    e.g., legacy-module.js → legacy-module.d.ts
// 
// 2. Or for node_modules, create in @types folder:
//    @types/legacy-module/index.d.ts
// 
// 3. TypeScript will automatically pick up these declarations
// 
// 4. When you import from the JS file, you get full type checking:
//    import { formatCurrency } from "./legacy-module";
//    formatCurrency(99.99);  // ✅ Typed!
//    formatCurrency("99.99"); // ❌ Error!
// ============================================================================

