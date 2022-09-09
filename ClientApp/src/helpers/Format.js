
export function formatDuration(duration) {
    if (duration) {
        const splitted = duration.split(':');

        return `${splitted[1].padStart(2, '0')}:${splitted[2].padStart(2, '0')}`;
    } else return '';
}

export function createDuration(minutes, seconds) {
    return `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function deconstructDuration(duration) {
    const date = duration.split(':');
    const minutes = parseInt(date[1]);
    const seconds = parseInt(date[2]);

    return [minutes, seconds];
}