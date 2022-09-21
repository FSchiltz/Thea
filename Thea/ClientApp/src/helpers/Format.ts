
export function formatDuration(duration: string) {
    if (duration) {
        const splitted = duration.split(':');

        return `${splitted[1].padStart(2, '0')}:${splitted[2].padStart(2, '0')}`;
    } else return '';
}
