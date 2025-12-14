import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: ReactNode;
  stats?: ReactNode;
}

export function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  actions,
  stats 
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Container com altura e padding consistentes */}
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Icon + Title + Description */}
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right Side: Actions */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>

        {/* Stats Row (opcional) - fora do container de 80px */}
        {stats && (
          <div className="pb-4">
            {stats}
          </div>
        )}
      </div>
    </header>
  );
}

