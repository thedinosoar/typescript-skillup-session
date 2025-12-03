// ============================================================================
// 12-END-TO-END: A Complete TypeScript "App" with Type Safety
// ============================================================================
// DEMO: Same order processing app, but with types catching all bugs
// ============================================================================

// --- TYPE DEFINITIONS AT BOUNDARIES ---

type UserTier = "basic" | "premium" | "enterprise";

interface User {
  id: number;
  name: string;
  email: string;
  tier: UserTier;
}

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

interface OrderItem {
  product: Product;
  quantity: number;
  total: number;
}

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

interface CreateOrderItem {
  productId: number;
  quantity: number;
}

// --- "DATABASE" ---

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", tier: "premium" },
  { id: 2, name: "Bob", email: "bob@example.com", tier: "basic" },
  { id: 3, name: "Carol", email: "carol@example.com", tier: "premium" },
];

const products: Product[] = [
  { id: 101, name: "Widget", price: 29.99, inStock: true },
  { id: 102, name: "Gadget", price: 49.99, inStock: true },
  { id: 103, name: "Gizmo", price: 19.99, inStock: false },
];

const orders: Order[] = [];

// --- API FUNCTIONS (Simulated) ---

async function fetchUser(userId: number): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return users.find((u) => u.id === userId) ?? null;
}

async function fetchProduct(productId: number): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return products.find((p) => p.id === productId) ?? null;
}

// --- ORDER PROCESSING ---

function calculateDiscount(user: User, subtotal: number): number {
  // TypeScript catches: user.teir ❌ Property 'teir' does not exist
  if (user.tier === "premium") {  // ✅ Correct property name
    return subtotal * 0.1;
  }
  if (user.tier === "enterprise") {
    return subtotal * 0.2;
  }
  return 0;
}

function calculateTax(subtotal: number): number {
  return subtotal * 0.08;
}

// --- RESULT TYPE FOR ERROR HANDLING ---

interface CreateOrderSuccess {
  success: true;
  order: Order;
}

interface CreateOrderError {
  success: false;
  error: string;
}

type CreateOrderResult = CreateOrderSuccess | CreateOrderError;

async function createOrder(
  userId: number,
  items: CreateOrderItem[]
): Promise<CreateOrderResult> {
  // Fetch user with proper null handling
  const user = await fetchUser(userId);
  
  if (user === null) {
    return { success: false, error: `User ${userId} not found` };
  }
  
  // TypeScript knows user is User here (not null)
  console.log(`Creating order for ${user.name}...`);
  
  // Process items
  let subtotal = 0;
  const orderItems: OrderItem[] = [];
  
  for (const item of items) {
    const product = await fetchProduct(item.productId);
    
    // Proper null and stock checking
    if (product === null) {
      return { success: false, error: `Product ${item.productId} not found` };
    }
    
    if (!product.inStock) {
      return { success: false, error: `Product ${product.name} is out of stock` };
    }
    
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    
    orderItems.push({
      product,
      quantity: item.quantity,  // ✅ Correct property from typed input
      total: itemTotal,
    });
  }
  
  // Calculate totals
  const discount = calculateDiscount(user, subtotal);
  const tax = calculateTax(subtotal - discount);
  const total = subtotal - discount + tax;
  
  // Create order with proper typing
  const order: Order = {
    id: orders.length + 1,
    user,
    items: orderItems,
    subtotal,
    discount,
    tax,
    total,
    status: "pending",  // ✅ Must be valid OrderStatus
    createdAt: new Date(),
  };
  
  orders.push(order);
  return { success: true, order };
}

// --- ORDER STATUS UPDATE ---

function updateOrderStatus(orderId: number, newStatus: OrderStatus): Order | null {
  const order = orders.find((o) => o.id === orderId);
  
  if (!order) {
    return null;
  }
  
  // newStatus is typed! Only valid statuses allowed.
  // updateOrderStatus(1, "banana") ❌ Error!
  order.status = newStatus;  // ✅ Correct property name enforced
  
  return order;
}

// --- RENDER OUTPUT ---

function renderOrderSummary(order: Order): void {
  console.log("\n========== ORDER SUMMARY ==========");
  console.log(`Order #${order.id}`);
  console.log(`Customer: ${order.user.name} (${order.user.email})`);  // ✅ Correct!
  console.log(`Status: ${order.status}`);
  
  console.log("\nItems:");
  for (const item of order.items) {
    // TypeScript knows item.quantity exists and is a number
    console.log(`  - ${item.product.name} x${item.quantity} = $${item.total.toFixed(2)}`);
  }
  
  console.log(`\nSubtotal: $${order.subtotal.toFixed(2)}`);
  console.log(`Discount: -$${order.discount.toFixed(2)}`);
  console.log(`Tax: $${order.tax.toFixed(2)}`);
  console.log(`Total: $${order.total.toFixed(2)}`);
  console.log("====================================\n");
}

// --- MAIN APP FLOW ---

async function main(): Promise<void> {
  console.log("Starting order processing...\n");
  
  // Create an order with proper typed inputs
  const result = await createOrder(1, [
    { productId: 101, quantity: 2 },
    { productId: 102, quantity: 1 },
  ]);
  
  // Handle success/error cases
  if (result.success) {
    renderOrderSummary(result.order);
    
    // Update status with valid value
    updateOrderStatus(result.order.id, "shipped");
    
    // updateOrderStatus(result.order.id, "banana");
    // ❌ Error: Argument of type '"banana"' is not assignable to parameter of type 'OrderStatus'
  } else {
    console.log("Order failed:", result.error);
  }
  
  // Handling non-existent user - error is caught gracefully
  const badResult = await createOrder(999, [{ productId: 101, quantity: 1 }]);
  if (!badResult.success) {
    console.log("Expected error:", badResult.error);
  }
  
  // Wrong types are caught at compile time:
  // await createOrder("one", [{ productId: "101", quantity: "2" }]);
  // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
}

main();

// --- REFACTORING DEMO ---
// Try this: Rename 'email' to 'emailAddress' in the User interface
// Watch TypeScript show errors at EVERY place that uses 'email'!
// 
// 1. Change: email: string; → emailAddress: string;
// 2. See red squiggles appear in:
//    - users array initialization
//    - renderOrderSummary function
// 3. Fix each error and regain confidence that everything works!

// ============================================================================
// WHAT TYPESCRIPT CAUGHT:
// ✅ user.teir typo → must use user.tier
// ✅ Null user not handled → forced explicit check
// ✅ Null/out-of-stock product → forced explicit checks
// ✅ item.quanity typo → must use item.quantity
// ✅ Invalid status values → only valid OrderStatus allowed
// ✅ order.staus typo → must use order.status
// ✅ order.user.emial typo → must use order.user.email
// ✅ Wrong argument types → compile-time errors
//
// BENEFITS FOR REFACTORING:
// - Rename a property → all usages flagged
// - Change a type → all incompatible code flagged
// - Add required field → all missing instances flagged
// ============================================================================

export {
  type User,
  type Product,
  type Order,
  type OrderStatus,
  type CreateOrderResult,
  createOrder,
  updateOrderStatus,
  renderOrderSummary,
};

