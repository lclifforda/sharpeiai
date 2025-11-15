const SharpeiOrb = () => {
  return (
    <div className="relative w-40 h-40 mx-auto mb-12 animate-float">
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full gradient-sharpei opacity-20 blur-3xl animate-pulse-glow" />
      <div className="absolute inset-4 rounded-full gradient-sharpei opacity-30 blur-2xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Main orb */}
      <div className="relative w-full h-full rounded-full gradient-sharpei shadow-float-lg">
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
        {/* Shine effect */}
        <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/40 blur-md" />
      </div>
      
      {/* Pulsing dot indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-start animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-gradient-blue animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-gradient-purple animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

export default SharpeiOrb;
