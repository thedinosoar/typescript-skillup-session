// ============================================================================
// 12-END-TO-END: A Complete JavaScript "App" with Realistic Bugs
// ============================================================================
// DEMO: A small order processing app with common JavaScript mistakes
// ============================================================================

// --- "DATABASE" ---

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", tier: "premium" },
  { id: 2, name: "Bob", email: "bob@example.com", tier: "basic" },
  { id: 3, name: "Carol", email: "carol@example.com", tier: "premium" },
];

const products = [
  { id: 101, name: "Widget", price: 29.99, inStock: true },
  { id: 102, name: "Gadget", price: 49.99, inStock: true },
  { id: 103, name: "Gizmo", price: 19.99, inStock: false },
];

const orders = [];

// --- API FUNCTIONS (Simulated) ---

async function fetchUser(userId) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return users.find((u) => u.id === userId);
}

async function fetchProduct(productId) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return products.find((p) => p.id === productId);
}

// --- ORDER PROCESSING ---

function calculateDiscount(user, subtotal) {
  // BUG 1: Using wrong property name 🐛
  if (user.teir === "premium") {  // 'teir' instead of 'tier'
    return subtotal * 0.1;  // 10% discount
  }
  return 0;
}

function calculateTax(subtotal) {
  return subtotal * 0.08;  // 8% tax
}

async function createOrder(userId, items) {
  // Fetch user
  const user = await fetchUser(userId);
  
  // BUG 2: Not checking if user exists 🐛
  console.log(`Creating order for ${user.name}...`);
  
  // Process items
  let subtotal = 0;
  const orderItems = [];
  
  for (const item of items) {
    const product = await fetchProduct(item.productId);
    
    // BUG 3: Not checking if product exists or is in stock 🐛
    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    
    orderItems.push({
      product: product,
      quantity: item.quanity,  // BUG 4: Typo 'quanity' instead of 'quantity' 🐛
      total: itemTotal,
    });
  }
  
  // Calculate totals
  const discount = calculateDiscount(user, subtotal);
  const tax = calculateTax(subtotal - discount);
  const total = subtotal - discount + tax;
  
  // Create order
  const order = {
    id: orders.length + 1,
    user: user,
    items: orderItems,
    subtotal: subtotal,
    discount: discount,
    tax: tax,
    total: total,
    status: "pending",
    createdAt: new Date(),
  };
  
  orders.push(order);
  return order;
}

// --- ORDER STATUS UPDATE ---

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find((o) => o.id === orderId);
  
  // BUG 5: Not validating status value 🐛
  // Any string is accepted: "pending", "shipped", "banana", "asdf"
  order.staus = newStatus;  // BUG 6: Typo 'staus' instead of 'status' 🐛
  
  return order;
}

// --- RENDER OUTPUT ---

function renderOrderSummary(order) {
  console.log("\n========== ORDER SUMMARY ==========");
  console.log(`Order #${order.id}`);
  console.log(`Customer: ${order.user.name} (${order.user.emial})`);  // BUG 7: 'emial' 🐛
  console.log(`Status: ${order.status}`);
  
  console.log("\nItems:");
  for (const item of order.items) {
    // BUG 8: Using item.quantity which is undefined due to typo above 🐛
    console.log(`  - ${item.product.name} x${item.quantity} = $${item.total.toFixed(2)}`);
  }
  
  console.log(`\nSubtotal: $${order.subtotal.toFixed(2)}`);
  console.log(`Discount: -$${order.discount.toFixed(2)}`);
  console.log(`Tax: $${order.tax.toFixed(2)}`);
  console.log(`Total: $${order.total.toFixed(2)}`);
  console.log("====================================\n");
}

// --- MAIN APP FLOW ---

async function main() {
  console.log("Starting order processing...\n");
  
  // Create an order
  const order = await createOrder(1, [
    { productId: 101, quantity: 2 },
    { productId: 102, quantity: 1 },
  ]);
  
  renderOrderSummary(order);
  
  // Update status
  updateOrderStatus(order.id, "shipped");
  
  // BUG 9: Accessing non-existent user 🐛
  try {
    const badOrder = await createOrder(999, [{ productId: 101, quantity: 1 }]);
    renderOrderSummary(badOrder);
  } catch (error) {
    console.log("Error:", error.message);
  }
  
  // BUG 10: Passing wrong argument types 🐛
  const weirdOrder = await createOrder("one", [
    { productId: "101", quantity: "2" },  // String IDs and quantities
  ]);
}

main();

// ============================================================================
// BUGS IN THIS CODE:
// 1. user.teir instead of user.tier (typo)
// 2. No null check after fetchUser
// 3. No null/inStock check after fetchProduct
// 4. item.quanity instead of item.quantity (typo)
// 5. No validation on status values
// 6. order.staus instead of order.status (typo)
// 7. order.user.emial instead of email (typo)
// 8. Using item.quantity which is undefined
// 9. No handling for non-existent user
// 10. Wrong argument types accepted silently
// 
// TypeScript would catch ALL of these at compile time!
// ============================================================================

