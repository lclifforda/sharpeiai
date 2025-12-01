import { MessageSquare, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApplicationMethodSelectorProps {
  onSelectMethod: (method: "ai" | "traditional") => void;
}

const ApplicationMethodSelector = ({ onSelectMethod }: ApplicationMethodSelectorProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Application Method</h1>
          <p className="text-lg text-muted-foreground">Select how you'd like to complete your leasing application</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Chat Option */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary" onClick={() => onSelectMethod("ai")}>
            <CardContent className="p-8 h-full flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-3">AI Chat Assistant</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Complete your application through a guided conversation with our AI assistant. Get instant help and personalized guidance at every step.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-muted-foreground">Conversational and intuitive</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-muted-foreground">Real-time assistance and clarification</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p className="text-sm text-muted-foreground">Adaptive based on your responses</p>
                </div>
              </div>

              <Button className="w-full group-hover:shadow-md transition-shadow">
                Start AI Chat
              </Button>
            </CardContent>
          </Card>

          {/* Traditional Form Option */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary" onClick={() => onSelectMethod("traditional")}>
            <CardContent className="p-8 h-full flex flex-col">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:bg-accent/80 transition-colors">
                <FileText className="w-8 h-8 text-foreground" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-3">Traditional Form</h2>
              <p className="text-muted-foreground mb-6 flex-grow">
                Complete your application using a structured form. Perfect if you prefer to see all fields at once and fill them at your own pace.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-2" />
                  <p className="text-sm text-muted-foreground">Clear, structured layout</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-2" />
                  <p className="text-sm text-muted-foreground">See all requirements upfront</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-2" />
                  <p className="text-sm text-muted-foreground">Save and continue later</p>
                </div>
              </div>

              <Button variant="outline" className="w-full group-hover:shadow-md transition-shadow">
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
