import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: 'CORE',
  fullName: 'Core — Software & Business Solutions',
  description:
    'Consulting and intelligent systems designed to improve safety, performance, and operational reliability across complex environments.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://core.example.com',
  email: 'charles@coreplusops.com',
  linkedin: 'https://www.linkedin.com/company/coreplusops/',
  locations: [
    { city: 'London', country: 'United Kingdom', tz: 'Europe/London' },
    { city: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai' },
  ],
};
