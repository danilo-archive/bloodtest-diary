const remote = require('electron').remote;
const { app } = require('electron').remote;

(function handleWindowControls() {
    document.onreadystatechange = () => {
        if (document.readyState === "complete") {
            init();
        }
    };

    function init() {
        let window = remote.getCurrentWindow();
        const minButton = document.getElementById('min-button');
        const maxButton = document.getElementById('max-button');
        const closeButton = document.getElementById('close-button');

        const restartButton = document.getElementById('restart-button');

        minButton.addEventListener("click", event => {
            window.minimize();
        });

        maxButton.addEventListener("click", event => {
            if (window.isMaximized()) window.unmaximize();
            else window.maximize();
        });

        closeButton.addEventListener("click", event => {
            window.close();
        });

        restartButton.addEventListener("click", event => {
          app.relaunch();
          app.exit(0);
        });
    }
})();
