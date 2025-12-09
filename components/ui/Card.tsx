'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-4 py-3 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, icon, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-sm font-semibold text-gray-800 flex items-center gap-2 ${className}`}>
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}
