
// API helper

export async function getTeas() {
    const response = await fetch('api/tea');
    return await response.json();
}

export async function getTea(id) {
    const response = await fetch('/api/tea/' + id);
    return await response.json();
}

export async function deleteTea(id) {
    await fetch('/api/tea/' + id, { method: 'DELETE' });
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