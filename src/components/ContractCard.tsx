import React, { useState, useRef } from 'react';

interface Offer {
  id: string;
  type: 'financing' | 'lease';
  lender: string;
  apr: number;
  termMonths: number;
  downPayment: number;
  monthlyPayment: number;
  totalAmount: number;
  residuals?: {
    name: string;
    percentage: number;
    value: number;
  }[];
}

interface ContractCardProps {
  offer: Offer;
  onSign: () => void;
}

const ContractCard: React.FC<ContractCardProps> = ({
  offer,
  onSign,
}) => {
  const { lender, apr, termMonths, downPayment, monthlyPayment, totalAmount, type } = offer;
  // Demo customer data - in production this would come from the form
  const customerName = "Demo Customer";
  const customerEmail = "customer@example.com";
  
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };
  
  const handleSignContract = () => {
    if (signature) {
      setShowSignatureModal(false);
      onSign();
    }
  };
  return (
    <div className="rounded-xl overflow-hidden border-2 shadow-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-bold">Equipment Financing Agreement</h3>
            <p className="text-purple-100 text-sm">{lender}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-xs font-semibold">📝 Ready to Sign</span>
          </div>
        </div>
      </div>

      {/* DocuSign Section */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10 border-border">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1 text-primary">
              📧 Contract sent to {customerEmail}
            </p>
            <p className="text-xs text-muted-foreground">
              Please check your email and click the link below
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSignatureModal(true)}
          className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] text-center shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Review & Sign Contract
          </span>
        </button>
        <p className="text-xs mt-2 text-center text-muted-foreground">
          🔒 Secure electronic signature
        </p>
      </div>

      {/* Contract Summary */}
      <div className="p-6 bg-card">
        <h4 className="text-sm font-semibold mb-4 text-foreground">
          📄 Contract Summary
        </h4>

        {/* Parties */}
        <div className="p-3 rounded-lg mb-4 bg-muted/50">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-muted-foreground">Between:</span>
            <span className="font-semibold text-foreground">
              {lender}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">And:</span>
            <span className="font-semibold text-foreground">
              {customerName}
            </span>
          </div>
        </div>

        {/* Key Terms Grid */}
        <div className={`grid gap-3 p-4 rounded-lg mb-4 bg-muted/50 ${
          type === 'lease' ? 'grid-cols-3' : 'grid-cols-2'
        }`}>
          <div>
            <div className="text-xs mb-1 text-muted-foreground">
              {type === 'lease' ? 'Total Equipment Value' : 'Total Financed'}
            </div>
            <div className="text-lg font-bold text-foreground">
              ${totalAmount.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1 text-muted-foreground">
              Down Payment
            </div>
            <div className="text-lg font-bold text-foreground">
              ${downPayment}
            </div>
          </div>
          {type === 'financing' && (
            <div>
              <div className="text-xs mb-1 text-muted-foreground">
                APR
              </div>
              <div className={`text-lg font-bold ${
                apr < 8 ? 'text-green-500' : apr < 12 ? 'text-primary' : 'text-amber-500'
              }`}>
                {apr}%
              </div>
            </div>
          )}
          <div>
            <div className="text-xs mb-1 text-muted-foreground">
              Term
            </div>
            <div className="text-lg font-bold text-foreground">
              {termMonths} months
            </div>
          </div>
        </div>

        {/* Monthly Payment Highlight */}
        <div className="p-4 rounded-lg mb-4 border-2 bg-primary/10 border-primary">
          <div className="text-center">
            <div className="text-xs mb-2 text-primary">
              Your Monthly Payment
            </div>
            <div className="text-3xl font-bold text-foreground">
              ${monthlyPayment}
              <span className="text-xl">/mo</span>
            </div>
            <div className="text-xs mt-1 text-muted-foreground">
              for {termMonths} months
            </div>
          </div>
        </div>

        {/* Important Clauses */}
        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <h5 className="text-sm font-semibold mb-3 text-purple-700 dark:text-purple-300">
            📋 Key Clauses
          </h5>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-xs mt-0.5">1.</span>
              <p className="text-xs text-foreground">
                <strong>Payment Obligation:</strong> Fixed ${monthlyPayment}/month for {termMonths} months
              </p>
            </div>
            {type === 'financing' && (
              <div className="flex items-start gap-2">
                <span className="text-purple-500 text-xs mt-0.5">2.</span>
                <p className="text-xs text-foreground">
                  <strong>Interest Rate:</strong> Fixed APR of {apr}% for entire term
                </p>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-xs mt-0.5">{type === 'financing' ? '3' : '2'}.</span>
              <p className="text-xs text-foreground">
                <strong>{type === 'lease' ? 'Equipment Use:' : 'Ownership:'}</strong> {type === 'lease' 
                  ? 'Equipment delivered immediately, return or purchase at end of term'
                  : 'Equipment delivered immediately, title transfers after final payment'
                }
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500 text-xs mt-0.5">{type === 'financing' ? '4' : '3'}.</span>
              <p className="text-xs text-foreground">
                <strong>{type === 'lease' ? 'Late Payment:' : 'Default:'}</strong> 15-day grace period, late fees after 30 days
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center mt-4 text-muted-foreground">
          Ask me to explain any section in detail before signing
        </p>
      </div>
      
      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                DocuSign - Electronic Signature
              </h3>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Document:</strong> Equipment Financing Agreement - {lender}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  <strong>Signer:</strong> {customerName} ({customerEmail})
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Please sign below:
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="w-full cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sign with your mouse or trackpad</p>
                  <button
                    onClick={clearSignature}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400">
                <p className="font-semibold mb-2">By signing, you agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{type === 'lease' ? 'Lease' : 'Monthly'} payment of ${monthlyPayment} for {termMonths} months</li>
                  {type === 'financing' && <li>Fixed APR of {apr}% for the entire term</li>}
                  {type === 'lease' && <li>Option to purchase or return equipment at end of term</li>}
                  <li>All terms and conditions outlined in the contract</li>
                </ul>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-xl flex gap-3">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSignContract}
                disabled={!signature}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  signature
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Complete Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractCard;
