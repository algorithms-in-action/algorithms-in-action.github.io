import React from 'react';
import HeapSort from './HeapSort';

test('HeapSort 1', () => {
  const A = [4, 10, 3];
  const n = 2;
  HeapSort(A, n);
  expect(A).toEqual([3, 4, 10]);
});

test('HeapSort 2', () => {
  const A = [9, 15, 10, 7, 12, 11];
  const n = 5;
  HeapSort(A, n);
  expect(A).toEqual([7, 9, 10, 11, 12, 15]);
});

test('HeapSort 3', () => {
  const A = [23, 22, 44, 11, 2, 34, 52, 5, 6, 4, 4, 1];
  const n = 11;
  HeapSort(A, n);
  expect(A).toEqual([1, 2, 4, 4, 5, 6, 11, 22, 23, 34, 44, 52]);
});
