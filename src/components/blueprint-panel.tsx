import React from 'react';
import { AppSpec } from '@/lib/schemas/app-spec';
import { FileCode, Database, LayoutTemplate, Zap } from 'lucide-react';

export function BlueprintPanel({ spec }: { spec: AppSpec | null }) {
  if (!spec) {
    return (
      <aside className="w-[300px] shrink-0 border-l flex flex-col bg-background relative z-10 hidden lg:flex">
        <div className="h-10 border-b flex items-center px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider bg-secondary/30">
          <FileCode className="w-3.5 h-3.5 mr-2" />
          Blueprint
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-muted-foreground">
          <FileCode className="w-8 h-8 mb-4 opacity-20" />
          <p className="text-sm">No blueprint generated yet.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[300px] md:w-[340px] shrink-0 border-l flex flex-col bg-background relative z-10 hidden lg:flex">
      <div className="h-10 border-b flex items-center px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider bg-secondary/30">
        <FileCode className="w-3.5 h-3.5 mr-2" />
        Blueprint
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-20">
        {/* Project Info */}
        <div>
          <h2 className="text-lg font-bold mb-1">{spec.project.name}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{spec.project.description}</p>
          
          {spec.project.targetUsers && spec.project.targetUsers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {spec.project.targetUsers.map((user, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground border">
                  User: {user}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Features
          </h3>
          <div className="space-y-2">
            {spec.features.map((feature, i) => (
              <div key={i} className="p-3 rounded-lg border bg-secondary/10">
                <div className="font-medium text-sm">{feature.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pages */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <LayoutTemplate className="w-3.5 h-3.5" /> Pages
          </h3>
          <div className="space-y-2">
            {spec.pages.map((page, i) => (
              <div key={i} className="p-3 rounded-lg border bg-secondary/10">
                <div className="font-medium text-sm flex items-center justify-between">
                  {page.name}
                  <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border">{page.components?.length || 0} blocks</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{page.purpose}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Model */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Data Model
          </h3>
          <div className="space-y-3">
            {spec.entities.map((entity, i) => (
              <div key={i} className="rounded-lg border overflow-hidden">
                <div className="bg-secondary/30 px-3 py-2 font-medium text-sm border-b">
                  {entity.name}
                </div>
                <div className="divide-y bg-background">
                  {entity.fields.map((field, j) => (
                    <div key={j} className="px-3 py-2 flex items-center justify-between text-xs">
                      <span className="font-mono">{field.name}</span>
                      <span className="text-muted-foreground">{field.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {(!spec.entities || spec.entities.length === 0) && (
              <div className="text-sm text-muted-foreground italic">No entities defined.</div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
