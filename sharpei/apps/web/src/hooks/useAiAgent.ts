import { useState, useEffect, useCallback } from 'react';
import { agentAPI } from '../services/ai/agentAPI';
import type { AiMessage } from '../services/ai/types';

interface UseAiAgentReturn {
  sendMessage: (message: string, context?: any) => Promise<AiMessage | null>;
  isLoading: boolean;
  isConnected: boolean;
  lastMessage: AiMessage | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export const useAiAgent = (sessionId: string): UseAiAgentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<AiMessage | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    if (sessionId) {
      initializeConnection();
    }
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeConnection = async () => {
    try {
      setConnectionStatus('connecting');
      await agentAPI.initialize(sessionId);
      setIsConnected(true);
      setConnectionStatus('connected');
    } catch {
      // AI backend not available yet (Phase 4) — degrade silently
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }
  };

  const sendMessage = useCallback(async (message: string, context?: any): Promise<AiMessage | null> => {
    if (isLoading) return null;

    if (!isConnected && import.meta.env.VITE_DEMO_MODE !== 'true') {
      console.warn('AI agent not connected yet');
      return null;
    }

    setIsLoading(true);
    try {
      const response = await agentAPI.sendMessage(sessionId, message, context);

      const aiMessage: AiMessage = {
        text: response.message,
        type: response.type || 'text',
        qualification: response.qualification,
        suggestions: response.suggestions
      };
      setLastMessage(aiMessage);
      return aiMessage;

    } catch (error) {
      console.error('Failed to send message to AI agent:', error);
      const errorMessage: AiMessage = {
        text: 'Sorry, I encountered an error processing your message. Please try again.',
        type: 'text'
      };
      setLastMessage(errorMessage);
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isConnected, isLoading]);

  return {
    sendMessage,
    isLoading,
    isConnected,
    lastMessage,
    connectionStatus
  };
};
