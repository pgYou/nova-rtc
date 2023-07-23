import { useRef } from 'react';

export default function useAutoRef<T>(target: T) {
  const ref = useRef<T>(target);
  ref.current = target;
  return ref;
}
