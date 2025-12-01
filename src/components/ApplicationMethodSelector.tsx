import { MessageSquare, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApplicationMethodSelectorProps {
  onSelectMethod: (method: "ai" | "traditional") => void;
}

const ApplicationMethodSelector = ({ onSelectMethod }: ApplicationMethodSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-start/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Smart Application Process
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Choose Your Application Method
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the experience that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Chat Option */}
          <Card 
            className="group relative overflow-hidden cursor-pointer border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-card to-card/50 backdrop-blur" 
            onClick={() => onSelectMethod("ai")}
            style={{ animationDelay: '0.1s' }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-gradient-start/5 transition-all duration-500" />
            
            <CardContent className="p-10 h-full flex flex-col relative z-10">
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-gradient-start flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MessageSquare className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-start rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  AI Chat Assistant
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Complete your application through a guided conversation with our AI assistant. Get instant help and personalized guidance at every step.
                </p>
              </div>
              
              <div className="space-y-3 mb-8 flex-grow">
                {[
                  "Conversational and intuitive",
                  "Real-time assistance and clarification",
                  "Adaptive based on your responses"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 group-hover/item:scale-110 transition-transform" />
                    <p className="text-sm text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full h-12 text-base font-semibold group-hover:shadow-lg group-hover:shadow-primary/30 transition-all bg-gradient-to-r from-primary to-gradient-start hover:from-primary/90 hover:to-gradient-start/90">
                Start AI Chat
                <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Traditional Form Option */}
          <Card 
            className="group relative overflow-hidden cursor-pointer border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 animate-fade-in bg-gradient-to-br from-card to-card/50 backdrop-blur" 
            onClick={() => onSelectMethod("traditional")}
            style={{ animationDelay: '0.2s' }}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/10 group-hover:to-accent/5 transition-all duration-500" />
            
            <CardContent className="p-10 h-full flex flex-col relative z-10">
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <FileText className="w-10 h-10 text-accent-foreground" />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  Traditional Form
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Complete your application using a structured form. Perfect if you prefer to see all fields at once and fill them at your own pace.
                </p>
              </div>
              
              <div className="space-y-3 mb-8 flex-grow">
                {[
                  "Clear, structured layout",
                  "See all requirements upfront",
                  "Save and continue later"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 group/item">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 group-hover/item:scale-110 transition-transform" />
                    <p className="text-sm text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full h-12 text-base font-semibold border-2 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg transition-all">
                Use Traditional Form
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationMethodSelector;
