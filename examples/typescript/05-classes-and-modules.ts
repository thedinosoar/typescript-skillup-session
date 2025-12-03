// ============================================================================
// 05-CLASSES-AND-MODULES: TypeScript Classes with Type Safety
// ============================================================================
// DEMO: Typed fields, constructors, visibility modifiers, module types
// ============================================================================

// --- TYPED CLASS WITH VISIBILITY MODIFIERS ---

interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  // Explicit field declarations with types
  private readonly apiUrl: string;
  private cache: Map<number, User>;
  private timeout: number;  // Must be initialized or set in constructor!

  constructor(apiUrl: string, timeout: number = 5000) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
    this.timeout = timeout;
  }

  async getUser(id: number): Promise<User> {
    // Check cache first
    const cached = this.cache.get(id);
    if (cached) {
      return cached;
    }

    // Fetch from API
    const response = await fetch(`${this.apiUrl}/users/${id}`);
    const user: User = await response.json();
    
    this.cache.set(id, user);
    return user;
  }

  async getUserWithTimeout(id: number): Promise<User> {
    console.log(`Using timeout: ${this.timeout}`);  // Always defined!
    return this.getUser(id);
  }

  // Public method (default visibility)
  clearCache(): void {
    this.cache.clear();
  }
}

// --- CONSTRUCTOR TYPE CHECKING ---

const service1 = new UserService("https://api.example.com");
console.log(service1);  // ✅

// const service2 = new UserService();
// ❌ Error: Expected 1-2 arguments, but got 0

// const service3 = new UserService(12345);
// ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'

// --- PRIVATE FIELDS ARE ENFORCED ---

// service1.apiUrl = "hacked";
// ❌ Error: Property 'apiUrl' is private

// service1.cache.clear();
// ❌ Error: Property 'cache' is private

service1.clearCache();  // ✅ Public method works

// --- READONLY PREVENTS REASSIGNMENT ---

// Inside the class, you can't do: this.apiUrl = "new-url"
// ❌ Error: Cannot assign to 'apiUrl' because it is a read-only property

// --- CLASS WITH PROPERTY SHORTHAND ---

class Product {
  // Parameter properties - shorthand for declaring and assigning
  constructor(
    public readonly name: string,
    public price: number,
    public inStock: boolean = true  // Default value
  ) {}

  getDiscountedPrice(discountPercent: number): number {
    // this.pirce would be an error!
    return this.price * (1 - discountPercent / 100);
  }

  getSummary(): string {
    // this.inStock is guaranteed to exist and be boolean
    return `${this.name}: $${this.price} (${this.inStock ? "In Stock" : "Out of Stock"})`;
  }
}

const product = new Product("Widget", 29.99);
console.log(product.getDiscountedPrice(10));  // 26.991 ✅
console.log(product.getSummary());  // "Widget: $29.99 (In Stock)" ✅

// --- ES MODULE EXPORTS WITH TYPES ---

// These would be in separate files:

// user.types.ts
export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateUserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// user.service.ts
// import { CreateUserRequest, CreateUserResponse } from "./user.types";

export function createUser(request: CreateUserRequest): CreateUserResponse {
  return {
    id: Date.now(),
    name: request.name,
    email: request.email,
    createdAt: new Date(),
  };
}

// Types are verified across module boundaries!
// If you change CreateUserRequest, all importers are checked.

// --- ABSTRACT CLASSES ---

abstract class BaseRepository<T> {
  abstract findById(id: number): Promise<T | null>;
  abstract save(entity: T): Promise<T>;
  
  // Concrete method shared by all repositories
  async findByIdOrFail(id: number): Promise<T> {
    const entity = await this.findById(id);
    if (entity === null) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return entity;
  }
}

// Must implement abstract methods
class UserRepository extends BaseRepository<User> {
  async findById(id: number): Promise<User | null> {
    // Implementation here
    return null;
  }

  async save(user: User): Promise<User> {
    // Implementation here
    return user;
  }
}

// ============================================================================
// KEY BENEFITS:
// 1. Fields must be declared with types
// 2. private/public/protected visibility modifiers
// 3. readonly prevents mutation
// 4. Constructor parameters are type-checked
// 5. Parameter properties reduce boilerplate
// 6. Exports carry type information across modules
// 7. Abstract classes enforce implementation contracts
// ============================================================================

