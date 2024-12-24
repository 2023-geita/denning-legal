export type Message = {
    id: string;
    text?: string;
    rawResponse?: Record<string, any>;
    role: "user" | "assistant" | "tool";
    toolCalls?: ToolCall[];
  };

  
  export interface ToolCall {
    id: string;
    name: string;
    args: string;
    result?: any;
  }
  