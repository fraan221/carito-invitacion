import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Countdown, {
  calculateTimeRemaining,
  DEFAULT_TARGET_DATE,
} from "./Countdown";

describe("Countdown Component & Time Calculation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("calculateTimeRemaining", () => {
    it("calculates exact days, hours, minutes, and seconds remaining", () => {
      const now = new Date("2027-02-01T12:00:00Z");
      const target = new Date("2027-02-06T21:00:00Z");

      const remaining = calculateTimeRemaining(target, now);

      // Diff: 5 days, 9 hours, 0 minutes, 0 seconds
      expect(remaining.days).toBe(5);
      expect(remaining.hours).toBe(9);
      expect(remaining.minutes).toBe(0);
      expect(remaining.seconds).toBe(0);
      expect(remaining.isExpired).toBe(false);
    });

    it("handles arbitrary hours, minutes and seconds accurately", () => {
      const now = new Date("2027-02-06T19:15:30Z");
      const target = new Date("2027-02-06T21:00:00Z");

      const remaining = calculateTimeRemaining(target, now);

      expect(remaining.days).toBe(0);
      expect(remaining.hours).toBe(1);
      expect(remaining.minutes).toBe(44);
      expect(remaining.seconds).toBe(30);
      expect(remaining.isExpired).toBe(false);
    });

    it("returns zeroes and isExpired true when target date has passed or is now", () => {
      const now = new Date("2027-02-07T00:00:00Z");
      const target = new Date("2027-02-06T21:00:00Z");

      const remaining = calculateTimeRemaining(target, now);

      expect(remaining.days).toBe(0);
      expect(remaining.hours).toBe(0);
      expect(remaining.minutes).toBe(0);
      expect(remaining.seconds).toBe(0);
      expect(remaining.isExpired).toBe(true);
    });

    it("accepts string date representations with UTC offset", () => {
      const now = new Date("2027-02-05T21:00:00Z");
      const remaining = calculateTimeRemaining("2027-02-06T21:00:00Z", now);

      expect(remaining.days).toBe(1);
      expect(remaining.hours).toBe(0);
      expect(remaining.minutes).toBe(0);
      expect(remaining.seconds).toBe(0);
      expect(remaining.isExpired).toBe(false);
    });

    it("anchors timezone-less strings to Argentina Standard Time (-03:00)", () => {
      // 2027-02-06T21:00:00 without offset should be treated as ART (-03:00 = 2027-02-07T00:00:00Z)
      const nowInUtc = new Date("2027-02-06T23:00:00Z"); // 1 hour before 21:00 ART
      const remaining = calculateTimeRemaining("2027-02-06T21:00:00", nowInUtc);

      expect(remaining.days).toBe(0);
      expect(remaining.hours).toBe(1);
      expect(remaining.minutes).toBe(0);
      expect(remaining.seconds).toBe(0);
      expect(remaining.isExpired).toBe(false);
    });

    it("normalizes date strings with spaces instead of T for Safari iOS compatibility", () => {
      const nowInUtc = new Date("2027-02-06T23:00:00Z");
      const remaining = calculateTimeRemaining("2027-02-06 21:00:00", nowInUtc);

      expect(remaining.days).toBe(0);
      expect(remaining.hours).toBe(1);
      expect(remaining.minutes).toBe(0);
      expect(remaining.seconds).toBe(0);
      expect(remaining.isExpired).toBe(false);
    });

    it("safely handles invalid date inputs without throwing", () => {
      const remaining = calculateTimeRemaining("invalid-date");
      expect(remaining.isExpired).toBe(true);
      expect(remaining.days).toBe(0);
    });
  });

  describe("Countdown UI Rendering", () => {
    it("renders active countdown with accessible heading and unit labels", () => {
      // Set fixed system time before event: 2027-01-01T00:00:00Z
      vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));

      render(<Countdown targetDate={DEFAULT_TARGET_DATE} />);

      expect(
        screen.getByRole("region", { name: /cuenta regresiva/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: /cada segundo nos acerca más/i,
        }),
      ).toBeInTheDocument();

      // Check for unit labels
      expect(screen.getByText(/^días$/i)).toBeInTheDocument();
      expect(screen.getByText(/^horas$/i)).toBeInTheDocument();
      expect(screen.getByText(/^minutos$/i)).toBeInTheDocument();
      expect(screen.getByText(/^segundos$/i)).toBeInTheDocument();

      // Check screen reader summary
      expect(
        screen.getByText(/para la fiesta de 15 de carito/i),
      ).toBeInTheDocument();
    });

    it("renders ethereal celebration state when event time has arrived or passed", () => {
      // Set system time to during the party: 2027-02-06T23:00:00-03:00
      vi.setSystemTime(new Date("2027-02-07T02:00:00Z"));

      render(<Countdown targetDate={DEFAULT_TARGET_DATE} />);

      expect(
        screen.getByRole("heading", {
          level: 2,
          name: /¡la noche soñada llegó!/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/las estrellas ya brillan sobre florencio varela/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/celebración en curso/i)).toBeInTheDocument();
    });
  });
});
