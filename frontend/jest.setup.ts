import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-font-class',
    variable: '--font-inter',
    style: { fontFamily: 'Inter' },
  }),
})); 