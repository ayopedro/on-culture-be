import { Period } from '@@/orders/dto/date-filter.dto';
import {
  NotFoundException,
  BadRequestException,
  RequestTimeoutException,
  UnauthorizedException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { matches } from 'class-validator';
import * as moment from 'moment';

@Injectable()
export class AppUtilities {
  public static generateProductCode(product_name: string): string {
    const product_code = product_name.toLowerCase().replace(/\s/g, '_');

    return product_code;
  }

  public static parseDate(date: string) {
    const dayFirstMatch = matches(
      date,
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    );
    return !dayFirstMatch ? date : moment(date, 'DD/MM/YYYY').toDate();
  }

  public static generateDateRange(period: Period) {
    const duration = moment.duration(period).asMonths();
    const previousDuration = moment().subtract(duration, 'month');

    const monthStart = previousDuration.startOf('month').toISOString();
    const monthEnd = previousDuration.endOf('month').toISOString();
    const yearStart = previousDuration.startOf('year').toISOString();
    const yearEnd = previousDuration.endOf('year').toISOString();

    let result;

    if (period === Period.THIS_YEAR || period === Period.THIS_MONTH) {
      result = {
        monthStart: moment().startOf('month').toISOString(),
        monthEnd: moment().endOf('month').toISOString(),
        yearStart: moment().startOf('year').toISOString(),
        yearEnd: moment().endOf('year').toISOString(),
        previousMonthStart: moment()
          .subtract(1, 'month')
          .startOf('month')
          .toISOString(),
        previousMonthEnd: moment()
          .subtract(1, 'month')
          .endOf('month')
          .toISOString(),
        previousYearStart: moment()
          .subtract(1, 'year')
          .startOf('year')
          .toISOString(),
        previousYearEnd: moment()
          .subtract(1, 'year')
          .endOf('year')
          .toISOString(),
      };
    } else {
      result = {
        monthStart,
        monthEnd,
        yearStart,
        yearEnd,
        previousMonthStart: moment(monthStart)
          .subtract(Number(duration), 'months')
          .toISOString(),
        previousMonthEnd: moment(monthEnd)
          .endOf('month')
          .subtract(Number(duration), 'months')
          .toISOString(),
        previousYearStart: moment(yearStart)
          .subtract(Number(duration), 'months')
          .toISOString(),
        previousYearEnd: previousDuration
          .endOf('year')
          .subtract(Number(duration), 'months')
          .toISOString(),
      };
    }

    return result;
  }

  public static calculatePeriodDiff(curr: number, prev: number = 0) {
    const calculation = prev ? ((curr - prev) / prev) * 100 : 100;
    if (curr === 0) return 0;
    return calculation;
  }

  public static handleException(error: any): Error {
    console.error(AppUtilities.requestErrorHandler(error));

    const errorCode: string = error.code;
    const message: string = error.meta
      ? error.meta.cause
        ? error.meta.cause
        : error.meta.field_name
          ? error.meta.field_name
          : error.meta.column
            ? error.meta.table
            : error.meta.table
      : error.message;
    switch (errorCode) {
      case 'P0000':
      case 'P2003':
      case 'P2004':
      case 'P2015':
      case 'P2018':
      case 'P2025':
        return new NotFoundException(message);
      case 'P2005':
      case 'P2006':
      case 'P2007':
      case 'P2008':
      case 'P2009':
      case 'P2010':
      case 'P2011':
      case 'P2012':
      case 'P2013':
      case 'P2014':
      case 'P2016':
      case 'P2017':
      case 'P2019':
      case 'P2020':
      case 'P2021':
      case 'P2022':
      case 'P2023':
      case 'P2026':
      case 'P2027':
        return new BadRequestException(message);
      case 'P2024':
        return new RequestTimeoutException(message);
      case 'P0001':
        return new UnauthorizedException(message);
      case 'P2002':
        const msg = `Conflict Exception: '${error.meta?.target?.[0]}' already exists!`;
        return new ConflictException(error.meta?.target?.[0] ? msg : message);
      default:
        console.error(message);
        if (!!message && message.toLocaleLowerCase().includes('arg')) {
          return new BadRequestException(
            'Invalid/Unknown field was found in the data set!',
          );
        } else {
          return error;
        }
    }
  }

  public static requestErrorHandler = (response: any = {}) => {
    const {
      message: errorMessage,
      response: serverResp,
      isCancel,
      isNetwork,
      config,
    } = response;

    let message = errorMessage,
      data: any = {},
      isServerError = false;

    if (serverResp?.data) {
      isServerError = true;
      message =
        serverResp.data?.error ||
        serverResp.data?.message ||
        'Unexpected error occurred!';
      data =
        typeof serverResp.data === 'object'
          ? { ...serverResp.data }
          : { data: serverResp.data };
      delete data.message;
    } else if (isCancel) {
      message = 'Request timed out.';
    } else if (isNetwork) {
      message = 'Network not available!';
    }

    const errorData = {
      message,
      isServerError,
      ...(isServerError && {
        data: {
          ...data,
          errorMessage,
          api: {
            method: config?.method,
            url: config?.url,
            baseURL: config?.baseURL,
          },
        },
      }),
    };

    return errorData;
  };

  public static removeSensitiveData(data: any, deleteKeys: any, remove = true) {
    if (typeof data != 'object') return;
    if (!data) return;

    for (const key in data) {
      if (deleteKeys.includes(key)) {
        remove ? delete data[key] : (data[key] = '******************');
      } else {
        AppUtilities.removeSensitiveData(data[key], deleteKeys);
      }
    }
    return data;
  }

  public static encode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data).toString(encoding);
  }

  public static decode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data, encoding).toString();
  }
}
