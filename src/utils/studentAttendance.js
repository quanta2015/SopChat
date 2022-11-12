export const statusText = {
  '-2': '早退',
  '-1': '迟到',
  '0': '签到',
  '1': '正常到校',
  '2': '正常离校',
  '-3': '缺卡',
  '-4': '无记录',
  '-5': '补签到',
  '-6': '请假',
  '4': '睡前签到',
};

export const statusColor = {
  '-2': 'late',
  '-1': 'late',
  '0': '未知',
  '1': 'on-time',
  '4': 'on-time',
  '2': 'on-time',
  '-3': 'no-sign',
  '-5': 'sign-again',
  '-6': 'leave',
};

export function getSelectWeeks(data) {
  let selectWeekDay = [];
  if (data.checkRuleType === 2) {
    selectWeekDay = data.fixationRuleVO.fixationCheckWeek.split(',');
  } else {
    if (data.flexibleRuleVO.monday) {
      selectWeekDay.push('monday');
    }
    if (data.flexibleRuleVO.tuesday) {
      selectWeekDay.push('tuesday');
    }
    if (data.flexibleRuleVO.wednesday) {
      selectWeekDay.push('wednesday');
    }
    if (data.flexibleRuleVO.thursday) {
      selectWeekDay.push('thursday');
    }
    if (data.flexibleRuleVO.friday) {
      selectWeekDay.push('friday');
    }
    if (data.flexibleRuleVO.saturday) {
      selectWeekDay.push('saturday');
    }
    if (data.flexibleRuleVO.sunday) {
      selectWeekDay.push('sunday');
    }
  }

  return selectWeekDay;
}

export function getFixationRuleVOTimeArr(data) {
  const fixationRuleVOTimeArr = [];
  const { fixationCalculateRuleId, fixationCheckTime } = data.fixationRuleVO;
  const arr = (fixationCheckTime && fixationCheckTime.split(';')) || [];
  if (fixationCalculateRuleId === 2) {
    arr.forEach((item, index) => {
      const itemArr = item.split(',');
      fixationRuleVOTimeArr.push({
        one: itemArr[0],
        two: itemArr[1],
        three: itemArr[2],
        four: itemArr[3],
        key: index,
      });
    });
  } else {
    arr.forEach((item, index) => {
      const itemArr = item.split(',');
      fixationRuleVOTimeArr.push({
        one: itemArr[0],
        two: itemArr[1],
        three: itemArr[2],
        four: itemArr[3],
        five: itemArr[4],
        six: itemArr[5],
        key: index,
      });
    });
  }
  return fixationRuleVOTimeArr;
}

export function getSpecialRuleVOTimeArr(item) {
  const specialRuleVOTimeArr = [];
  const { calculateRule, time } = item;
  const arr = time.split(';') || [];
  if (calculateRule === 2) {
    arr.forEach((ele, index) => {
      const itemArr = ele.split(',');
      specialRuleVOTimeArr.push({
        one: itemArr[0],
        two: itemArr[1],
        three: itemArr[2],
        four: itemArr[3],
        key: index,
      });
    });
  } else {
    arr.forEach((ele, index) => {
      const itemArr = ele.split(',');
      specialRuleVOTimeArr.push({
        one: itemArr[0],
        two: itemArr[1],
        three: itemArr[2],
        four: itemArr[3],
        five: itemArr[4],
        six: itemArr[5],
        key: index,
      });
    });
  }
  return specialRuleVOTimeArr;
}

export function isFlexibleRuleVOComplete(data) {
  let flag = true;
  if (
    !data.monday &&
    !data.tuesday &&
    !data.wednesday &&
    !data.thursday &&
    !data.friday &&
    !data.saturday &&
    !data.sunday
  ) {
    flag = false;
  }
  return flag;
}

export function timeArr(data) {
  const arr = [];
  (data || []).forEach((item, key) => {
    arr.push({ ...item, key });
  });
  return arr;
}
