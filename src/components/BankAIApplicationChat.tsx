import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, AlertTriangle, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownText } from "@/components/MarkdownText";
import { ChatBubble, SuggestionButtons, DocumentUploadCards, TypingIndicator } from "@/components/chat";

import ChatMessages from "@/components/ai-chat/ChatMessages";
import FormSectionCard from "@/components/ai-chat/FormSectionCard";
import { useChatStateMachine } from "@/components/ai-chat/useChatStateMachine";

interface BankAIApplicationChatProps {
  applicationType?: string;
}

const BankAIApplicationChat = ({ applicationType: initialType }: BankAIApplicationChatProps) => {
  const sm = useChatStateMachine({
    flowType: "bank",
    applicationType: initialType || "equipment-financing",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sm.messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (sm.inputValue.trim()) sm.handleUserMessage(sm.inputValue);
    }
  };

  return (
    <div>
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden min-h-0">
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 md:p-5 lg:p-6">
              <div className="space-y-3 md:space-y-4">
                {sm.messages.map((message, index) => (
                  <div key={message.id || index}>
                    {/* Form Section Card */}
                    {message.type === "form_section" && message.formSectionData && (
                      <FormSectionCard
                        sectionId={message.formSectionData.sectionId}
                        title={message.formSectionData.title}
                        fields={message.formSectionData.fields}
                        initialValues={message.formSectionData.initialValues}
                        onSubmit={sm.handleSectionSubmit}
                        isSubmitted={message.formSectionData.isSubmitted}
                        submittedValues={message.formSectionData.submittedValues}
                        stepLabel={message.formSectionData.stepLabel}
                        applicationType={sm.applicationType}
                      />
                    )}

                    {/* Document Upload */}
                    {message.type === "document_upload" && (
                      <div className="mb-3">
                        <div className="flex gap-2 mb-3">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                          </div>
                          <div className="bg-muted text-foreground rounded-2xl p-3 md:p-4 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[65%]">
                            <MarkdownText content={message.content} className="text-xs md:text-sm" />
                          </div>
                        </div>
                        <DocumentUploadCards
                          documents={sm.requiredDocuments}
                          uploadedDocs={sm.uploadedDocs}
                          documentVerification={sm.documentVerification as any}
                          onUpload={sm.handleFileUpload}
                          onRemove={sm.handleRemoveFile}
                        />
                      </div>
                    )}

                    {/* Disqualified */}
                    {message.type === "disqualified" && (
                      <div className="mb-3">
                        <div className="rounded-xl border-2 border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-900/10 p-6 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-base font-semibold text-foreground">We'd Like to Help</h3>
                              <p className="text-sm text-muted-foreground">{message.content}</p>
                              <p className="text-sm text-muted-foreground">A member of our team will contact you within 1 business day.</p>
                              <p className="text-xs text-muted-foreground">
                                Reference: REF-{Date.now().toString(36).toUpperCase().slice(-6)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submitted confirmation */}
                    {message.type === "submitted" && (
                      <div className="mb-3">
                        <div className="rounded-xl border-2 border-green-500 bg-green-500/5 p-6 text-center space-y-3">
                          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-foreground">Application Submitted</h3>
                          <MarkdownText content={message.content} className="text-sm text-muted-foreground" />
                        </div>
                      </div>
                    )}

                    {/* Regular AI/user messages */}
                    {message.type !== "form_section" &&
                      message.type !== "document_upload" &&
                      message.type !== "disqualified" &&
                      message.type !== "submitted" && (
                        <ChatMessages message={message} onSendMessage={sm.handleUserMessage} />
                      )}
                  </div>
                ))}
                {sm.isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>

          {/* Sticky Submit Bar — always visible during document upload phase */}
          {sm.phase === "document_upload" && (
            <div className="border-t-2 border-primary/20 bg-primary/5 px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>
                    {Object.values(sm.uploadedDocs).filter(Boolean).length} of {sm.requiredDocuments.length} documents uploaded
                  </span>
                </div>
                <Button
                  onClick={() => sm.handleUserMessage("Submit application")}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md px-6"
                >
                  Submit Application
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={sm.inputValue}
                onChange={(e) => sm.setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  sm.phase === "disqualified"
                    ? "Application paused"
                    : sm.phase === "submitted"
                    ? "Application submitted"
                    : sm.phase === "document_upload"
                    ? "Ask a question about the documents..."
                    : "Type your message or ask a question..."
                }
                className="flex-1 text-sm"
                disabled={sm.isTyping || sm.phase === "disqualified" || sm.phase === "submitted"}
              />
              <Button
                onClick={() => {
                  if (sm.inputValue.trim()) sm.handleUserMessage(sm.inputValue);
                }}
                disabled={!sm.inputValue.trim() || sm.isTyping || sm.phase === "disqualified" || sm.phase === "submitted"}
                size="icon"
                className="h-9 w-9"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAIApplicationChat;
