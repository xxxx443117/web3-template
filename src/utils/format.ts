import dayjs from "dayjs";
import getTimePeriods from "./getTimePeriods";
/**
 * 本地化显示
 * 10000 => 10,000
 * @param number 数字或者字符串数字
 * @param minPrecision 最小保留小数位数
 * @param maxPrecision 最大保留小数位数
 * @param isDown 是否向下取整
 * @returns
 */
export const formatNumber = (number: number | string, minPrecision = 0, maxPrecision = 4, isDown = true) => {
  let num = Number(number);
  if (!num) return "0";
  if (isDown) {
    num = Math.floor(num * Math.pow(10, maxPrecision)) / Math.pow(10, maxPrecision);
  }
  if (num < 0.0001) return "< 0.0001";
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  };
  return num.toLocaleString(undefined, options);
};

export const formatLockDay = (seconds: number, t: Function) => {
  const timeLeft = getTimePeriods(seconds, true);
  // const { t } = useI18n();
  const days = timeLeft.days > 0 ? `${timeLeft.days}${t("天")}` : "";
  const hours = timeLeft.hours > 0 ? `${timeLeft.hours}${t("小时")}` : "";
  const minutes = timeLeft.minutes > 0 ? `${timeLeft.minutes}${t("分钟")}` : "";
  const _seconds = timeLeft.seconds > 0 ? `${timeLeft.seconds}${t("秒")}` : "";
  return `${days}${hours}${minutes}${_seconds}` || t("未设置");
};

/**
 * 格式化日期
 * @param e 日期
 * @param type 格式
 * @returns
 */
export function formatTime(e: string | number = "", type: string = "YYYY-MM-DD HH:mm") {
  return dayjs(e ? parseInt(e.toString()) * 1000 : Date.now()).format(type);
}
