// ============================================================================
// 99-ADVANCED-ROUTE-TYPES: Type-Level String Parsing in TypeScript
// ============================================================================
// DEMO: TypeScript's type system parsing URL paths at compile time
// ============================================================================

/**
 * ADVANCED TYPESCRIPT EXAMPLE:
 *
 * - We define routes as plain data: path + method
 * - TypeScript:
 *   - Parses the path string at the type level (`/users/:userId/posts/:postId`)
 *   - Extracts parameter names (`"userId" | "postId"`)
 *   - Builds a param object type for each route ({ userId: string; postId: string })
 *   - Enforces correct params when calling makeUrl(...)
 *
 * This is all checked at COMPILE TIME. No runtime reflection, no codegen.
 */

// =============================================================================
// TYPE-LEVEL STRING PARSING
// =============================================================================

/** Extract parameter names (":id") from a path string. */
type ExtractParamNames<Path extends string> =
  // Match ":paramName/" segments
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParamNames<Rest>
    // Match a trailing ":paramName"
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;

/** Build a { [paramName]: string } object type from a path string. */
type PathParams<Path extends string> = ExtractParamNames<Path> extends never
  ? Record<string, never> // no params -> empty object that rejects extra keys
  : {
      [K in ExtractParamNames<Path>]: string;
    };

/**
 * Exact type helper - ensures no extra properties are passed.
 * This catches cases where someone passes { id: "123", extra: "oops" }
 */
type Exact<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

// =============================================================================
// ROUTE DEFINITIONS
// =============================================================================

/**
 * Our route table.
 * IMPORTANT: Using `as const` preserves the literal string types!
 * Without it, paths would just be `string` and type parsing wouldn't work.
 */
const routes = {
  getUser: {
    path: "/users/:id",
    method: "GET",
  },
  listUserPosts: {
    path: "/users/:userId/posts",
    method: "GET",
  },
  getUserPost: {
    path: "/users/:userId/posts/:postId",
    method: "GET",
  },
  createUserPost: {
    path: "/users/:userId/posts",
    method: "POST",
  },
  healthCheck: {
    path: "/health",
    method: "GET",
  },
} as const;

type Routes = typeof routes;
type RouteName = keyof Routes;

/** For a given route name, compute its params type from its path. */
type RouteParams<Name extends RouteName> = PathParams<Routes[Name]["path"]>;

// =============================================================================
// VERIFICATION: Hover over these to see the inferred types!
// =============================================================================

type _Test1 = RouteParams<"getUser">;
//   ^? { id: string }

type _Test2 = RouteParams<"getUserPost">;
//   ^? { userId: string; postId: string }

type _Test3 = RouteParams<"healthCheck">;
//   ^? Record<string, never> (empty - no params)

// =============================================================================
// RUNTIME IMPLEMENTATION
// =============================================================================

/**
 * Fill a path with params at runtime.
 * Types guarantee that `params` has exactly the keys required by the path.
 */
function fillPath<Path extends string>(
  path: Path,
  params: PathParams<Path>
): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value = (params as Record<string, unknown>)[key];
    if (value === undefined) {
      throw new Error(`Missing value for param '${key}'`);
    }
    return encodeURIComponent(String(value));
  });
}

/**
 * Type-safe URL builder:
 * - `name` must be a key of `routes`
 * - `params` must match EXACTLY the `:params` in that route's path
 */
function makeUrl<Name extends RouteName, P extends RouteParams<Name>>(
  name: Name,
  ...args: keyof RouteParams<Name> extends never
    ? [params?: Record<string, never>]
    : [params: Exact<P, RouteParams<Name>>]
): string {
  const route = routes[name];
  const params = args[0] ?? {};
  return fillPath(route.path, params as PathParams<typeof route.path>);
}

// =============================================================================
// ✅ VALID USAGE EXAMPLES
// =============================================================================

const u1 = makeUrl("getUser", { id: "123" });
//    ^ string: "/users/123"
console.log("getUser:", u1);

const postsForUser = makeUrl("listUserPosts", { userId: "abc" });
//                             OK: requires { userId: string }
console.log("listUserPosts:", postsForUser);

const specificPost = makeUrl("getUserPost", {
  userId: "abc",
  postId: "p-999",
});
// OK: requires { userId: string; postId: string }
console.log("getUserPost:", specificPost);

// Routes with no params can pass empty object
const health = makeUrl("healthCheck", {});
console.log("healthCheck:", health);

// =============================================================================
// ❌ ERROR EXAMPLES - These all produce compile errors!
// =============================================================================

// Missing required param (postId):
// ! @ts-expect-error - Property 'postId' is missing
const bad1 = makeUrl("getUserPost", { userId: "abc" });

// Extra param not allowed:
// !@ts-expect-error - Object literal may only specify known properties
const bad2 = makeUrl("getUser", { id: "123", extra: "nope" });

// Wrong param name (should be 'id', not 'userId'):
// !@ts-expect-error - Property 'id' is missing
const bad3 = makeUrl("getUser", { userId: "abc" });

// Wrong route name (typo):
// ! @ts-expect-error - Argument of type '"getUserPosts"' is not assignable
const bad4 = makeUrl("getUserPosts", { userId: "abc" });

// =============================================================================
// HOW IT WORKS (Step by Step)
// =============================================================================

/**
 * Given path: "/users/:userId/posts/:postId"
 *
 * 1. ExtractParamNames recursively matches:
 *    - First: matches `:userId/` → extracts "userId", recurses on "posts/:postId"
 *    - Second: matches `:postId` (trailing) → extracts "postId"
 *    - Result: "userId" | "postId"
 *
 * 2. PathParams maps that union to an object:
 *    - { [K in "userId" | "postId"]: string }
 *    - Result: { userId: string; postId: string }
 *
 * 3. RouteParams looks up the path from routes and applies PathParams
 *
 * 4. Exact<T, Shape> ensures no extra keys are passed
 *
 * 5. TypeScript checks everything at compile time!
 */

// =============================================================================
// BONUS: Type-safe route handler registration
// =============================================================================

type HandlerContext<Params> = {
  params: Params;
  query: Record<string, string>;
  body: unknown;
};

type RouteHandler<Params> = (ctx: HandlerContext<Params>) => Promise<unknown>;

function registerHandler<Name extends RouteName>(
  name: Name,
  handler: RouteHandler<RouteParams<Name>>
): void {
  console.log(`Registered handler for ${name}: ${routes[name].path}`);
  // In real app, would store handler for routing
}

// Usage: handler gets correctly typed params!
registerHandler("getUserPost", async (ctx) => {
  // ctx.params is { userId: string; postId: string }
  const { userId, postId } = ctx.params;
  return { userId, postId, found: true };
});

registerHandler("getUser", async (ctx) => {
  // ctx.params is { id: string }
  const { id } = ctx.params;
  return { id, name: "Alice" };
});

// Handler for route with no params
registerHandler("healthCheck", async (ctx) => {
  // ctx.params is Record<string, never> (empty)
  return { status: "ok", timestamp: Date.now() };
});

// =============================================================================
// THE PUNCHLINE
// =============================================================================

/**
 * - We wrote ~15 lines of type-level code (ExtractParamNames, PathParams, Exact)
 * - Now every route in the app gets:
 *   - Correct param names (autocomplete!)
 *   - Correct param shapes (required vs optional)
 *   - Compile-time errors on typos or missing params
 *   - Compile-time errors on extra/unknown params
 *
 * That's "Turing-complete types" doing real work for you.
 *
 * Libraries like tRPC, Hono, and Zod use these patterns extensively
 * to provide end-to-end type safety without code generation.
 */

// Suppress unused variable warnings for demo error examples
void bad1;
void bad2;
void bad3;
void bad4;

export { routes, makeUrl, registerHandler, type RouteParams, type RouteName };
