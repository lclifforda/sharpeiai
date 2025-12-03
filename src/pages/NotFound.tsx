import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import sharpeiLogo from "@/assets/sharpei-logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs text-muted-foreground/70">
              Powered by
            </p>
            <img src={sharpeiLogo} alt="Sharpei AI" className="h-4 w-4 object-contain" />
            <p className="text-xs text-muted-foreground/70 font-medium">
              Sharpei AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
