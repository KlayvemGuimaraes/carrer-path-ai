import { createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import type { Env } from "../main.ts";

/**
 * @module HELLO_TOOL
 * @description A simple tool to demonstrate the basic functionality of Deco Chat SDK.
 * It takes a name as input and returns a greeting message.
 */

// 1. Define o schema de entrada (input) usando Zod.
//    Isso garante que os dados recebidos pela tool são tipados e validados.
const inputSchema = z.object({
  name: z.string().describe("The name to be included in the greeting."),
});

// 2. Define o schema de saída (output) usando Zod.
//    Isso garante que o resultado retornado pela tool seja consistente.
const outputSchema = z.object({
  message: z.string().describe("The complete greeting message."),
});

// 3. Cria a "factory function" que gera a tool.
//    A SDK do Deco espera uma função que recebe `env` e retorna a tool.
const createHelloTool = (env: Env) => createTool({
  // ID único para a tool. Usado para chamá-la via RPC.
  id: "HELLO_TOOL",

  // Descrição clara do que a tool faz.
  description: "A simple tool that returns a greeting message.",

  // Associa os schemas de entrada e saída.
  inputSchema,
  outputSchema,

  // 4. Implementa a lógica de execução da tool.
  //    A função `execute` recebe o `context`, que contém o input validado.
  execute: async ({ context }) => {
    // A lógica é simples: apenas formata a mensagem de saudação.
    const message = `Hello, ${context.name}!`;

    // Retorna o objeto de saída, que será validado pelo `outputSchema`.
    return {
      message,
    };
  },
});

// 5. Onde continuar a partir daqui (próximos passos do tutorial):
//    - O próximo passo geralmente envolve criar um "workflow" que utiliza esta tool.
//    - Você pode criar um arquivo `server/workflows/greetingWorkflow.ts`
//    - E usar `createWorkflow` e `createStepFromTool` para orquestrar chamadas.

export default createHelloTool;
