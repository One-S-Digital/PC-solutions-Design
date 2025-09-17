import React from 'react';

export const SwissFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M32 5.333H0V26.667H32V5.333Z" fill="#D80027"/>
    <path d="M19.556 9.778H12.444V14.222H8V17.778H12.444V22.222H19.556V17.778H24V14.222H19.556V9.778Z" fill="#F0F0F0"/>
  </svg>
);

export const UKFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="16" {...props}>
    <clipPath id="t"><path d="M0 0v30h60V0z" /></clipPath>
    <path d="M0 0v30h60V0z" fill="#012169" />
    <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" clipPath="url(#t)" />
    <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="4" clipPath="url(#t)" />
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" clipPath="url(#t)" />
    <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" clipPath="url(#t)" />
  </svg>
);

export const FrenchFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="24" height="16" {...props}>
    <rect width="300" height="600" fill="#002654" />
    <rect x="300" width="300" height="600" fill="#fff" />
    <rect x="600" width="300" height="600" fill="#ED2939" />
  </svg>
);

export const GermanFlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" width="24" height="16" {...props}>
    <rect width="5" height="3" fill="#000" />
    <rect width="5" height="2" y="1" fill="#D00" />
    <rect width="5" height="1" y="2" fill="#FFCE00" />
  </svg>
);
