import * as moment from 'moment';
// import { FREQUENCY } from '../config/misc';

export const getCurrentDate = (): string => {
  return moment().format("YYYY-MM-DD");
}

export const getDaysDiff = (oldDate: Date | string, newDate: string | Date = new Date()): number => {
  return moment(oldDate).diff(moment(newDate), 'days')
}

export const isValidDate = (date: Date | string, format = 'YYYY-MM-DD'): boolean => {
  return moment(date, format, true).isValid();
}

export const getNextDays = (noOfDays = 1, startDate: string | Date = new Date()): Date => {
  const nextDate = moment(startDate).add(noOfDays, 'day').format();

  return new Date(nextDate);
}

export const getNextMonthDay = (noOfMonths = 1, startDate: string | Date = new Date()): Date => {
  const nextDate = moment(startDate).add(noOfMonths, 'month').format();

  return new Date(nextDate);
}

export const getNextStartOfDays = (noOfDays = 1, startDate: string | Date = new Date()): Date => {
  const nextDate = getNextDays(noOfDays, startDate);

  return new Date(moment(nextDate).startOf('day').format());
}

export const getNextEndOfDays = (noOfDays = 1, startDate: string | Date = new Date()): Date => {
  const nextDate = getNextDays(noOfDays, startDate);

  return new Date(moment(nextDate).endOf('day').format());
}

export const isToday = (date: Date | string): boolean => {
  return moment(date).isSame(moment(), 'day');
};

export const isPreviousDate = (date: Date | string, futureDate: Date | string = new Date()): boolean => {
  if (moment(date).isSame(futureDate, 'day'))	// is same day
    return false;

  if (moment(date).isBefore(futureDate)) // is before
    return true;

  return false;
};

export const isFutureDate = (date: Date, futureDate = new Date()): boolean => {

  if (moment(date).isSame(futureDate, 'day'))	// is same day
    return false;

  // return !isPreviousDate(date, futureDate);
  if (moment(date).isAfter(futureDate)) // is before
    return true;

  return false;
};

export const isTodayOrFutureDate = (date: Date, futureDate = new Date()): boolean => {

  if (moment(date).isSame(futureDate, 'day'))	// is same day
    return true;

  // return !isPreviousDate(date, futureDate);
  if (moment(date).isAfter(futureDate)) // is before
    return true;

  return false;
};

export const getNextScheduledDate = (): Date => {
  let nextDate;

  // switch (frequency) {
  // 	case FREQUENCY.DAILY:
  // 		nextDate = moment(startDate).add(totalAttempts + offset, 'day').format();
  // 		break;
  // 	case FREQUENCY.WEEKLY:
  // 		nextDate = moment(startDate).add(totalAttempts + offset, 'week').format();
  // 		break;
  // 	case FREQUENCY.MONTHLY:
  // 		nextDate = moment(startDate).add(totalAttempts + offset, 'months').format();
  // 		break;
  // 	case FREQUENCY.BI_MONTHLY:
  // 		nextDate = moment(startDate).add(2 + totalAttempts + offset, 'week').format();
  // 		break;
  // 	case FREQUENCY.QUATERLY:
  // 		nextDate = moment(startDate).add(3 + totalAttempts + offset, 'months').format();
  // 		break;
  // 	default:
  // 		throw new Error('Invalid frequency');
  // }
  return (nextDate);
};
