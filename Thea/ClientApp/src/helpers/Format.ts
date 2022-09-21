
export function formatDuration(duration: string) {
    if (duration) {
        const splitted = duration.split(':');

        return `${splitted[1].padStart(2, '0')}:${splitted[2].padStart(2, '0')}`;
    } else return '';
}

export function createDuration(minutes: any, seconds: any) {
    return `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function deconstructDuration(duration: string) {
    const date = duration.split(':');
    const minutes = parseInt(date[1]);
    const seconds = parseInt(date[2]);

    return [minutes, seconds];
}