import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';
import { usePlannerStore } from '../../src/lib/store';

describe('Feature Integration - Wizard & Dashboard Workflow', () => {
  beforeEach(() => {
    usePlannerStore.getState().resetPlanner();
  });

  it('renders landing page when no wedding plan exists', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Indian Wedding Planning/i);
    expect(screen.getByRole('button', { name: /Start Free Planning/i })).toBeInTheDocument();
  });

  it('launches intake wizard upon clicking start button', () => {
    render(<App />);
    const startBtn = screen.getByRole('button', { name: /Start Free Planning/i });
    fireEvent.click(startBtn);

    expect(screen.getByText(/Step 1 of 5/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wedding \/ Pheras Date/i)).toBeInTheDocument();
  });

  it('completes intake wizard and transitions cleanly to Dashboard', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start Free Planning/i }));

    // Step 1: Date & Location -> Continue
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 2: Guests & Budget -> Continue
    expect(screen.getByText(/Step 2 of 5/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3: Ceremonies -> Continue
    expect(screen.getByText(/Step 3 of 5/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 4: Aesthetic & Vibe -> Continue
    expect(screen.getByText(/Step 4 of 5/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 5: Priorities & Submit -> Generate My Jashn Plan
    expect(screen.getByText(/Step 5 of 5/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Generate My Jashn Plan/i }));

    // Dashboard must now be rendered!
    expect(screen.getByRole('tab', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Budget Engine/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Timeline & Milestones/i })).toBeInTheDocument();
  });
});
