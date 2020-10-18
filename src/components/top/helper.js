import { useEffect, useState, useRef } from 'react';

export default function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}

// Returns true if it is a DOM node
function isNode(o) {
  return (
    typeof Node === 'object' ? o instanceof Node
      : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
  );
}

// Returns true if it is a DOM element
function isElement(o) {
  return (
    typeof HTMLElement === 'object' ? o instanceof HTMLElement // DOM2
      : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
  );
}

export function increaseFontSize(id, increaseFactor) {
  const txt = document.getElementById(id);
  if (isElement(txt) || isNode(txt)) {
    const style = window.getComputedStyle(txt, null).getPropertyValue('font-size');
    const currentSize = parseFloat(style);
    txt.style.fontSize = `${currentSize + increaseFactor}px`;
  }
}

export function setFontSize(id, fontSize) {
  const txt = document.getElementById(id);
  if (isElement(txt) || isNode(txt)) {
    // const style = window.getComputedStyle(txt, null).getPropertyValue('font-size');
    // const currentSize = parseFloat(style);
    txt.style.fontSize = `${fontSize}px`;
  }
}
