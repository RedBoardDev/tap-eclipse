(function () {
    'use strict';

    const MIN_CLICK_INTERVAL = 125; // Minimum : 8 clics par seconde
    const MAX_CLICK_INTERVAL = 333; // Maximum : 3 clics par seconde
    const MIN_REFRESH_INTERVAL = 1 * 60 * 1000; // Minimum : 1 minute
    const MAX_REFRESH_INTERVAL = 6 * 60 * 1000; // Maximum : 6 minutes
    const MIN_RESTART_DELAY = 10000; // Minimum : 10 secondes
    const MAX_RESTART_DELAY = 30000; // Maximum : 60 secondes
    const MIN_CHECK_INTERVAL = 2000; // Minimum : 1 seconde
    const MAX_CHECK_INTERVAL = 10000; // Maximum : 5 secondes

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

            // Redémarrer les clics après le rafraîchissement
            const randomRestartDelay = randomInterval(MIN_RESTART_DELAY, MAX_RESTART_DELAY);
            setTimeout(() => {
                startClicking(canvasElement);
            }, randomRestartDelay);
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
(function () {
    'use strict';

    const MIN_CLICK_INTERVAL = 125; // Minimum : 8 clics par seconde
    const MAX_CLICK_INTERVAL = 333; // Maximum : 3 clics par seconde
    const MIN_REFRESH_INTERVAL = 1 * 60 * 1000; // Minimum : 1 minute
    const MAX_REFRESH_INTERVAL = 6 * 60 * 1000; // Maximum : 6 minutes
    const MIN_RESTART_DELAY = 10000; // Minimum : 10 secondes
    const MAX_RESTART_DELAY = 60000; // Maximum : 60 secondes
    const MIN_CHECK_INTERVAL = 1000; // Minimum : 1 seconde
    const MAX_CHECK_INTERVAL = 5000; // Maximum : 5 secondes
    const MIN_PAUSE_DURATION = 5000; // Minimum pause : 5 secondes
    const MAX_PAUSE_DURATION = 20000; // Maximum pause : 20 secondes
    const PAUSE_CHANCE = 0.1; // 10% de chances de faire une pause à chaque clic

    const CANVAS_XPATH = '/html/body/div[1]/div[2]/main/div[2]/div[1]/div/div[1]/div[2]/div/div/canvas';

    let clickIntervalId = null;
    let refreshTimeoutId = null;
    let isPaused = false;

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
            if (isPaused) {
                console.log('En pause... Aucun clic en cours.');
                return;
            }

            clickElement(canvasElement);

            // Chance de faire une pause aléatoire
            if (Math.random() < PAUSE_CHANCE) {
                const pauseDuration = randomInterval(MIN_PAUSE_DURATION, MAX_PAUSE_DURATION);
                console.log(`Pause aléatoire : ${pauseDuration}ms`);
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    performRandomClick(); // Reprendre après la pause
                }, pauseDuration);
                return;
            }

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

            // Redémarrer les clics après le rafraîchissement
            const randomRestartDelay = randomInterval(MIN_RESTART_DELAY, MAX_RESTART_DELAY);
            setTimeout(() => {
                startClicking(canvasElement);
            }, randomRestartDelay);
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
