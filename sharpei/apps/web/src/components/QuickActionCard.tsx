import { ReactNode } from "react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  badge?: string;
  compact?: boolean;
}

const QuickActionCard = ({ title, description, icon, badge, compact }: QuickActionCardProps) => {
  return (
    <button className={`group w-full ${compact ? 'p-4' : 'p-6'} bg-card border border-border rounded-2xl hover:shadow-float transition-all duration-300 hover:-translate-y-1 text-left`}>
      <div className="flex items-start gap-4">
        <div className={`${compact ? 'p-2' : 'p-3'} rounded-xl bg-gradient-to-br from-gradient-start/10 to-gradient-pink/10 group-hover:from-gradient-start/20 group-hover:to-gradient-pink/20 transition-all duration-300`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-foreground ${compact ? 'text-sm' : ''} mb-1 group-hover:gradient-sharpei-text transition-all duration-300 truncate`}>
              {title}
            </h3>
            {badge && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-gradient-start to-gradient-end text-white">
                {badge}
              </span>
            )}
          </div>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;
