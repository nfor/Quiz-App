import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ANIMATION_DURATIONS, ANIMATION_EASES, SCALE, OPACITY, OFFSETS, STAGGER } from '../constants/animations';

/**
 * Hook for entrance animations with fade and slide
 * @param {React.RefObject} ref - DOM element ref
 * @param {Object} options - Custom animation options
 */
export function useEntranceAnimation(ref, options = {}) {
  useEffect(() => {
    if (!ref.current) return;
    
    const defaults = {
      duration: ANIMATION_DURATIONS.NORMAL,
      ease: ANIMATION_EASES.POWER_OUT,
      fromY: OFFSETS.NORMAL,
      ...options
    };

    gsap.fromTo(ref.current,
      { y: defaults.fromY, opacity: OPACITY.HIDDEN },
      {
        y: 0,
        opacity: OPACITY.VISIBLE,
        duration: defaults.duration,
        ease: defaults.ease,
        clearProps: 'all'
      }
    );
  }, [ref, options]);
}

/**
 * Hook for staggered list animations
 * @param {React.RefObject} ref - Container ref with children
 * @param {Object} options - Custom animation options
 */
export function useStaggerAnimation(ref, options = {}) {
  useEffect(() => {
    if (!ref.current) return;

    const defaults = {
      duration: ANIMATION_DURATIONS.FAST,
      ease: ANIMATION_EASES.POWER_OUT,
      staggerAmount: STAGGER.NORMAL,
      fromY: OFFSETS.SMALL,
      ...options
    };

    gsap.fromTo(ref.current.children,
      { y: defaults.fromY, opacity: OPACITY.HIDDEN },
      {
        y: 0,
        opacity: OPACITY.VISIBLE,
        duration: defaults.duration,
        ease: defaults.ease,
        stagger: defaults.staggerAmount,
        clearProps: 'all'
      }
    );
  }, [ref, options]);
}

/**
 * Hook for hover scale animations
 * @param {React.RefObject} ref - DOM element ref
 * @param {number} scaleValue - Scale factor on hover (default: 1.05)
 */
export function useHoverScale(ref, scaleValue = SCALE.HOVER) {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: scaleValue,
        duration: ANIMATION_DURATIONS.FAST,
        ease: ANIMATION_EASES.POWER2_OUT
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: SCALE.NORMAL,
        duration: ANIMATION_DURATIONS.FAST,
        ease: ANIMATION_EASES.POWER2_OUT
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, scaleValue]);
}

/**
 * Hook for progress bar animations
 * @param {React.RefObject} ref - DOM element ref (progress bar)
 * @param {number} progress - Progress value (0-100)
 * @param {Object} options - Custom animation options
 */
export function useProgressAnimation(ref, progress = 0, options = {}) {
  useEffect(() => {
    if (!ref.current) return;

    const defaults = {
      duration: ANIMATION_DURATIONS.NORMAL,
      ease: ANIMATION_EASES.POWER_OUT,
      ...options
    };

    gsap.to(ref.current, {
      width: `${progress}%`,
      duration: defaults.duration,
      ease: defaults.ease
    });
  }, [ref, progress, options]);
}

/**
 * Hook for click feedback animations (pulse effect)
 * @param {React.RefObject} ref - DOM element ref
 * @param {Object} options - Custom animation options
 */
export function useClickFeedback(ref, options = {}) {
  useEffect(() => {
    if (!ref.current) return;

    const defaults = {
      duration: ANIMATION_DURATIONS.FAST,
      scale: 0.95,
      ...options
    };

    const element = ref.current;

    const handleClick = () => {
      gsap.timeline()
        .to(element, {
          scale: defaults.scale,
          duration: defaults.duration / 2
        })
        .to(element, {
          scale: SCALE.NORMAL,
          duration: defaults.duration / 2
        });
    };

    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, [ref, options]);
}
