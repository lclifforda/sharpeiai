import { ReactNode } from "react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const QuickActionCard = ({ title, description, icon }: QuickActionCardProps) => {
  return (
    <button className="group w-full p-6 bg-card border border-border rounded-2xl hover:shadow-float transition-all duration-300 hover:-translate-y-1 text-left">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-gradient-start/10 to-gradient-pink/10 group-hover:from-gradient-start/20 group-hover:to-gradient-pink/20 transition-all duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 group-hover:gradient-sharpei-text transition-all duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;
