"use client"

import { useState, useEffect } from "react"

// Convert SASS breakpoints map to JavaScript object
const breakpoints = {
  mobileSmall: 321,
  mobileMedium: 480,
  mobileLarge: 640,
  tabletSmall: 768,
  tabletMedium: 820,
  tabletLarge: 980,
  desktopSmall: 1024,
  desktopMedium: 1200,
  desktopLarge: 1400,
  desktopXlarge: 1600,
  desktopXxlarge: 1800,
}

type BreakpointState = {
  isMobileSmall: boolean
  isMobileMedium: boolean
  isMobileLarge: boolean
  isTabletSmall: boolean
  isTabletMedium: boolean
  isTabletLarge: boolean
  isDesktopSmall: boolean
  isDesktopMedium: boolean
  isDesktopLarge: boolean
  isDesktopXlarge: boolean
  isDesktopXxlarge: boolean
  isMobile: boolean // Convenience property for mobile devices (up to tablet-small)
  isTablet: boolean // Convenience property for tablet devices
  isDesktop: boolean // Convenience property for desktop devices
  activeBreakpoint: string // Current active breakpoint name
}

export function useBreakPoint(): BreakpointState {
  // Initialize with default values (assuming desktop as default)
  const [breakpointState, setBreakpointState] = useState<BreakpointState>({
    isMobileSmall: false,
    isMobileMedium: false,
    isMobileLarge: false,
    isTabletSmall: false,
    isTabletMedium: false,
    isTabletLarge: false,
    isDesktopSmall: false,
    isDesktopMedium: false,
    isDesktopLarge: false,
    isDesktopXlarge: false,
    isDesktopXxlarge: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    activeBreakpoint: "desktopXxlarge",
  })

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") return

    // Function to determine the current breakpoint state
    const updateBreakpointState = () => {
      const width = window.innerWidth

      // Determine which breakpoint is active
      let activeBreakpoint = "desktopXxlarge"

      if (width < breakpoints.mobileSmall) {
        activeBreakpoint = "mobileSmall"
      } else if (width < breakpoints.mobileMedium) {
        activeBreakpoint = "mobileMedium"
      } else if (width < breakpoints.mobileLarge) {
        activeBreakpoint = "mobileLarge"
      } else if (width < breakpoints.tabletSmall) {
        activeBreakpoint = "tabletSmall"
      } else if (width < breakpoints.tabletMedium) {
        activeBreakpoint = "tabletMedium"
      } else if (width < breakpoints.tabletLarge) {
        activeBreakpoint = "tabletLarge"
      } else if (width < breakpoints.desktopSmall) {
        activeBreakpoint = "desktopSmall"
      } else if (width < breakpoints.desktopMedium) {
        activeBreakpoint = "desktopMedium"
      } else if (width < breakpoints.desktopLarge) {
        activeBreakpoint = "desktopLarge"
      } else if (width < breakpoints.desktopXlarge) {
        activeBreakpoint = "desktopXlarge"
      }

      // Set individual breakpoint flags
      const newState: BreakpointState = {
        isMobileSmall: width < breakpoints.mobileSmall,
        isMobileMedium: width < breakpoints.mobileMedium,
        isMobileLarge: width < breakpoints.mobileLarge,
        isTabletSmall: width < breakpoints.tabletSmall,
        isTabletMedium: width < breakpoints.tabletMedium,
        isTabletLarge: width < breakpoints.tabletLarge,
        isDesktopSmall: width < breakpoints.desktopSmall,
        isDesktopMedium: width < breakpoints.desktopMedium,
        isDesktopLarge: width < breakpoints.desktopLarge,
        isDesktopXlarge: width < breakpoints.desktopXlarge,
        isDesktopXxlarge: width >= breakpoints.desktopXlarge,

        // Convenience groupings
        isMobile: width < breakpoints.tabletSmall,
        isTablet: width >= breakpoints.tabletSmall && width < breakpoints.desktopSmall,
        isDesktop: width >= breakpoints.desktopSmall,

        // Current active breakpoint
        activeBreakpoint,
      }

      setBreakpointState(newState)
    }

    // Initial check
    updateBreakpointState()

    // Handler for window resize
    const handleResize = () => {
      updateBreakpointState()
    }

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return breakpointState
}
