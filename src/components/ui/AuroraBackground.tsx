import React from 'react';

export const AuroraBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg-primary text-text-primary transition-colors duration-500">
      {/* Decorative ambient aurora blur layers */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-[130px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[450px] w-[600px] rounded-full opacity-15 blur-[120px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};
