import { create } from 'zustand';
import { AppSpec } from './schemas/app-spec';

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
  
  setSpec: (spec: AppSpec) => void;
  updateSpec: (spec: AppSpec) => void;
  undo: () => void;
  redo: () => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsProcessing: (isProcessing: boolean, processingState?: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  spec: null,
  history: [],
  historyIndex: -1,
  chatHistory: [],
  isProcessing: false,
  processingState: "",

  setSpec: (spec) => set((state) => ({
    spec,
    history: [spec],
    historyIndex: 0,
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

  addChatMessage: (msg) => set((state) => ({
    chatHistory: [
      ...state.chatHistory, 
      { ...msg, id: Date.now().toString(), timestamp: Date.now() }
    ]
  })),

  setIsProcessing: (isProcessing, processingState = "") => set({ 
    isProcessing, 
    processingState: isProcessing ? processingState : "" 
  }),
}));
