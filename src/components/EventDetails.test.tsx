import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import EventDetails from './EventDetails';

describe('EventDetails (Hardened Resilience & Edge Cases)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Default Rendering & Fallbacks', () => {
    it('renders with default venue, address, date, and time when no props provided', () => {
      render(<EventDetails />);

      expect(screen.getByRole('region', { name: /detalles del evento y ubicación/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /cuándo y dónde/i })).toBeInTheDocument();
      expect(screen.getByText(/Salón Royal Night/i)).toBeInTheDocument();
      expect(screen.getByText(/Florencio Varela/i)).toBeInTheDocument();
      expect(screen.getByText(/Sábado 6 de Febrero de 2027/i)).toBeInTheDocument();
      expect(screen.getByText(/21:00 a 05:00 hs/i)).toBeInTheDocument();
      expect(screen.getByText(/confirmar asistencia hasta el/i)).toBeInTheDocument();
      expect(screen.getByText(/20 de Diciembre de 2026/i)).toBeInTheDocument();
      expect(screen.getByText(/20\/12\/2026/i)).toBeInTheDocument();
    });

    it('renders custom rsvp deadline and short mobile deadline when passed as props', () => {
      render(
        <EventDetails
          rsvpDeadline="20 de Enero de 2027"
          rsvpDeadlineShort="20/01/2027"
        />
      );
      expect(screen.getByText(/20 de Enero de 2027/i)).toBeInTheDocument();
      expect(screen.getByText(/20\/01\/2027/i)).toBeInTheDocument();
    });

    it('defensively normalizes empty or whitespace-only string props to defaults', () => {
      render(
        <EventDetails
          venue="   "
          address=""
          date="  "
          time=""
          mapsUrl="  "
          googleCalendarUrl=""
        />
      );

      // Should safely fallback to defaults rather than rendering blank text
      expect(screen.getByText(/Salón Royal Night/i)).toBeInTheDocument();
      expect(screen.getByText(/Cno\. Gral\. Belgrano 5599/i)).toBeInTheDocument();
      expect(screen.getByText(/Sábado 6 de Febrero de 2027/i)).toBeInTheDocument();
      expect(screen.getByText(/21:00 a 05:00 hs/i)).toBeInTheDocument();

      // Maps link falls back to a query search with venue & address
      const mapsLink = screen.getByRole('link', { name: /cómo llegar/i });
      expect(mapsLink).toHaveAttribute('href');
      expect(mapsLink.getAttribute('href')).toContain('maps/search/?api=1');
    });
  });

  describe('Extreme & Internationalized Inputs', () => {
    it('handles extreme long text and unicode/emoji without breaking layout or crashing', () => {
      const extremeVenue =
        'Palacio de las Estrellas y Centro de Convenciones Internacional Bellas Artes Multiespacio Gran Salón Imperial 👑 🌟';
      const extremeAddress =
        'Avenida de los Gobernadores y Héroes de la Patria 123456789, Esquina Boulevard Costanera Norte y Río de la Plata, Sector B, Piso 3, Ala Este, Buenos Aires, Argentina';
      const internationalDate = 'Samstag, 6. Februar 2027 / שבת / السبت';
      const internationalTime = '21:00 – 05:00 (UTC-3 / ART)';

      render(
        <EventDetails
          venue={extremeVenue}
          address={extremeAddress}
          date={internationalDate}
          time={internationalTime}
        />
      );

      expect(screen.getByText(extremeVenue)).toBeInTheDocument();
      expect(screen.getByText(extremeAddress)).toBeInTheDocument();
      expect(screen.getByText(internationalDate)).toBeInTheDocument();
      expect(screen.getByText(internationalTime)).toBeInTheDocument();
    });
  });

  describe('Security & URL Sanitization', () => {
    it('sanitizes malicious javascript: or data: protocols in mapsUrl and googleCalendarUrl', () => {
      render(
        <EventDetails
          mapsUrl="javascript:alert('xss')"
          googleCalendarUrl="javascript:void(0)"
        />
      );

      const mapsLink = screen.getByRole('link', { name: /cómo llegar/i });
      expect(mapsLink.getAttribute('href')).not.toContain('javascript:');
      expect(mapsLink.getAttribute('href')).toContain('maps.google.com');

      const gcalLink = screen.getByRole('link', { name: /google calendar/i });
      expect(gcalLink.getAttribute('href')).not.toContain('javascript:');
      expect(gcalLink.getAttribute('href')).toContain('calendar.google.com');
    });

    it('ensures external links have rel="noopener noreferrer" and target="_blank"', () => {
      render(<EventDetails />);

      const mapsLink = screen.getByRole('link', { name: /cómo llegar/i });
      expect(mapsLink).toHaveAttribute('target', '_blank');
      expect(mapsLink).toHaveAttribute('rel', 'noopener noreferrer');

      const gcalLink = screen.getByRole('link', { name: /google calendar/i });
      expect(gcalLink).toHaveAttribute('target', '_blank');
      expect(gcalLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Clipboard Copy Address & Feedback Resilience', () => {
    it('copies address using navigator.clipboard and provides visual and screen reader feedback', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(<EventDetails address="Calle Falsa 123, Varela" />);

      const copyBtn = screen.getByRole('button', { name: /copiar dirección/i });
      expect(copyBtn).toHaveTextContent('Copiar dirección');

      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(writeTextMock).toHaveBeenCalledWith('Calle Falsa 123, Varela');
      expect(screen.getByText('¡Dirección copiada!')).toBeInTheDocument();

      // Screen reader announcement
      const alertRegion = screen.getByRole('status');
      expect(alertRegion).toHaveTextContent(/dirección copiada al portapapeles/i);

      // Reverts feedback after 2500ms
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      expect(screen.getByText('Copiar dirección')).toBeInTheDocument();
      expect(alertRegion).toHaveTextContent('');
    });

    it('falls back to document.execCommand when navigator.clipboard is unavailable', async () => {
      // Remove clipboard
      const originalClipboard = navigator.clipboard;
      // @ts-expect-error test override
      delete navigator.clipboard;

      const execCommandMock = vi.fn().mockReturnValue(true);
      document.execCommand = execCommandMock;

      render(<EventDetails address="Av. Libertador 456" />);

      const copyBtn = screen.getByRole('button', { name: /copiar dirección/i });
      await act(async () => {
        fireEvent.click(copyBtn);
      });

      expect(execCommandMock).toHaveBeenCalledWith('copy');
      expect(screen.getByText('¡Dirección copiada!')).toBeInTheDocument();

      // Restore
      if (originalClipboard) {
        Object.assign(navigator, { clipboard: originalClipboard });
      }
    });

    it('clears active timeouts on unmount without throwing errors', () => {
      const { unmount } = render(<EventDetails />);
      const copyBtn = screen.getByRole('button', { name: /copiar dirección/i });

      act(() => {
        fireEvent.click(copyBtn);
      });

      // Unmount while copy feedback timer is ticking
      expect(() => unmount()).not.toThrow();

      // Advancing timer after unmount shouldn't trigger state update errors
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(3000);
        });
      }).not.toThrow();
    });
  });

  describe('Universal iCalendar (.ics) Generation', () => {
    it('generates a valid RFC 5545 iCalendar data URI with correct timezone and event details', () => {
      render(
        <EventDetails
          venue="Salón Royal Night"
          address="Cno. Gral. Belgrano 5599"
          date="Sábado 6 de Febrero de 2027"
          time="21:00 a 05:00 hs"
        />
      );

      const icalLink = screen.getByRole('link', { name: /apple \/ ical \(\.ics\)/i });
      expect(icalLink).toHaveAttribute('download', 'fiesta-carito-xv.ics');

      const href = icalLink.getAttribute('href') || '';
      expect(href.startsWith('data:text/calendar;charset=utf-8,')).toBe(true);

      const decodedIcs = decodeURIComponent(href.replace('data:text/calendar;charset=utf-8,', ''));
      expect(decodedIcs).toContain('BEGIN:VCALENDAR');
      expect(decodedIcs).toContain('VERSION:2.0');
      expect(decodedIcs).toContain('DTSTART:20270207T000000Z');
      expect(decodedIcs).toContain('DTEND:20270207T080000Z');
      expect(decodedIcs).toContain('LOCATION:Salón Royal Night, Cno. Gral. Belgrano 5599');
      expect(decodedIcs).toContain('END:VCALENDAR');
    });
  });
});
