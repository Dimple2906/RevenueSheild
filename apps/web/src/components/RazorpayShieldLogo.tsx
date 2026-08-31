import React from 'react';

interface RazorpayShieldLogoProps {
  className?: string;
  size?: number;
}

export const RazorpayShieldLogo: React.FC<RazorpayShieldLogoProps> = ({ 
  className = "w-6 h-6",
  size = 24 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Razorpay Brand Blue Shield Gradient */}
        <linearGradient id="rzpShieldBlueGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0066FF" />
          <stop offset="1" stopColor="#003D99" />
        </linearGradient>
        {/* Razorpay Lightning Accent Gradient */}
        <linearGradient id="rzpLightningGrad" x1="8" y1="5" x2="16" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#0066FF" />
        </linearGradient>
        {/* Gold Security Rim Accent */}
        <linearGradient id="goldRimGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#FCD34D" />
        </linearGradient>
      </defs>

      {/* Outer Protective Security Shield Contour */}
      <path 
        d="M12 2L3.5 5.5V11.5C3.5 16.8 7.1 21.6 12 23C16.9 21.6 20.5 16.8 20.5 11.5V5.5L12 2Z" 
        fill="url(#rzpShieldBlueGrad)" 
        stroke="url(#goldRimGrad)" 
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Inner Vault Core */}
      <path 
        d="M12 3.8L5 6.7V11.5C5 15.8 8 19.8 12 21C16 19.8 19 15.8 19 11.5V6.7L12 3.8Z" 
        fill="#050814" 
        fillOpacity="0.82"
      />

      {/* Iconic Razorpay Slanted Lightning Blade Emblem */}
      <path 
        d="M14.5 6L8 13.5H11.5L9.5 18L16.5 10.5H12.8L14.5 6Z" 
        fill="url(#rzpLightningGrad)" 
      />
    </svg>
  );
};
