// ============================================================================
// 10-PROMISES-AND-ASYNC: Type-Safe Async Operations in TypeScript
// ============================================================================
// DEMO: Typed responses, catching property misspells, async flows
// ============================================================================

// --- DEFINE THE API RESPONSE TYPES ---

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// --- TYPED FETCH FUNCTION ---

async function fetchTodo(id: number): Promise<Todo> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  const todo: Todo = await response.json();
  return todo;
}

// Usage - TypeScript knows the structure!
async function displayTodo(): Promise<void> {
  const todo = await fetchTodo(1);
  
  // Full autocomplete and type checking!
  console.log(`Todo: ${todo.title}`);       // ✅
  console.log(`Completed: ${todo.completed}`); // ✅
  console.log(`ID: ${todo.id}`);            // ✅
  
  // Typo is caught at compile time!
  // console.log(`Title: ${todo.titel}`);   // ❌ Error: Property 'titel' does not exist
}

displayTodo();

// --- FETCH ARRAY OF TYPED OBJECTS ---

async function fetchAllTodos(): Promise<Todo[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos: Todo[] = await response.json();
  return todos;
}

async function processTodos(): Promise<void> {
  const todos = await fetchAllTodos();
  
  // TypeScript knows todos is Todo[]
  const incomplete = todos.filter((t) => !t.completed);  // Todo[]
  
  // Full autocomplete in arrow functions!
  const titles = todos.map((t) => t.title);  // string[]
  console.log("Titles:", titles);
  
  const userIds = todos.map((t) => t.userId);  // number[]
  console.log("User IDs:", userIds);
  
  // Typos are caught:
  // const wrong = todos.map((t) => t.titel);  // ❌ Error!
}

processTodos();

// --- TYPED CHAINED OPERATIONS ---

interface UserWithTodos {
  user: User;
  todos: Todo[];
  todoCount: number;
}

async function getUserWithTodos(userId: number): Promise<UserWithTodos> {
  // Fetch user
  const userResponse = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  const user: User = await userResponse.json();
  
  // Fetch user's todos
  const todosResponse = await fetch(
    `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
  );
  const todos: Todo[] = await todosResponse.json();
  
  return {
    user,
    todos,
    todoCount: todos.length,  // TypeScript catches 'lenght' typos!
  };
}

async function displayUserWithTodos(): Promise<void> {
  const data = await getUserWithTodos(1);
  
  // Full type safety on nested properties!
  console.log(`User: ${data.user.name}`);
  console.log(`Email: ${data.user.email}`);  // ✅ Autocomplete!
  console.log(`Todo count: ${data.todoCount}`);
  
  // data.user.emial  // ❌ Error: Property 'emial' does not exist
}

displayUserWithTodos();

// --- DISCRIMINATED UNION FOR RESULTS ---

interface SuccessResult<T> {
  success: true;
  data: T;
}

interface ErrorResult {
  success: false;
  error: string;
  status?: number;
}

type Result<T> = SuccessResult<T> | ErrorResult;

async function fetchWithErrorHandling<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        success: false,
        error: response.statusText,
        status: response.status,
      };
    }
    
    const data: T = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function handleFetch(): Promise<void> {
  const result = await fetchWithErrorHandling<Todo>(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  
  // TypeScript narrows based on success check!
  if (result.success) {
    // TypeScript knows result is SuccessResult<Todo>
    console.log(result.data.title);  // ✅ Full autocomplete!
    // result.data.titel  // ❌ Error!
  } else {
    // TypeScript knows result is ErrorResult
    console.log(result.error);  // ✅
    // result.data  // ❌ Error: Property 'data' does not exist on ErrorResult
  }
}

handleFetch();

// --- TYPED POST REQUEST ---

interface CreateTodoRequest {
  title: string;
  userId: number;
  completed?: boolean;
}

interface CreateTodoResponse extends Todo {
  // Response might include additional fields from API
}

async function createTodo(request: CreateTodoRequest): Promise<CreateTodoResponse> {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  
  return response.json();
}

// Correct usage:
createTodo({
  title: "Learn TypeScript",
  userId: 1,
  completed: false,
});

// Typos are caught in request body:
// createTodo({
//   titel: "Wrong",  // ❌ Error: 'titel' does not exist, did you mean 'title'?
//   userId: 1,
// });

// --- PARALLEL ASYNC OPERATIONS ---

async function fetchUserAndTodos(
  userId: number
): Promise<{ user: User; todos: Todo[] }> {
  // Parallel fetching with proper types
  const [user, todos] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(
      (r) => r.json() as Promise<User>
    ),
    fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`).then(
      (r) => r.json() as Promise<Todo[]>
    ),
  ]);
  
  return { user, todos };
}

// ============================================================================
// KEY BENEFITS FOR API DEVELOPERS:
// 1. Define types at API boundaries (request/response interfaces)
// 2. Property typos caught at compile time, not runtime
// 3. IDE provides autocomplete for all response properties
// 4. Discriminated unions make success/error handling type-safe
// 5. Generic Result<T> pattern works with any response type
// 6. Request bodies are validated against interface shapes
// 7. Parallel operations maintain type information
// ============================================================================

