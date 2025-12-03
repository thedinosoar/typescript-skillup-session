// ============================================================================
// 10-PROMISES-AND-ASYNC: Async JavaScript Without Type Safety
// ============================================================================
// DEMO: Fetch calls, assuming response structure, property typos
// ============================================================================

// --- BASIC FETCH CALL ---

async function fetchTodo(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  const todo = await response.json();
  return todo;
}

// Usage - but what does 'todo' contain?
async function displayTodo() {
  const todo = await fetchTodo(1);
  
  // We ASSUME the structure...
  console.log(`Todo: ${todo.title}`);
  console.log(`Completed: ${todo.completed}`);
  
  // BUG: Typo in property name! 🐛
  console.log(`ID: ${todo.id}`);
  console.log(`Title: ${todo.titel}`);  // 🐛 'titel' instead of 'title' - undefined!
}

displayTodo();

// --- FETCH MULTIPLE TODOS ---

async function fetchAllTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = await response.json();
  return todos;
}

async function processTodos() {
  const todos = await fetchAllTodos();
  
  // We assume it's an array of objects with specific properties
  const incomplete = todos.filter((t) => !t.completed);
  
  // Typos are silent bugs:
  const titles = todos.map((t) => t.titel);  // 🐛 All undefined!
  console.log("Titles:", titles);
  
  // Wrong property access:
  const userIds = todos.map((t) => t.user_id);  // 🐛 Should be 'userId'
  console.log("User IDs:", userIds);
}

processTodos();

// --- CHAINED ASYNC OPERATIONS ---

async function getUserWithTodos(userId) {
  // Fetch user
  const userResponse = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  const user = await userResponse.json();
  
  // Fetch user's todos
  const todosResponse = await fetch(
    `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
  );
  const todos = await todosResponse.json();
  
  return {
    user,
    todos,
    // Computed property with typo
    todoCount: todos.lenght,  // 🐛 'lenght' instead of 'length'
  };
}

async function displayUserWithTodos() {
  const data = await getUserWithTodos(1);
  
  // Assuming structure...
  console.log(`User: ${data.user.name}`);
  console.log(`Email: ${data.user.emial}`);  // 🐛 'emial' instead of 'email'
  console.log(`Todo count: ${data.todoCount}`);  // undefined!
}

displayUserWithTodos();

// --- ERROR HANDLING WITHOUT TYPES ---

async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // What error shape do we return?
      return {
        success: false,
        error: response.statusText,
        status: response.status,
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,  // 🐛 error might not have .message
    };
  }
}

async function handleFetch() {
  const result = await fetchWithErrorHandling(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  
  // We have to remember the response shape...
  if (result.success) {
    console.log(result.data.titel);  // 🐛 Typo!
  } else {
    console.log(result.eror);  // 🐛 Typo in 'error'!
  }
}

handleFetch();

// --- POST REQUEST: SENDING DATA ---

async function createTodo(title, userId) {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titel: title,   // 🐛 API expects 'title', not 'titel'
      userId: userId,
      completed: false,
    }),
  });
  
  return response.json();
}

// ============================================================================
// KEY PROBLEMS:
// 1. Response types are unknown - we guess the structure
// 2. Property typos in response handling go undetected
// 3. Request body structure isn't validated
// 4. Error shapes are inconsistent
// 5. Chained operations lose type information
// 6. No IDE help for API response properties
// ============================================================================

