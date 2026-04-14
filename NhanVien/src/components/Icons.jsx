import React from 'react';

const Icons = {
  Building: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M1 8h14" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Logout: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5.5 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2.5M10 10.5l3-3-3-3M13 7.5H6"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  // Bổ sung Icon List cho "Danh sách lịch trực"
  List: () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 4.5h11M2 7.5h11M2 10.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Queue: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Back: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7l3.5 4.5L12 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2a5 5 0 015 5v3l1.5 2H2.5L4 10V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M7 14a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  ID: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="2" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="4.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
      <path d="M7.5 5h3M7.5 7.5h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  ),
  Phone: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 1.5h2.5l1 3L4 5.5a8 8 0 003.5 3.5l1-1.5 3 1V11A1.5 1.5 0 0110 12.5 10 10 0 011.5 3 1.5 1.5 0 012 1.5z"
        stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 5.5h11M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Gender: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.5 8v4M4.5 10.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Location: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1A4 4 0 002.5 5c0 3 4 7 4 7s4-4 4-7a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="6.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  ),
  Card: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="3" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 6h11" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3.5 8.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Stethoscope: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M3 2v4a3.5 3.5 0 007 0V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M10 6.5a3 3 0 010 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="10" cy="11.5" r="1" fill="currentColor"/>
      <circle cx="2" cy="2" r="1" fill="currentColor"/>
      <circle cx="4" cy="2" r="1" fill="currentColor"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.5 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  Pin: () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1A4 4 0 002.5 5c0 3 4 7 4 7s4-4 4-7a4 4 0 00-4-4z" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="6.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
    </svg>
  ),
  ChevronDown: ({ open }) => (
    <svg
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
      width="11" height="11" viewBox="0 0 11 11" fill="none"
    >
      <path d="M2 3.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M3 2l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default Icons;