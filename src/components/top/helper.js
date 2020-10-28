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

export const ALGO_THEME_KEY = 'algo-theme';
export const ALGO_THEME_1 = 'default';
const ALGO_THEME_2 = 'green';
const ALGO_THEME_3 = 'red';

// Color Scheme
export const allColBtn = [
  {
    id: ALGO_THEME_1,
    primary: 'blue',
    secondary: 'red',
  },
  {
    id: ALGO_THEME_2,
    primary: 'green',
    secondary: 'pink',
  },
  {
    id: ALGO_THEME_3,
    primary: 'cyan',
    secondary: 'purple',
  },
];

export const SYSTEM_THEME_KEY = 'data-theme';
const SYSTEM_THEME_1 = 'light';
const SYSTEM_THEME_2 = 'dark';

export const allSystemCol = [
  {
    id: SYSTEM_THEME_1,
    primary: 'white',
    secondary: 'white',
  },
  {
    id: SYSTEM_THEME_2,
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

const EXPIRE_SEC = (86400) * 1000; // 1 day
// const EXPIRE_SEC = 5 * 1000; // 5 sec

export function setTheme(theme) {
  if (theme === SYSTEM_THEME_1) {
    setWithExpiry(SYSTEM_THEME_KEY, SYSTEM_THEME_1, EXPIRE_SEC);
    document.documentElement.setAttribute(SYSTEM_THEME_KEY, SYSTEM_THEME_1);
  } else if (theme === SYSTEM_THEME_2) {
    setWithExpiry(SYSTEM_THEME_KEY, SYSTEM_THEME_2, EXPIRE_SEC);
    document.documentElement.setAttribute(SYSTEM_THEME_KEY, SYSTEM_THEME_2);
  }
}


export function getSystemColorMode() {
  if (window.matchMedia && window.matchMedia(`(prefers-color-scheme: ${SYSTEM_THEME_2})`).matches) {
    return SYSTEM_THEME_2;
  }
  return SYSTEM_THEME_1;
}


export function setAlgoTheme(theme) {
  if (theme === ALGO_THEME_1) {
    setWithExpiry(ALGO_THEME_KEY, ALGO_THEME_1, EXPIRE_SEC);
    document.documentElement.setAttribute(ALGO_THEME_KEY, ALGO_THEME_1);
  } else if (theme === ALGO_THEME_2) {
    setWithExpiry(ALGO_THEME_KEY, ALGO_THEME_2, EXPIRE_SEC);
    document.documentElement.setAttribute(ALGO_THEME_KEY, ALGO_THEME_2);
  } else if (theme === ALGO_THEME_3) {
    setWithExpiry(ALGO_THEME_KEY, ALGO_THEME_3, EXPIRE_SEC);
    document.documentElement.setAttribute(ALGO_THEME_KEY, ALGO_THEME_3);
  }
}
