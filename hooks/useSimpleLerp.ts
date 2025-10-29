import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { springConfigToLerpSpeed as convertSpringToLerp } from '@/utils/webxr/animationConfig';

interface LerpConfig {
  speed: number; // Lerp speed multiplier (higher = faster)
}

/**
 * Simplified animation hook using R3F's useFrame and THREE.MathUtils.lerp
 * Replaces custom SpringScalar with built-in THREE.js interpolation
 */
export const useSimpleLerp = (initialValue: number, config: LerpConfig) => {
  const currentRef = useRef(initialValue);
  const targetRef = useRef(initialValue);

  useFrame((_, delta) => {
    const speed = config.speed * delta * 10; // Simplified speed calculation
    currentRef.current = THREE.MathUtils.lerp(
      currentRef.current,
      targetRef.current,
      speed,
    );
  });

  return {
    get value() {
      return currentRef.current;
    },
    set(target: number) {
      targetRef.current = target;
    },
  };
};

/**
 * Multi-axis lerp for position/scale animations
 */
export const useTripleLerp = (
  initialValue: [number, number, number],
  config: LerpConfig,
) => {
  const currentRef = useRef([...initialValue]);
  const targetRef = useRef([...initialValue]);

  useFrame((_, delta) => {
    const speed = config.speed * delta * 10;
    for (let i = 0; i < 3; i++) {
      currentRef.current[i] = THREE.MathUtils.lerp(
        currentRef.current[i],
        targetRef.current[i],
        speed,
      );
    }
  });

  return {
    get value(): [number, number, number] {
      return currentRef.current as [number, number, number];
    },
    set(target: [number, number, number]) {
      targetRef.current = [...target];
    },
  };
};

/**
 * Converts spring configuration to lerp speed approximation
 * Re-exported from animationConfig for backward compatibility
 * @deprecated Import from '@/utils/webxr/animationConfig' instead
 */
export const springConfigToLerpSpeed = convertSpringToLerp;
