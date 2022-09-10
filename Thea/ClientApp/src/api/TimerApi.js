// API helpers

export async function setTimer(id) {
    const timerResponse = await fetch('/api/timer/' + id, { method: 'POST' });
    return await timerResponse.json();
}

export async function stopTimer(id) {
    await fetch('/api/timer/' + id, { method: 'DELETE' });
}