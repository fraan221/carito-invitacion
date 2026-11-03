import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'
import Message from './Message'
import EventDetails from './EventDetails'
import Gallery from './Gallery'
import Closing from './Closing'

describe('Static Sections', () => {
  describe('Hero', () => {
    it('renders the title, full name, and event date', () => {
      render(<Hero />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/mis xv/i)
      expect(screen.getByText(/milagros carolina herrera/i)).toBeInTheDocument()
      expect(screen.getByText(/2027/i)).toBeInTheDocument()
    })
  })

  describe('Message', () => {
    it('renders the personal message and invitation text', () => {
      render(<Message />)
      expect(screen.getByRole('region', { name: /mensaje/i })).toBeInTheDocument()
      expect(screen.getByText(/inolvidable/i)).toBeInTheDocument()
    })
  })

  describe('EventDetails', () => {
    it('renders date, time, venue, and a Google Maps action link', () => {
      render(
        <EventDetails
          venue="Salón Cristal"
          address="Av. Corrientes 1234, CABA"
          mapsUrl="https://maps.google.com/?q=Salon+Cristal"
        />
      )
      expect(screen.getByText(/Salón Cristal/i)).toBeInTheDocument()
      expect(screen.getByText(/Av. Corrientes 1234, CABA/i)).toBeInTheDocument()
      expect(screen.getByText(/21:00/i)).toBeInTheDocument()

      const mapLink = screen.getByRole('link', { name: /ver ubicación|cómo llegar/i })
      expect(mapLink).toHaveAttribute('href', 'https://maps.google.com/?q=Salon+Cristal')
      expect(mapLink).toHaveAttribute('target', '_blank')
    })
  })

  describe('Gallery', () => {
    it('renders photos with lazy loading and accessible alt text', () => {
      render(<Gallery />)
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
      images.forEach((img) => {
        expect(img).toHaveAttribute('loading', 'lazy')
        expect(img).toHaveAttribute('alt')
      })
    })
  })

  describe('Closing', () => {
    it('renders the farewell message and signature', () => {
      render(<Closing />)
      expect(screen.getByRole('region', { name: /despedida/i })).toBeInTheDocument()
      expect(screen.getByText(/carolina/i)).toBeInTheDocument()
    })
  })
})
