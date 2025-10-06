const statusDiv = document.getElementById('status');
const fields = ['synologyUrl', 'username', 'password'];
let statusTimeout;

// Load settings
document.addEventListener('DOMContentLoaded', async () => {
    const settings = await chrome.storage.sync.get(fields);

    fields.forEach(id => {
        if (settings[id]) {
            document.getElementById(id).value = settings[id];
        }
    });
});

// Save settings
document.getElementById('save').addEventListener('click', async () => {
    const synologyUrl = document.getElementById('synologyUrl').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!synologyUrl || !username || !password) {
        showStatus('Please fill in all fields.', 'error');
        return;
    }

    await chrome.storage.sync.set({
        synologyUrl: synologyUrl.replace(/\/$/, ''),
        username,
        password
    });

    showStatus('Settings saved successfully!', 'success');
});

function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `${type} visible`;

    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
        statusDiv.classList.remove('visible');
    }, 3000);
}
