import type geolonia from '@geolonia/embed';
import { createContext } from 'react';

export const GeoloniaMapContext = createContext<geolonia.Map | null>(null);
