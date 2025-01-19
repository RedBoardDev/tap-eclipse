(function () {
    'use strict';

    const MIN_CLICK_INTERVAL = 167; // Minimum : 6 clics par seconde
    const MAX_CLICK_INTERVAL = 500; // Maximum : 1 clic par seconde
    const MIN_REFRESH_INTERVAL = 1 * 60 * 1000; // Minimum : 1 minute
    const MAX_REFRESH_INTERVAL = 6 * 60 * 1000; // Maximum : 6 minutes
    const MIN_RESTART_DELAY = 10000; // Minimum : 10 secondes
    const MAX_RESTART_DELAY = 60000; // Maximum : 60 secondes
    const MIN_CHECK_INTERVAL = 1000; // Minimum : 1 seconde
    const MAX_CHECK_INTERVAL = 5000; // Maximum : 5 secondes

    const CANVAS_XPATH = '/html/body/div[1]/div[2]/main/div[2]/div[1]/div/div[1]/div[2]/div/div/canvas';

    let clickIntervalId = null;
    let refreshTimeoutId = null;

    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function clickElement(element) {
        if (element) {
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
            });

            element.dispatchEvent(clickEvent);
            console.log('Clic effectué');
        } else {
            console.error('Canvas non trouvé');
        }
    }

    function randomInterval(min, max) {
        return Math.random() * (max - min) + min;
    }

    function startClicking(canvasElement) {
        function performRandomClick() {
            clickElement(canvasElement);
            const randomClickInterval = randomInterval(MIN_CLICK_INTERVAL, MAX_CLICK_INTERVAL);
            clickIntervalId = setTimeout(performRandomClick, randomClickInterval);
        }

        performRandomClick();
    }

    function stopClicking() {
        if (clickIntervalId) {
            clearTimeout(clickIntervalId);
            clickIntervalId = null;
            console.log('Auto-clicker arrêté');
        }
    }

    function refreshPage() {
        console.log('Rafraîchissement de la page...');
        stopClicking();
        location.reload();
    }

    const canvasInterval = setInterval(() => {
        const canvasElement = getElementByXPath(CANVAS_XPATH);
        if (canvasElement) {
            console.log('Canvas trouvé ! Démarrage des clics.');
            clearInterval(canvasInterval);

            // Démarrer les clics
            startClicking(canvasElement);

            // Planifier le rafraîchissement de la page
            const randomRefreshInterval = randomInterval(MIN_REFRESH_INTERVAL, MAX_REFRESH_INTERVAL);
            refreshTimeoutId = setTimeout(() => {
                refreshPage();
            }, randomRefreshInterval);
        } else {
            console.log('Canvas non encore chargé...');
        }
    }, randomInterval(MIN_CHECK_INTERVAL, MAX_CHECK_INTERVAL));

    // Nettoyage lors de la désactivation du script
    window.addEventListener('beforeunload', () => {
        stopClicking();
        if (refreshTimeoutId) {
            clearTimeout(refreshTimeoutId);
        }
    });
})();
