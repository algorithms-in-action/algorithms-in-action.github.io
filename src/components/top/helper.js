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

export function getCSSVariable(cssVar) {
  let res = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
  res = res.replace(/\s/g, '');
  return res;
}

export function isDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }

  return false;
}


// Color Scheme
export const allColBtn = [
  {
    id: 0,
    primary: 'black',
    secondary: 'white',
  },
  {
    id: 1,
    primary: 'green',
    secondary: 'pink',
  },
  {
    id: 2,
    primary: 'cyan',
    secondary: 'red',
  },
];

export const allSystemCol = [
  {
    id: 'light',
    primary: 'white',
    secondary: 'white',
  },
  {
    id: 'dark',
    primary: 'black',
    secondary: 'black',
  },
];


function setWithExpiry(key, value, ttl) {
  const now = new Date();
  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);

  const now = new Date();
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

const EXPIRE_SEC = (86400) * 1000;

export function setTheme(theme) {
  if (theme === 'dark') {
    setWithExpiry('theme', 'dark', EXPIRE_SEC);
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (theme === 'light') {
    setWithExpiry('theme', 'light', EXPIRE_SEC);
    document.documentElement.setAttribute('data-theme', 'light');
  }
}


export function getSystemColorMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}


export function setAlgoTheme(theme) {
  console.log(`sdsd${theme}`);
  console.log(`HERE${document.documentElement.getAttribute('algo-theme')}`);
  if (theme === 0) {
    setWithExpiry('algo-theme', 0, EXPIRE_SEC);
    document.documentElement.setAttribute('algo-theme', '0');
  } else if (theme === 1) {
    setWithExpiry('algo-theme', 1, EXPIRE_SEC);
    document.documentElement.setAttribute('algo-theme', '1');
  } else if (theme === 2) {
    setWithExpiry('algo-theme', 2, EXPIRE_SEC);
    document.documentElement.setAttribute('algo-theme', '2');
  }
}
