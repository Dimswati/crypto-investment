import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEnvValue<T>(key: string): T {
  const localValue = process.env[key]
  if (!localValue) throw new Error(`Undefined environment variable: ${key}`)
  return localValue as T
}
