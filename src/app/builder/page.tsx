"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Mic, 
  Send, 
  Undo, 
  Redo, 
  Download, 
  Play, 
  Settings,
  MessageSquare,
  Layout,
  Square,
  Loader2
} from "lucide-react";
import { useProjectStore } from "@/lib/store";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { LivePreview } from "@/components/live-preview";
import { BlueprintPanel } from "@/components/blueprint-panel";

export default function BuilderPage() {
  const { 
    spec, 
    chatHistory, 
    addChatMessage, 
    updateSpec, 
    setSpec, 
    undo, 
    redo,
    historyIndex,
    history,
    isProcessing,
    processingState,
    setIsProcessing
  } = useProjectStore();
  
  const [inputText, setInputText] = useState("");
  const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder();
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isProcessing]);

  const handleProcessInstruction = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    addChatMessage({ role: "user", content: text });
    
    setIsProcessing(true, "Understanding...");
    
    try {
      if (!spec) {
        // Generate new spec
        setIsProcessing(true, "Building your idea...");
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: text })
        });
        
        if (!response.ok) throw new Error("Failed to generate");
        
        const data = await response.json();
        setSpec(data.spec);
        addChatMessage({ role: "assistant", content: "Your application blueprint is ready." });
      } else {
        // Update existing spec
        setIsProcessing(true, "Updating prototype...");
        const response = await fetch('/api/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentSpec: spec, instruction: text })
        });
        
        if (!response.ok) throw new Error("Failed to update");
        
        const data = await response.json();
        updateSpec(data.spec);
        addChatMessage({ role: "assistant", content: "I've updated the application based on your instruction." });
      }
    } catch (error) {
      console.error(error);
      addChatMessage({ role: "assistant", content: "Sorry, I encountered an error while processing that." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      handleProcessInstruction(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        setIsProcessing(true, "Transcribing...");
        try {
          const formData = new FormData();
          formData.append('file', audioBlob);
          
          const response = await fetch('/api/speech', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) throw new Error("Transcription failed");
          
          const { transcript } = await response.json();
          if (transcript) {
            setInputText(transcript);
          }
        } catch (error) {
          console.error(error);
          alert("Transcription failed. Please try again or use text input.");
        } finally {
          setIsProcessing(false);
        }
      }
    } else {
      startRecording();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navigation */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-background z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <span>Bolke Bana</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="font-medium text-sm text-muted-foreground">
            {spec ? spec.project.name : "Untitled Project"}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select className="h-8 rounded-md border bg-background px-3 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option>Hindi</option>
            <option>English</option>
            <option>Hinglish</option>
            <option>Tamil</option>
            <option>Bengali</option>
          </select>
          <div className="flex items-center border rounded-md overflow-hidden h-8 bg-background">
            <button 
              onClick={undo}
              disabled={historyIndex <= 0}
              className="px-3 h-full hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors flex items-center justify-center disabled:opacity-50 disabled:hover:bg-transparent" 
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <div className="w-px h-full bg-border" />
            <button 
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="px-3 h-full hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors flex items-center justify-center disabled:opacity-50 disabled:hover:bg-transparent" 
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
          <button className="h-8 px-4 rounded-md bg-secondary text-secondary-foreground text-xs font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors hidden sm:flex">
            <Play className="w-3.5 h-3.5" />
            Preview
          </button>
          <button className="h-8 px-4 rounded-md border bg-background text-xs font-medium flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors hidden sm:flex">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Conversation */}
        <aside className="w-[320px] md:w-[380px] shrink-0 border-r flex flex-col bg-background relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="h-10 border-b flex items-center px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider bg-secondary/30 shrink-0">
            <MessageSquare className="w-3.5 h-3.5 mr-2" />
            Conversation
          </div>
          
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 scroll-smooth">
            {chatHistory.length === 0 ? (
              <div className="text-center flex flex-col items-center justify-center h-full text-muted-foreground space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                  <Mic className="w-8 h-8 text-primary/50" />
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Ready to build</p>
                  <p className="text-sm">Press the microphone and tell me what you want to create.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      {msg.role === 'assistant' && (
                        <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                          <Mic className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {msg.role === 'user' ? 'You' : 'Bolke Bana'}
                      </span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[90%] text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-secondary border text-foreground rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex flex-col items-start animate-in fade-in">
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                        <Loader2 className="w-3 h-3 text-primary animate-spin" />
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        Bolke Bana
                      </span>
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl bg-secondary border text-foreground rounded-tl-sm text-sm flex items-center gap-2 shadow-sm">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      {processingState}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t bg-background shrink-0">
            <div className="relative flex items-end gap-2">
              <div className="relative flex-1">
                <textarea 
                  className="w-full min-h-[44px] max-h-[200px] resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm pr-12"
                  placeholder="Tell Bolke Bana what to build..."
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isRecording || isProcessing}
                />
                <button 
                  onClick={handleSendText}
                  disabled={!inputText.trim() || isRecording || isProcessing}
                  className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={toggleRecording}
                disabled={isProcessing}
                className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 disabled:opacity-50 
                  ${isRecording 
                    ? 'bg-destructive text-destructive-foreground animate-pulse' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
              >
                {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            
            {isRecording && (
              <div className="mt-3 flex items-center justify-between text-xs font-medium text-destructive px-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                  </span>
                  Listening...
                </div>
                <span className="tabular-nums">00:{recordingTime.toString().padStart(2, '0')}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Center Panel: Live Preview */}
        <main className="flex-1 flex flex-col bg-secondary/20 relative min-w-0">
          <div className="h-10 border-b flex items-center px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider bg-background/50 backdrop-blur-sm absolute top-0 left-0 right-0 z-10">
            <Layout className="w-3.5 h-3.5 mr-2" />
            Live Preview
          </div>
          
          <div className="flex-1 overflow-auto p-4 md:p-8 pt-16 flex items-start justify-center">
            <LivePreview spec={spec} />
          </div>
        </main>

        {/* Right Panel: Blueprint */}
        <BlueprintPanel spec={spec} />
      </div>
    </div>
  );
}
