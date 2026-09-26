import Link from "next/link";
import { Mic, ArrowRight, Zap, Globe, Layout, RefreshCw } from "lucide-react";
import { UserProfileMenu } from "@/components/user-profile-menu";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Mic className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Bolke Bana</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link 
              href="/builder" 
              className="text-sm font-medium hover:text-primary transition-colors hidden sm:inline"
            >
              Go to Builder
            </Link>
            <UserProfileMenu />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Sarvam AI Powered
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
            Build software.<br />
            <span className="text-primary">Just say what you need.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl">
            Turn your ideas into working prototypes using natural language and voice — across India's languages.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/builder" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring gap-2"
            >
              <Mic className="w-4 h-4" />
              Start building
            </Link>
            <Link 
              href="#how-it-works" 
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              See how it works
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-secondary/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">From words to software.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-8 left-1/10 right-1/10 h-0.5 bg-border -z-10"></div>
              
              {[
                { icon: Mic, title: "Speak", desc: "Describe your idea naturally" },
                { icon: Zap, title: "Understand", desc: "Sarvam AI extracts requirements" },
                { icon: Layout, title: "Structure", desc: "Blueprint is generated" },
                { icon: Globe, title: "Build", desc: "Live prototype is rendered" },
                { icon: RefreshCw, title: "Iterate", desc: "Refine with more voice commands" },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-background border shadow-sm flex items-center justify-center mb-6 relative">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Multilingual */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for how India speaks.</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Speak in Hindi, Tamil, Bengali, Telugu, Marathi, Kannada, English, or Hinglish. Bolke Bana understands your code-mixed language and builds exactly what you mean.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {["हिंदी", "தமிழ்", "বাংলা", "తెలుగు", "मराठी", "ಕನ್ನಡ", "English", "Hinglish"].map(lang => (
                <span key={lang} className="px-4 py-2 rounded-full border bg-secondary/20 text-sm font-medium">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Built with Next.js & Sarvam AI</p>
      </footer>
    </div>
  );
}
