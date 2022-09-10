export const getTime = (targetDate) => {
    return targetDate.getTime() - new Date().getTime()
};
