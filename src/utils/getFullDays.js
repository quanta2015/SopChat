import moment from 'moment';

export const getFullDays = () => {
  return new Array(7).fill(0).map((_, index) => {
    const weekOfday = moment().format('E'); // 获取当前周一所对应的日期

    return {
      dayDate: moment()
        .subtract(weekOfday - 1 - index, 'days')
        .format('YYYY-MM-DD'),
      value: index + 1,
    };
  });
};

export const getFullMonth = () => {};
