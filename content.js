// Intercept clicks on magnet links
document.addEventListener('click', function(e) {
    const target = e.target.closest('a');

    if (target && target.href && target.href.startsWith('magnet:')) {
        e.preventDefault();
        e.stopPropagation();

        // Change cursor to loading
        const originalCursor = document.body.style.cursor;
        document.body.style.cursor = 'wait';
        target.style.cursor = 'wait';

        chrome.runtime.sendMessage({
            action: 'addMagnet',
            magnetUrl: target.href
        }, (response) => {
            document.body.style.cursor = originalCursor;
            target.style.cursor = '';
        });

        return false;
    }
}, true);

// Also intercept navigation attempts
document.addEventListener('beforeunload', function(e) {
    if (window.location.href.startsWith('magnet:')) {
        e.preventDefault();
    }
});

// Monitor for dynamically added links
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
                const magnetLinks = node.querySelectorAll ? node.querySelectorAll('a[href^="magnet:"]') : [];
                magnetLinks.forEach(link => {
                    if (!link.dataset.magnetHandled) {
                        link.dataset.magnetHandled = 'true';
                    }
                });
            }
        });
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
