// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'addMagnet') {
        addToDownloadStation(request.magnetUrl)
            .then(() => sendResponse({ success: true }))
            .catch(() => sendResponse({ success: false }));
        return true; // Keep channel open for async response
    }
});

async function addToDownloadStation(magnetUrl) {
    try {
        // Get stored settings
        const settings = await chrome.storage.sync.get([
            'synologyUrl',
            'username',
            'password'
        ]);

        if (!settings.synologyUrl || !settings.username || !settings.password) {
            console.error('Synology settings not configured');
            showNotification('Error', 'Please configure Synology settings first.');
            return;
        }

        // Login to Synology
        const sid = await login(settings);

        if (!sid) {
            showNotification('Error', 'Failed to login to Synology.');
            return;
        }

        // Add magnet link to Download Station
        const success = await addTask(settings.synologyUrl, sid, magnetUrl);

        showNotification(success ? 'Success' : 'Error',
            success ? 'Magnet link added to Download Station.' : 'Failed to add magnet link.');

        // Logout
        await logout(settings.synologyUrl, sid);

    } catch (error) {
        console.error('Error adding magnet:', error);
        showNotification('Error', error.message);
    }
}

async function login(settings) {
    try {
        const url = new URL('/webapi/auth.cgi', settings.synologyUrl);

        url.search = new URLSearchParams({
            api: 'SYNO.API.Auth',
            version: '3',
            method: 'login',
            account: settings.username,
            passwd: settings.password,
            session: 'DownloadStation',
            format: 'sid'
        }).toString();

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            return data.data.sid;
        }

        if (data.error) {
            console.error('Synology API error:', data.error.code);
        }
        return null;
    } catch (error) {
        console.error('Login error:', error);

        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            throw new Error('Connection failed. If using HTTPS with self-signed certificate, please visit your Synology URL in a browser tab first and accept the certificate warning.');
        }
        return null;
    }
}

async function addTask(synologyUrl, sid, magnetUrl) {
    try {
        const url = new URL('/webapi/DownloadStation/task.cgi', synologyUrl);

        url.search = new URLSearchParams({
            api: 'SYNO.DownloadStation.Task',
            version: '1',
            method: 'create',
            uri: magnetUrl,
            _sid: sid,
        }).toString();

        const response = await fetch(url);
        const data = await response.json();

        return data.success;
    } catch (error) {
        console.error('Add task error:', error);
        return false;
    }
}

async function logout(synologyUrl, sid) {
    try {
        const url = new URL('/webapi/auth.cgi', synologyUrl);

        url.search = new URLSearchParams({
            api: 'SYNO.API.Auth',
            version: '1',
            method: 'logout',
            _sid: sid,
        }).toString();

        await fetch(url);
    } catch (error) {
        console.error('Logout error:', error);
    }
}

function showNotification(title, message) {
    if (chrome.notifications) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png',
            title: title,
            message: message
        });
    } else {
        console.log(`${title}: ${message}`);
    }
}
