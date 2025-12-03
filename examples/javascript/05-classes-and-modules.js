// ============================================================================
// 05-CLASSES-AND-MODULES: JavaScript Classes and Module Patterns
// ============================================================================
// DEMO: Class basics, constructor issues, module exports/imports
// ============================================================================

// --- SIMPLE CLASS ---

class UserService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = {};  // No declaration - just assigned
    // Forgot to initialize 'timeout' - undefined later!
  }

  async getUser(id) {
    // Check cache first
    if (this.cache[id]) {
      return this.cache[id];
    }

    // Fetch from API
    const response = await fetch(`${this.apiUrl}/users/${id}`);
    const user = await response.json();
    
    this.cache[id] = user;
    return user;
  }

  // Using timeout that was never initialized
  async getUserWithTimeout(id) {
    const timeoutMs = this.timeout || 5000;  // Falls back, but is this intended?
    console.log(`Using timeout: ${timeoutMs}`);
    return this.getUser(id);
  }
}

// --- CONSTRUCTOR MISUSE ---

const service1 = new UserService("https://api.example.com");
console.log(service1.apiUrl);  // "https://api.example.com" ✅

// But nothing stops this:
const service2 = new UserService();  // apiUrl is undefined! 🐛
console.log(service2.apiUrl);  // undefined

const service3 = new UserService(12345);  // Wrong type, no error! 🐛
console.log(service3.apiUrl);  // 12345

// --- ACCIDENTAL PROPERTY ACCESS ---

class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  getDiscountedPrice(discountPercent) {
    // Typo: using 'pirce' instead of 'price'
    return this.pirce * (1 - discountPercent / 100);  // 🐛 undefined * 0.9 = NaN
  }

  getSummary() {
    // Using a property that doesn't exist
    return `${this.name}: $${this.price} (${this.inStock ? "In Stock" : "Out of Stock"})`;
    // this.inStock is undefined, so always shows "Out of Stock" 🐛
  }
}

const product = new Product("Widget", 29.99);
console.log(product.getDiscountedPrice(10));  // NaN 🐛
console.log(product.getSummary());  // "Widget: $29.99 (Out of Stock)" 🐛

// --- ES MODULES (export/import) ---

// In a real file, you'd export like this:
// export class UserService { ... }
// export function createUser(name) { ... }
// export const API_VERSION = "v1";

// And import like this:
// import { UserService, createUser, API_VERSION } from "./user-service.js";

// --- COMMON JS (older style) ---

// module.exports = {
//   UserService,
//   createUser,
// };

// const { UserService, createUser } = require("./user-service");

// --- WRONG IMPORT USAGE ---

// Nothing prevents importing and using classes incorrectly:
// import { UserService } from "./services";
// const user = UserService("https://api.example.com");  // Forgot 'new'! 🐛
// user.getUser(1);  // TypeError: user.getUser is not a function

// ============================================================================
// KEY PROBLEMS:
// 1. Constructor parameters have no type enforcement
// 2. Properties are implicitly created (typos create new properties)
// 3. No visibility modifiers (everything is public)
// 4. Missing 'new' keyword causes silent failures
// 5. Imports/exports don't verify shapes across modules
// ============================================================================

