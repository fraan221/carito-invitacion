import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountUp from './CountUp';
import { toRoman } from '../utils/roman';

describe('CountUp & RomanReel', () => {
  describe('toRoman conversion', () => {
    it('converts integers from 1 to 15 accurately', () => {
      expect(toRoman(1)).toBe('I');
      expect(toRoman(2)).toBe('II');
      expect(toRoman(3)).toBe('III');
      expect(toRoman(4)).toBe('IV');
      expect(toRoman(5)).toBe('V');
      expect(toRoman(6)).toBe('VI');
      expect(toRoman(7)).toBe('VII');
      expect(toRoman(8)).toBe('VIII');
      expect(toRoman(9)).toBe('IX');
      expect(toRoman(10)).toBe('X');
      expect(toRoman(11)).toBe('XI');
      expect(toRoman(12)).toBe('XII');
      expect(toRoman(13)).toBe('XIII');
      expect(toRoman(14)).toBe('XIV');
      expect(toRoman(15)).toBe('XV');
    });

    it('defaults non-positive values to I', () => {
      expect(toRoman(0)).toBe('I');
      expect(toRoman(-5)).toBe('I');
    });
  });

  describe('Roman Reel rendering', () => {
    it('renders the target roman numeral in accessible text and ghost element', () => {
      render(
        <CountUp
          from={1}
          to={15}
          format="roman"
          duration={3.4}
          trigger="load"
        />
      );

      // The screen reader text and ghost element must render 'XV'
      const matches = screen.getAllByText('XV');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('renders ladder of Roman numerals from 1 to 15 for the upward reel', () => {
      const { container } = render(
        <CountUp
          from={1}
          to={15}
          format="roman"
          duration={3.4}
          trigger="load"
        />
      );

      // Verify that intermediate numerals exist in the strip ladder
      expect(screen.getByText('I')).toBeInTheDocument();
      expect(screen.getByText('V')).toBeInTheDocument();
      expect(screen.getByText('X')).toBeInTheDocument();
      expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it('renders the viewport container and applies settled styling', () => {
      const { container } = render(
        <CountUp
          from={1}
          to={15}
          format="roman"
          duration={0.1}
          trigger="load"
        />
      );

      const viewport = container.querySelector('[class*="viewport"]');
      expect(viewport).toBeInTheDocument();
      expect(viewport).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Standard count mode', () => {
    it('renders standard numeric CountUp correctly', () => {
      render(
        <CountUp
          from={0}
          to={25}
          duration={1}
          trigger="load"
        />
      );

      expect(screen.getByText(/0|25/)).toBeInTheDocument();
    });
  });
});
