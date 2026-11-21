import React from "react";
import { PaymentGatewayType } from "@/types/analytics";

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Wave Mobile Money Logo (Cyan / Bleu ciel distinctif)
 */
export function WaveLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <rect width="48" height="48" rx="12" fill="#1AC8FF" />
      {/* Stylized Penguin / Wave symbol */}
      <circle cx="24" cy="18" r="9" fill="#0E1E38" />
      <path
        d="M17 24C17 20 20 18 24 18C28 18 31 20 31 24V34C31 37.3 28.3 40 25 40H23C19.7 40 17 37.3 17 34V24Z"
        fill="#0E1E38"
      />
      <circle cx="21.5" cy="17" r="1.5" fill="#FFFFFF" />
      <circle cx="26.5" cy="17" r="1.5" fill="#FFFFFF" />
      <polygon points="24,19 21.5,22 26.5,22" fill="#FFC83B" />
      <ellipse cx="24" cy="30" rx="4.5" ry="6" fill="#FFFFFF" />
      <path
        d="M14 28C13 30 15 33 17 32"
        stroke="#1AC8FF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M34 28C35 30 33 33 31 32"
        stroke="#1AC8FF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Orange Money Logo (Orange vif emblématique)
 */
export function OrangeMoneyLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <rect width="48" height="48" rx="12" fill="#FF7900" />
      {/* Orange Money square/circle design */}
      <rect x="9" y="9" width="30" height="30" rx="8" fill="#000000" />
      <circle cx="24" cy="24" r="10" stroke="#FF7900" strokeWidth="3" />
      <path
        d="M21 21C21 19.34 22.34 18 24 18C25.66 18 27 19.34 27 21C27 22.66 25.66 24 24 24M21 27H27M24 24V30"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * MTN Mobile Money (MoMo) Logo (Jaune & Bleu)
 */
export function MtnLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <rect width="48" height="48" rx="12" fill="#FFCC00" />
      {/* Oval emblem with MoMo / MTN style */}
      <ellipse cx="24" cy="24" rx="19" ry="14" fill="#003366" />
      <text
        x="24"
        y="26.5"
        textAnchor="middle"
        fill="#FFCC00"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="10"
        letterSpacing="0.5"
      >
        MoMo
      </text>
      <circle cx="11" cy="24" r="1.5" fill="#FFCC00" />
      <circle cx="37" cy="24" r="1.5" fill="#FFCC00" />
    </svg>
  );
}

/**
 * Stripe Logo (Indigo vibrant)
 */
export function StripeLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <rect width="48" height="48" rx="12" fill="#635BFF" />
      {/* Stripe stylized S */}
      <path
        d="M27.2 20.3C27.2 18.8 25.8 18 23.8 18C21.4 18 19.5 19 18.7 19.5L18 16.3C19.3 15.6 21.6 15 24.3 15C29.2 15 32.2 17.3 32.2 21.3C32.2 26.5 25.3 26 25.3 28.5C25.3 29.3 26 29.8 27.2 29.8C29.1 29.8 31 29.1 32 28.5L32.7 31.6C31.5 32.3 29.2 33 26.7 33C21.9 33 20.1 30.5 20.1 27.2C20.1 21.9 27.2 22.6 27.2 20.3Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Visa / Mastercard Vector Badges
 */
export function CardBrandsLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <rect width="48" height="48" rx="12" fill="#1E293B" />
      {/* Mastercard overlapping circles */}
      <circle cx="20" cy="24" r="9" fill="#EB001B" fillOpacity="0.85" />
      <circle cx="28" cy="24" r="9" fill="#F79E1B" fillOpacity="0.85" />
      <path
        d="M24 18.2C25.6 19.7 26.6 21.7 26.6 24C26.6 26.3 25.6 28.3 24 29.8C22.4 28.3 21.4 26.3 21.4 24C21.4 21.7 22.4 19.7 24 18.2Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

/**
 * Composant Routeur pour afficher le logo selon la passerelle
 */
export function PaymentGatewayLogo({
  gateway,
  className = "w-6 h-6",
  size,
}: {
  gateway: PaymentGatewayType | "orange" | "card" | string;
  className?: string;
  size?: number;
}) {
  switch (gateway) {
    case "wave":
      return <WaveLogo className={className} size={size} />;
    case "orange_money":
    case "orange":
      return <OrangeMoneyLogo className={className} size={size} />;
    case "mtn":
      return <MtnLogo className={className} size={size} />;
    case "stripe":
    case "card":
      return <StripeLogo className={className} size={size} />;
    default:
      return <CardBrandsLogo className={className} size={size} />;
  }
}
