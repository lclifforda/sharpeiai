const SharpeiOrb = () => {
  return (
    <div className="relative w-40 h-40 mx-auto mb-8 animate-float">
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full gradient-sharpei opacity-20 blur-3xl animate-pulse-glow" />
      <div className="absolute inset-4 rounded-full gradient-sharpei opacity-30 blur-2xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Main orb */}
      <div className="relative w-full h-full rounded-full gradient-sharpei shadow-float-lg">
        {/* Inner shine */}
        <div className="absolute inset-8 rounded-full bg-white/20 blur-md" />
        
        {/* Reflective highlight */}
        <div className="absolute top-8 left-12 w-16 h-16 rounded-full bg-white/40 blur-xl" />
      </div>
      
      {/* Pulsing dot indicator */}
      <div className="absolute -bottom-10 right-12 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-start animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-gradient-pink animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-gradient-coral animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

export default SharpeiOrb;
