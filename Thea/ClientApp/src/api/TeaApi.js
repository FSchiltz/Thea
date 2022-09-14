
// API helper

export async function getTeas(disable) {
    let url = 'api/tea';
    if (disable)
        url += '?disabled=true';

    const response = await fetch(url);
    return await response.json();
}

export async function getTea(id) {
    const response = await fetch('/api/tea/' + id);
    return await response.json();
}

export async function deleteTea(id) {
    await fetch('/api/tea/' + id, { method: 'DELETE' });
}

export async function disableTea(id) {
    await fetch('/api/tea/' + id + '/disable', { method: 'POST' });
}

export async function enableTea(id) {
    await fetch('/api/tea/' + id + '/enable', { method: 'POST' });
}

export async function favoriteTea(id) {
    await fetch('/api/tea/' + id + '/favorite', { method: 'POST' });
}

export async function unFavoriteTea(id) {
    await fetch('/api/tea/' + id + '/favorite', { method: 'DELETE' });
}

export async function updateTea(tea) {
    await fetch('/api/tea/', {
        method: 'POST',
        body: JSON.stringify(tea),
        headers: {
            'Content-Type': 'application/json',
        },
    })
}