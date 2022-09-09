export function askNotifyPermission() {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;

    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                return true;
            }
        });
    }

    return false;
}