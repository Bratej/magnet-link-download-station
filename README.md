# Magnet Link Catcher for Synology Download Station

A simple Chrome extension that catches magnet links from websites and sends them directly to your Synology Download Station for automatic downloading.

---

## Features

- Detects magnet links on web pages.
- Sends magnet links to Synology Download Station instantly.
- Simple settings interface for easy configuration.
- Credentials stored locally and securely (never sent to external servers).

---

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top right corner).
4. Click **Load unpacked** and select the folder containing this extension.

---

## Configuration

1. Click the extension icon in Chrome.
2. Enter your Synology Download Station settings:

    - **Synology URL:** Full URL including protocol, e.g., `https://your-synology:5001`
    - **Username:** Your NAS username
    - **Password:** Your NAS password

3. Click **Save Settings**.

> ⚠️ Note: If you use `https`, make sure your Synology certificate is valid or accepted in your browser. Credentials are stored locally and only used to communicate with your NAS.

---

## Usage

- Navigate to a website with magnet links.
- Click the magnet link or right-click and choose to send it via the extension.
- The link will be automatically sent to your Download Station for downloading.

---

## Security

- Your credentials are stored locally in Chrome's storage.
- The extension communicates directly with your NAS; no data is sent to third-party servers.

---

## Development

- The settings page is in `settings.html` with `settings.js` handling storage and communication.
- Extension manifest and background scripts handle magnet link detection and sending.

---

## License

This project is released under the MIT License. Use it freely but at your own risk.

## Credits
Icons by Kemalmoe from Flaticon (https://www.flaticon.com/free-icons/magnet)

