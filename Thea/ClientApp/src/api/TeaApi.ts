
// API helper

import Tea from "../model/Tea";

export async function getTeas(disable: boolean): Promise<Tea[]> {
    let url = 'api/tea';
    if (disable)
        url += '?disabled=true';

    const response = await fetch(url);
    return await response.json();
}

export async function getTea(id: string): Promise<Tea> {
    const response = await fetch('/api/tea/' + id);
    return await response.json();
}

export async function deleteTea(id: string) {
    await fetch('/api/tea/' + id, { method: 'DELETE' });
}

export async function disableTea(id: string) {
    await fetch('/api/tea/' + id + '/disable', { method: 'POST' });
}

export async function enableTea(id: string) {
    await fetch('/api/tea/' + id + '/enable', { method: 'POST' });
}

export async function favoriteTea(id: string) {
    await fetch('/api/tea/' + id + '/favorite', { method: 'POST' });
}

export async function unFavoriteTea(id: string) {
    await fetch('/api/tea/' + id + '/favorite', { method: 'DELETE' });
}

export async function updateTea(tea: Tea) {
    await fetch('/api/tea/', {
        method: 'POST',
        body: JSON.stringify(tea),
        headers: {
            'Content-Type': 'application/json',
        },
    })
}