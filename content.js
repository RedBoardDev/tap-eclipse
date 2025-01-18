(function () {
  'use strict';

  const MIN_CLICK_INTERVAL = 125; // Plus rapide : 20 clics par seconde
  const MAX_CLICK_INTERVAL = 333; // Maximum : 8 clics par seconde
  const REFRESH_INTERVAL = 5 * 60 * 1000; // 15 minutes
  const RESTART_DELAY = 30000; // 30 secondes après rafraîchissement
  const CHECK_INTERVAL = 5000; // Vérification du canvas toutes les 5 secondes

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

  function startClicking(canvasElement) {
      function performRandomClick() {
          clickElement(canvasElement);
          const randomInterval = Math.random() * (MAX_CLICK_INTERVAL - MIN_CLICK_INTERVAL) + MIN_CLICK_INTERVAL;
          clickIntervalId = setTimeout(performRandomClick, randomInterval);
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
          refreshTimeoutId = setTimeout(() => {
              refreshPage();
          }, REFRESH_INTERVAL);

          // Redémarrer les clics après le rafraîchissement
          setTimeout(() => {
              startClicking(canvasElement);
          }, RESTART_DELAY);
      } else {
          console.log('Canvas non encore chargé...');
      }
  }, CHECK_INTERVAL);

  // Nettoyage lors de la désactivation du script
  window.addEventListener('beforeunload', () => {
      stopClicking();
      if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
      }
  });
})();
