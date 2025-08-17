/**
 * @file server/tools/index.ts
 * @description This file serves as a central registry for all tools in the application.
 * It imports individual tool definitions and exports them as a single array
 * to be consumed by the Deco runtime. This pattern makes it easy to add or
 * remove tools without modifying the main server file.
 */

import createHelloTool from "./hello.ts";
import createCertSearchTool from "./certSearch.ts";
import createCertRecommendTool from "./certRecommend.ts";
import createGitHubEvalTool from "./githubEval.ts";


// The `tools` array is registered with the Deco runtime.
// It should contain the "factory functions" that create the tools.
export const tools = [
  createHelloTool,
  createCertSearchTool,
  createCertRecommendTool,
  createGitHubEvalTool,
];
