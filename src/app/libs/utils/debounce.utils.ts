const debounce = <A extends unknown[], R>(
  func: (...args: A) => R,
  delay: number
) => {
  let timeout: NodeJS.Timeout | undefined;
  return (...args: A): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};
export default debounce;