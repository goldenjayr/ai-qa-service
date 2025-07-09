import { initialServicesData } from './mockData';
import type { Service } from '../types/types';

export async function fetchServices(): Promise<Service[]> {
  try {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return initialServicesData;
    }
    return data;
  } catch (error) {
    console.error('Error fetching services from API:', error);
    return initialServicesData;
  }
}
