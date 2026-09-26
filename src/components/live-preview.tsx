import React, { useState } from 'react';
import { AppSpec, UIComponent, Page } from '@/lib/schemas/app-spec';
import { Layout, Menu, Bell, User, ChevronRight } from 'lucide-react';

export function LivePreview({ spec }: { spec: AppSpec | null }) {
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  if (!spec) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
          <Layout className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">No Prototype Yet</h3>
          <p className="text-sm max-w-sm">Use voice commands to describe your application, and Bolke Bana will build it here.</p>
        </div>
      </div>
    );
  }

  // Set default page if not set
  const pages = spec.pages || [];
  const activePageId = currentPageId || (pages.length > 0 ? pages[0].id : null);
  const activePage = pages.find(p => p.id === activePageId);
  const themeColor = (spec.theme?.primaryColor as string) || '#10b981';
  return (
    <div className="w-full h-full bg-background flex flex-col rounded-xl overflow-hidden shadow-sm border border-border/50 transition-all duration-300 relative">
      {/* Fake Browser Chrome */}
      <div className="h-12 border-b bg-secondary/20 flex items-center px-4 gap-4 shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 max-w-md mx-auto h-7 bg-background rounded-md border flex items-center justify-center text-[11px] text-muted-foreground">
          {spec.project.name}.bolkebana.app
        </div>
      </div>

      {/* App Shell */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-14 border-b flex items-center justify-between px-6 shrink-0" style={{ borderBottomColor: themeColor }}>
          <div className="flex items-center gap-4">
            <Menu className="w-5 h-5 text-muted-foreground" />
            <span className="font-bold tracking-tight" style={{ color: themeColor }}>{spec.project.name}</span>
          </div>
          <div className="flex items-center gap-4">
            {spec.navigation?.map(nav => (
              <button 
                key={nav.pageId}
                onClick={() => setCurrentPageId(nav.pageId)}
                className={`text-sm font-medium transition-colors ${activePageId === nav.pageId ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {nav.label}
              </button>
            ))}
            <div className="flex items-center gap-3 ml-4 border-l pl-4">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 md:p-10 bg-secondary/5">
          {activePage ? (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
              {/* Header area of page */}
              <div className="mb-8 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{activePage.name}</h1>
                <p className="text-muted-foreground">{activePage.purpose}</p>
              </div>

              {/* Dynamic Components */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {activePage.components?.map(comp => (
                  <DynamicComponent key={comp.id} component={comp} themeColor={themeColor} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Page not found
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function DynamicComponent({ component, themeColor }: { component: UIComponent, themeColor: string }) {
  const { type, props } = component;
  
  // Decide column span based on type (simple heuristic)
  let colSpan = "col-span-12";
  if (type === "stat") colSpan = "col-span-12 sm:col-span-6 lg:col-span-3";
  if (type === "chart" || type === "card") colSpan = "col-span-12 md:col-span-6";

  switch (type) {
    case 'heading':
      return <h2 className={`${colSpan} text-2xl font-bold mt-4 mb-2`}>{String(props.text || '')}</h2>;
    
    case 'paragraph':
      return <p className={`${colSpan} text-muted-foreground`}>{String(props.text || '')}</p>;
    
    case 'stat':
      return (
        <div className={`${colSpan} rounded-xl border bg-background p-6 shadow-sm`}>
          <p className="text-sm font-medium text-muted-foreground mb-2">{String(props.label || '')}</p>
          <p className="text-3xl font-bold" style={{ color: String(props.value || '').includes('%') ? (parseInt(String(props.value)) < 80 ? '#ef4444' : themeColor) : undefined }}>
            {String(props.value || '')}
          </p>
        </div>
      );
    
    case 'alert':
      const isDestructive = props.variant === 'destructive';
      return (
        <div className={`${colSpan} rounded-lg border p-4 ${isDestructive ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-primary/10 border-primary/20 text-primary'}`}>
          <h4 className="font-medium mb-1">{String(props.title || '')}</h4>
          <p className="text-sm opacity-90">{String(props.description || '')}</p>
        </div>
      );

    case 'chart':
      return (
        <div className={`${colSpan} rounded-xl border bg-background p-6 shadow-sm flex flex-col h-64`}>
          <h4 className="font-medium mb-4">{String(props.title || '')}</h4>
          <div className="flex-1 w-full flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 85].map((val, i) => (
              <div key={i} className="w-full rounded-t-sm bg-primary/20 relative group" style={{ height: `${val}%` }}>
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: themeColor }}></div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>
      );

    case 'list':
      const items = Array.isArray(props.items) ? props.items : [];
      return (
        <div className={`${colSpan} rounded-xl border bg-background shadow-sm overflow-hidden`}>
          <div className="px-4 py-3 border-b bg-secondary/30 font-medium text-sm">
            {String(props.title || "List Items")}
          </div>
          <div className="divide-y">
            {items.map((item: any, i: number) => (
              <div key={i} className="px-4 py-3 text-sm flex items-center justify-between hover:bg-secondary/10">
                <span>{String(item)}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">No items to display</div>
            )}
          </div>
        </div>
      );

    case 'button':
      return (
        <div className={`${colSpan} flex ${props.align === 'center' ? 'justify-center' : props.align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <button className="h-10 px-4 rounded-md font-medium text-sm text-white shadow-sm transition-opacity hover:opacity-90" style={{ backgroundColor: themeColor }}>
            {String(props.text || "Submit")}
          </button>
        </div>
      );

    default:
      return (
        <div className={`${colSpan} rounded-md border border-dashed p-4 flex items-center justify-center text-sm text-muted-foreground bg-secondary/10`}>
          [{type} component]
        </div>
      );
  }
}
