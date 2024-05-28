import { Period } from '@@/orders/dto/date-filter.dto';

export const SensitiveUserInfo = ['password'];

export const DateRangeMap = {
  [Period.THIS_YEAR]: {
    startDate: 'currentYearStart',
    endDate: 'currentYearEnd',
  },
  [Period.THIS_MONTH]: {
    startDate: 'currentMonthStart',
    endDate: 'currentMonthEnd',
  },
  [Period.LAST_MONTH]: {
    startDate: 'previousMonthStart',
    endDate: 'previousMonthEnd',
  },
  [Period.LAST_YEAR]: {
    startDate: 'previousYearStart',
    endDate: 'previousYearEnd',
  },
  [Period.TWO_YEARS]: {
    startDate: 'previousYearStart',
    endDate: 'previousYearEnd',
  },
  [Period.THREE_YEARS]: {
    startDate: 'previousYearStart',
    endDate: 'previousYearEnd',
  },
};
