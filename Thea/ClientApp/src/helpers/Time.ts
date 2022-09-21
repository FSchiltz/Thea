export const getTime = (targetDate: { getTime: () => number; }) => {
    return targetDate.getTime() - new Date().getTime()
};
