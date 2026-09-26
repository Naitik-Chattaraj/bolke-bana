import { create } from 'zustand';
import { AppSpec } from './schemas/app-spec';
import { SessionWithSpec } from './supabase/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: number;
}

interface ProjectState {
  spec: AppSpec | null;
  history: AppSpec[];
  historyIndex: number;
  chatHistory: ChatMessage[];
  isProcessing: boolean;
  processingState: string;
  activeSessionId: string | null;
  sessions: SessionWithSpec[];
  
  setSpec: (spec: AppSpec | null) => void;
  updateSpec: (spec: AppSpec) => void;
  undo: () => void;
  redo: () => void;
  setChatHistory: (messages: ChatMessage[]) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string; timestamp?: number }) => ChatMessage;
  setIsProcessing: (isProcessing: boolean, processingState?: string) => void;
  
  setActiveSessionId: (id: string | null) => void;
  setSessions: (sessions: SessionWithSpec[]) => void;
  addSession: (session: SessionWithSpec) => void;
  updateSessionInList: (id: string, updates: Partial<SessionWithSpec>) => void;
  removeSession: (id: string) => void;
  startNewSession: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  spec: null,
  history: [],
  historyIndex: -1,
  chatHistory: [],
  isProcessing: false,
  processingState: "",
  activeSessionId: null,
  sessions: [],

  setSpec: (spec) => set((state) => ({
    spec,
    history: spec ? [spec] : [],
    historyIndex: spec ? 0 : -1,
    isProcessing: false,
    processingState: ""
  })),

  updateSpec: (spec) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(spec);
    return {
      spec,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isProcessing: false,
      processingState: ""
    };
  }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      return {
        spec: state.history[state.historyIndex - 1],
        historyIndex: state.historyIndex - 1
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      return {
        spec: state.history[state.historyIndex + 1],
        historyIndex: state.historyIndex + 1
      };
    }
    return state;
  }),

  setChatHistory: (messages) => set({ chatHistory: messages }),

  addChatMessage: (msg) => {
    const newMessage: ChatMessage = {
      id: msg.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp || Date.now(),
    };
    
    set((state) => ({
      chatHistory: [...state.chatHistory, newMessage]
    }));

    return newMessage;
  },

  setIsProcessing: (isProcessing, processingState = "") => set({ 
    isProcessing, 
    processingState: isProcessing ? processingState : "" 
  }),

  setActiveSessionId: (id) => set({ activeSessionId: id }),

  setSessions: (sessions) => set({ sessions }),

  addSession: (session) => set((state) => ({
    sessions: [session, ...state.sessions.filter(s => s.id !== session.id)],
    activeSessionId: session.id,
  })),

  updateSessionInList: (id, updates) => set((state) => ({
    sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s))
  })),

  removeSession: (id) => set((state) => ({
    sessions: state.sessions.filter(s => s.id !== id),
    activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    chatHistory: state.activeSessionId === id ? [] : state.chatHistory,
    spec: state.activeSessionId === id ? null : state.spec,
  })),

  startNewSession: () => set({
    activeSessionId: null,
    spec: null,
    history: [],
    historyIndex: -1,
    chatHistory: [],
    isProcessing: false,
    processingState: ""
  }),
}));
