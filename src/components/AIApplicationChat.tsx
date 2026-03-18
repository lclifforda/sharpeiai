import { useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Bot, AlertTriangle, FileText } from "lucide-react";
import robotImage from "@/assets/humanoid-robot.webp";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownText } from "@/components/MarkdownText";

import { monthlyRate, maintenanceCost, insuranceCost } from "@/components/ai-chat/helpers";
import ChatMessages from "@/components/ai-chat/ChatMessages";
import { OfferMessage, ComparisonMessage } from "@/components/ai-chat/OfferSection";
import { ContractMessage, CompletionMessage } from "@/components/ai-chat/ContractSection";
import DocumentUploadSection from "@/components/ai-chat/DocumentUploadSection";
import FormSectionCard from "@/components/ai-chat/FormSectionCard";
import { useChatStateMachine } from "@/components/ai-chat/useChatStateMachine";

interface AIApplicationChatProps {
  applicationType?: string;
}

const AIApplicationChat = ({ applicationType: propApplicationType }: AIApplicationChatProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.quantity ? location.state : null;
  const hasOrderDetails = !!orderDetails;
  const applicationType = propApplicationType || location.state?.applicationType || "equipment-financing";

  const calculateTotal = () => {
    if (!orderDetails) return 0;
    let total = monthlyRate * orderDetails.quantity;
    if (orderDetails.maintenance) total += maintenanceCost;
    if (orderDetails.insurance) total += insuranceCost;
    return total;
  };

  const cartTotal = calculateTotal();
  const cartItems = useMemo(
    () =>
      hasOrderDetails
        ? [{ name: "Humanoid Robot F-02", price: cartTotal, quantity: orderDetails.quantity }]
        : [{ name: "Equipment", price: 0, quantity: 1 }],
    [hasOrderDetails, cartTotal, orderDetails?.quantity]
  );

  const sm = useChatStateMachine({
    flowType: "merchant",
    applicationType,
    orderDetails,
    cartTotal,
    cartItems,
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[95vw] xl:max-w-[98vw] 2xl:max-w-[1600px] mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-sm h-8">
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Back
        </Button>

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-1">AI-Guided Application</h1>
          <p className="text-sm text-muted-foreground">Complete your leasing application through conversation</p>
        </div>

        <div className={`${hasOrderDetails ? "grid lg:grid-cols-3" : ""} gap-6 max-w-[95vw] xl:max-w-[98vw] 2xl:max-w-[1600px] mx-auto`}>
          {/* Chat Area */}
          <div className="lg:col-span-2">
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
                              applicationType={applicationType}
                            />
                          )}

                          {/* Offer Card */}
                          {message.type === "offer" && message.offerData && (
                            <OfferMessage message={message} onSendMessage={sm.handleUserMessage} />
                          )}

                          {/* Contract Card */}
                          {message.type === "contract" && message.contractData && (
                            <ContractMessage message={message} onSendMessage={sm.handleUserMessage} />
                          )}

                          {/* Completion */}
                          {message.type === "completion" && message.data && (
                            <CompletionMessage message={message} />
                          )}

                          {/* Comparison */}
                          {message.type === "comparison" && message.comparisonData && (
                            <ComparisonMessage
                              message={message}
                              onSendMessage={sm.handleUserMessage}
                              onChooseFinancing={() => sm.handleUserMessage("Show me Financing options")}
                              onChooseLease={() => sm.handleUserMessage("Show me Lease options")}
                            />
                          )}

                          {/* Document Upload */}
                          {message.type === "document_upload" && (
                            <DocumentUploadSection
                              message={message}
                              requiredDocuments={sm.requiredDocuments}
                              uploadedDocs={sm.uploadedDocs}
                              documentVerification={sm.documentVerification as any}
                              onFileUpload={sm.handleFileUpload}
                              onRemoveFile={sm.handleRemoveFile}
                              onSendMessage={sm.handleUserMessage}
                              onContinueToContract={() => sm.handleUserMessage("Continue to contract")}
                            />
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Regular AI/user messages */}
                          {message.type !== "form_section" &&
                            message.type !== "offer" &&
                            message.type !== "contract" &&
                            message.type !== "completion" &&
                            message.type !== "comparison" &&
                            message.type !== "document_upload" &&
                            message.type !== "disqualified" &&
                            message.type !== "submitted" && (
                              <ChatMessages message={message} onSendMessage={sm.handleUserMessage} />
                            )}
                        </div>
                      ))}
                      {sm.isTyping && (
                        <div className="flex gap-2">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                          </div>
                          <div className="bg-muted rounded-2xl p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </ScrollArea>

                {/* Sticky Continue Bar — always visible during document upload phase */}
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
                        onClick={() => sm.handleUserMessage("Continue to contract")}
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md px-6"
                      >
                        Continue to Contract
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
                          : sm.phase === "document_upload"
                          ? "Ask a question about the documents..."
                          : "Type your message or ask a question..."
                      }
                      className="flex-1 text-sm"
                      disabled={sm.isTyping || sm.phase === "disqualified" || sm.phase === "complete"}
                    />
                    <Button
                      onClick={() => {
                        if (sm.inputValue.trim()) sm.handleUserMessage(sm.inputValue);
                      }}
                      disabled={!sm.inputValue.trim() || sm.isTyping || sm.phase === "disqualified" || sm.phase === "complete"}
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

          {/* Order Summary sidebar — only for merchant with order context */}
          {hasOrderDetails && orderDetails && (
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Application Summary</h2>

                    <div className="space-y-4 pb-4 border-b border-border">
                      <div className="flex gap-4">
                        <img src={robotImage} alt="Humanoid Robot" className="w-20 h-20 object-contain rounded-md bg-muted" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">Humanoid Robot F-02</h3>
                          <p className="text-sm text-muted-foreground">SKU: HR-F02-2024</p>
                          <p className="text-sm text-muted-foreground mt-1">Qty: {orderDetails.quantity}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 py-4 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Equipment Lease</span>
                        <span className="font-medium text-foreground">${monthlyRate * orderDetails.quantity}/mo</span>
                      </div>
                      {orderDetails.maintenance && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Maintenance Package</span>
                          <span className="font-medium text-foreground">${maintenanceCost}/mo</span>
                        </div>
                      )}
                      {orderDetails.insurance && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Insurance Coverage</span>
                          <span className="font-medium text-foreground">${insuranceCost}/mo</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lease Term</span>
                        <span className="font-medium text-foreground">{orderDetails.term} months</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Down Payment</span>
                        <span className="font-medium text-foreground">${orderDetails.downPayment}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-border">
                        <span className="font-semibold text-foreground">Total Monthly Payment</span>
                        <span className="font-bold text-xl text-primary">${cartTotal}/mo</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIApplicationChat;
