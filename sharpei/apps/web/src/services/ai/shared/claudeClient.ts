// Stubbed — AI is handled server-side via NestJS /api/ai endpoints (Phase 4)
// This file preserves the interface so existing AI components don't break at import time.

export function getClaudeClient(): any {
  throw new Error('AI is handled server-side. Use the /api/ai endpoints instead.');
}

export function getClaudeModel(): string {
  return 'claude-sonnet-4-6';
}

export function hasClaudeKey(): boolean {
  return false;
}
