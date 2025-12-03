import { useState, useEffect, useCallback } from 'react';
import { agentAPI } from '../services/ai/agentAPI';
import type { AiMessage } from '../services/ai/types';

interface UseAiAgentReturn {
  sendMessage: (message: string, context?: any) => Promise<void>;
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
    } catch (error) {
      console.error('Failed to initialize AI agent connection:', error);
      // In demo mode, still allow connections even if initialization fails
      if (import.meta.env.VITE_DEMO_MODE === 'true') {
        setIsConnected(true);
        setConnectionStatus('connected');
      } else {
        setIsConnected(false);
        setConnectionStatus('error');
      }
    }
  };

  const sendMessage = useCallback(async (message: string, context?: any) => {
    if (isLoading) return;

    // In demo mode, allow sending messages even if not "connected" yet
    // The API will handle demo mode responses
    if (!isConnected && import.meta.env.VITE_DEMO_MODE !== 'true') {
      console.warn('AI agent not connected yet');
      return;
    }

    setIsLoading(true);
    try {
      const response = await agentAPI.sendMessage(sessionId, message, context);
      
      setLastMessage({
        text: response.message,
        type: response.type || 'text',
        qualification: response.qualification,
        suggestions: response.suggestions
      });

    } catch (error) {
      console.error('Failed to send message to AI agent:', error);
      setLastMessage({
        text: 'Sorry, I encountered an error processing your message. Please try again.',
        type: 'text'
      });
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
