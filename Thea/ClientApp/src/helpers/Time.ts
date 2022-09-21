export function getTime(targetDate: Date) {
    return targetDate.getTime() - new Date().getTime()
};

export function deconstructDuration(duration?: string) {
    if (!duration)
        return [0, 0];

    const date = duration.split(':');
    const minutes = parseInt(date[1]);
    const seconds = parseInt(date[2]);

    return [minutes, seconds];
}

export function getDuration(minutes: number, seconds: number) {
    return `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
