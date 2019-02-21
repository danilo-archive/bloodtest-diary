const remote = require('electron').remote;

(function handleWindowControls() {
    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };

    function init() {
        let window = remote.getCurrentWindow();
        const minButton = document.getElementById('min-button')
        const maxButton = document.getElementById('max-button')
        const closeButton = document.getElementById('close-button')

        minButton.addEventListener("click", event => {
            window = remote.getCurrentWindow();
            window.minimize();
        });

        maxButton.addEventListener("click", event => {
            window = remote.getCurrentWindow();
            window.maximize();
        });

        closeButton.addEventListener("click", event => {
            window = remote.getCurrentWindow();
            window.close();
        });
    }
})();
