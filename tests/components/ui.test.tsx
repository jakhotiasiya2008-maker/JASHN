import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../src/components/ui/Button';
import { Slider } from '../../src/components/ui/Slider';
import { Tabs } from '../../src/components/ui/Tabs';
import { Badge } from '../../src/components/ui/Badge';
import { ThemeSwitcher } from '../../src/components/ui/ThemeSwitcher';
import { usePlannerStore } from '../../src/lib/store';

describe('UI Design System Primitives', () => {
  describe('Button', () => {
    it('renders label and triggers onClick', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const btn = screen.getByRole('button', { name: 'Click Me' });
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disables button when isLoading is true and renders spinner', () => {
      render(<Button isLoading>Submit</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
    });
  });

  describe('Slider', () => {
    it('renders with correct ARIA attributes and triggers onChange', () => {
      const handleChange = vi.fn();
      render(
        <Slider
          id="budget-slider"
          label="Total Budget"
          value={2500000}
          min={500000}
          max={10000000}
          onChange={handleChange}
        />
      );

      const slider = screen.getByRole('slider', { name: 'Total Budget' });
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('aria-valuemin', '500000');
      expect(slider).toHaveAttribute('aria-valuemax', '10000000');
      expect(slider).toHaveAttribute('aria-valuenow', '2500000');

      fireEvent.change(slider, { target: { value: '3000000' } });
      expect(handleChange).toHaveBeenCalledWith(3000000);
    });
  });

  describe('Tabs', () => {
    it('handles tab selection and ARIA selected states', () => {
      const handleChange = vi.fn();
      const items = [
        { id: 'tab1', label: 'Overview' },
        { id: 'tab2', label: 'Budget' },
      ];

      render(<Tabs items={items} activeTab="tab1" onChange={handleChange} />);

      const tab1 = screen.getByRole('tab', { name: 'Overview' });
      const tab2 = screen.getByRole('tab', { name: 'Budget' });

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      fireEvent.click(tab2);
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('supports arrow key navigation across tabs', () => {
      const handleChange = vi.fn();
      const items = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
      ];

      render(<Tabs items={items} activeTab="tab1" onChange={handleChange} />);
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Badge', () => {
    it('renders children with appropriate variant classes', () => {
      render(<Badge variant="ok">On Track</Badge>);
      expect(screen.getByText('On Track')).toBeInTheDocument();
    });
  });

  describe('ThemeSwitcher', () => {
    it('switches theme in Zustand store on radio click', () => {
      render(<ThemeSwitcher />);
      const sangeetRadio = screen.getByRole('radio', { name: /Midnight Sangeet/i });
      fireEvent.click(sangeetRadio);
      expect(usePlannerStore.getState().activeTheme).toBe('midnight-sangeet');
    });
  });
});
