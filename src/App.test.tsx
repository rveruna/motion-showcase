import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
  window.IntersectionObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as unknown as typeof IntersectionObserver;
});

describe('App', () => {
  it('shows all four demos', () => {
    render(<App />);
    for (const name of ['Spring drag', 'Staggered entrance', 'Path drawing', 'Scroll reveal']) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    }
  });

  it('replays the staggered list by re-mounting it', async () => {
    render(<App />);
    const before = screen.getByText('Design tokens');
    await userEvent.click(screen.getAllByRole('button', { name: 'Replay' })[0]);
    expect(screen.getByText('Design tokens')).not.toBe(before);
  });
});
