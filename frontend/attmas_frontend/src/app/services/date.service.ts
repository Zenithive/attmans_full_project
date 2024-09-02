// utils/dateUtils.ts

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const defaultTimezone: string = process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || 'UTC'; // or any desired timezone like 'America/New_York'

/**
 * Format a date to UTC
 * @param date - The date to format
 * @returns The formatted date string in UTC
 */
export const formatToUTC = (date: string | Date): string => {
  return dayjs(date).utc().format();
};

/**
 * Convert a date from UTC to the local timezone
 * @param date - The date to convert
 * @returns The date string in the local timezone
 */
export const formatToLocal = (date: string | Date): string => {
  return dayjs.utc(date).tz(defaultTimezone).format();
};

/**
 * Get the current date in the default timezone
 * @returns The current date string in the default timezone
 */
export const getCurrentDate = (): string => {
  return dayjs().tz(defaultTimezone).format();
};
