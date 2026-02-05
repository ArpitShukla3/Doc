import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function generateId(): string {
    return crypto.randomUUID();
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
