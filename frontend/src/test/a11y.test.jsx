import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import Navbar from '../components/Navbar';

expect.extend(toHaveNoViolations);

const axe = configureAxe({
  rules: {
    region: { enabled: false },
  },
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (component) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Accessibility', () => {
  it('Navbar should have no accessibility violations', async () => {
    const { container } = renderWithProviders(<Navbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
