import React from 'react';

export interface CollegeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
  altText?: string;
}

const sizeMap = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textClassName = '',
  subtextClassName = '',
  altText = 'Burdwan Homoeopathic Medical College logo',
}) => {
  const dimensionClass = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3 shrink-0 select-none">
      <img
        src="/college_logo.svg"
        alt={altText}
        className={`${dimensionClass} object-contain rounded-xl bg-white p-0.5 shadow-md border border-slate-200 shrink-0 ${className}`}
      />
      {showText && (
        <div className="min-w-0">
          <h1 className={`text-sm sm:text-base font-extrabold tracking-tight text-[#002147] dark:text-white leading-tight uppercase truncate ${textClassName}`}>
            Burdwan Homoeopathic Medical College & Hospital
          </h1>
          <p className={`text-[10px] font-bold text-[#00A651] tracking-wide uppercase truncate ${subtextClassName}`}>
            ESTD.- 1978 • Govt. Recognized & WBUHS Affiliated
          </p>
        </div>
      )}
    </div>
  );
};

export default CollegeLogo;
