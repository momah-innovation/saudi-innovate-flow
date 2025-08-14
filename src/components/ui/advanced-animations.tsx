import React, { useEffect, useRef, useState } from 'react';
import { useSettingsManager } from '@/hooks/useSettingsManager';
import { cn } from '@/lib/utils';
import { useTimerManager } from '@/utils/timerManager';

// Advanced animation hook
export function useSpringAnimation(trigger: boolean, config = {}) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  
  React.useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const { setTimeout: scheduleTimeout } = useTimerManager();
      const clearTimer = scheduleTimeout(() => setIsAnimating(false), 800);
      return clearTimer;
    }
  }, [trigger]);
  
  return isAnimating;
}

// Spring animation component
interface SpringAnimationProps {
  children: React.ReactNode;
  trigger?: boolean;
  delay?: number;
  className?: string;
}

export function SpringAnimation({ children, trigger = true, delay = 0, className }: SpringAnimationProps) {
  return (
    <div 
      className={cn(
        "transition-all duration-700 ease-spring",
        trigger ? "animate-spring-in" : "opacity-0 translate-y-4 scale-95",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Stagger animation container
interface StaggerContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function StaggerContainer({ children, delay = 100, className }: StaggerContainerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child, index) => (
        <SpringAnimation delay={index * delay}>
          {child}
        </SpringAnimation>
      ))}
    </div>
  );
}

// Parallax scroll component
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const [offsetY, setOffsetY] = React.useState(0);
  
  React.useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div 
      className={cn("will-change-transform", className)}
      style={{ transform: `translateY(${offsetY * speed}px)` }}
    >
      {children}
    </div>
  );
}

// Floating animation component
interface FloatingProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export function Floating({ children, duration = 3000, className }: FloatingProps) {
  return (
    <div 
      className={cn("animate-float", className)}
      style={{ animationDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

// Magnetic interaction component
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({ children, strength = 20, className }: MagneticProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLDivElement>(null);
  
  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    setPosition({
      x: deltaX * strength,
      y: deltaY * strength
    });
  }, [strength]);
  
  const handleMouseLeave = React.useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);
  
  return (
    <div 
      ref={ref}
      className={cn("transition-transform duration-300 ease-out", className)}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// Morphing shapes component
interface MorphingShapeProps {
  shape: 'circle' | 'square' | 'triangle';
  size?: number;
  color?: string;
  className?: string;
}

export function MorphingShape({ shape, size = 40, color = 'hsl(var(--primary))', className }: MorphingShapeProps) {
  const [currentShape, setCurrentShape] = React.useState(shape);
  
  React.useEffect(() => {
    const { getSettingValue } = useSettingsManager();
    const shapesData = getSettingValue('animation_shapes', ['circle', 'square', 'triangle']) as string[];
    const { setInterval: scheduleInterval } = useTimerManager();
    const clearTimer = scheduleInterval(() => {
      const randomShape = shapesData[Math.floor(Math.random() * shapesData.length)] as 'circle' | 'square' | 'triangle';
      setCurrentShape(randomShape);
    }, 2000);
    
    return clearTimer;
  }, []);
  
  const getShapeClass = () => {
    switch (currentShape) {
      case 'circle': return 'rounded-full';
      case 'square': return 'rounded-none';
      case 'triangle': return 'rounded-sm transform rotate-45';
      default: return 'rounded-full';
    }
  };
  
  return (
    <div 
      className={cn(
        "transition-all duration-1000 ease-spring",
        getShapeClass(),
        className
      )}
      style={{ 
        width: size,
        height: size,
        backgroundColor: color
      }}
    />
  );
}

// Text reveal animation
interface TextRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

export function TextReveal({ text, delay = 50, className }: TextRevealProps) {
  const [visibleChars, setVisibleChars] = React.useState(0);
  
  React.useEffect(() => {
    const { setInterval: scheduleInterval } = useTimerManager();
    let clearTimer: (() => void) | undefined;
    clearTimer = scheduleInterval(() => {
      setVisibleChars(prev => {
        if (prev >= text.length) {
          clearTimer?.();
          return prev;
        }
        return prev + 1;
      });
    }, delay);
    
    return clearTimer;
  }, [text, delay]);
  
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={cn(
            "transition-all duration-300",
            index < visibleChars ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
          style={{ transitionDelay: `${index * delay}ms` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// Ripple effect component
interface RippleProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
  className?: string;
}

export function Ripple({ children, color = 'hsl(var(--primary) / 0.3)', duration = 600, className }: RippleProps) {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  
  const addRipple = React.useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newRipple = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    const { setTimeout: scheduleTimeout } = useTimerManager();
    scheduleTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, duration);
  }, [duration]);
  
  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      onMouseDown={addRipple}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
            width: '2px',
            height: '2px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: `${duration}ms`
          }}
        />
      ))}
    </div>
  );
}