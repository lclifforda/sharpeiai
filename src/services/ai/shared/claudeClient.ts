import Anthropic from '@anthropic-ai/sdk';

let cachedClient: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (!apiKey) throw new Error('Claude API key not configured');

  if (!cachedClient) {
    cachedClient = new Anthropic({
      apiKey,
      baseURL: import.meta.env.VITE_ANTHROPIC_BASE_URL || undefined,
      dangerouslyAllowBrowser: true,
    });
  }
  return cachedClient;
}

export function getClaudeModel(): string {
  return import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-6';
}

export function hasClaudeKey(): boolean {
  return !!import.meta.env.VITE_CLAUDE_API_KEY;
}
