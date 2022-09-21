// API helpers

export async function setTimer(id: string) {
    const timerResponse = await fetch('/api/timer/' + id, { method: 'POST' });
    return await timerResponse.json();
}

export async function stopTimer(id: string) {
    await fetch('/api/timer/' + id, { method: 'DELETE' });
}