import { Period } from '@@/orders/dto/date-filter.dto';

export const SensitiveUserInfo = ['password'];

export const DateRangeMap = {
  [Period.THIS_YEAR]: {
    startDate: 'yearStart',
    endDate: 'yearEnd',
    previousStart: 'previousYearStart',
    previousEnd: 'previousYearEnd',
  },
  [Period.THIS_MONTH]: {
    startDate: 'monthStart',
    endDate: 'monthEnd',
    previousStart: 'previousMonthStart',
    previousEnd: 'previousMonthEnd',
  },
  [Period.LAST_MONTH]: {
    startDate: 'monthStart',
    endDate: 'monthEnd',
    previousStart: 'previousMonthStart',
    previousEnd: 'previousMonthEnd',
  },
  [Period.LAST_YEAR]: {
    startDate: 'yearStart',
    endDate: 'yearEnd',
    previousStart: 'previousYearStart',
    previousEnd: 'previousYearEnd',
  },
  [Period.TWO_YEARS]: {
    startDate: 'yearStart',
    endDate: 'yearEnd',
    previousStart: 'previousYearStart',
    previousEnd: 'previousYearEnd',
  },
  [Period.THREE_YEARS]: {
    startDate: 'yearStart',
    endDate: 'yearEnd',
    previousStart: 'previousYearStart',
    previousEnd: 'previousYearEnd',
  },
};
