
function init() {
    // When API is ready...
    gapi.hangout.onApiReady.add(
        function (eventObj) {
            if (eventObj.isApiReady) {
                // Bootstrap Angular manually so we make sure things happen in the proper order between
                // Angular and the Google APIs
                angular.bootstrap(document, ['appModule']);

                document.getElementById('buttonContainer').style.visibility = 'visible';

                // If destiny tokens have already been added, make sure the participant now joining sees the correct current state
                if (gapi.hangout.data.getValue('destiny')) {
                    angular.element(document.documentElement).scope().destiny = gapi.hangout.data.getValue('destiny');
                    angular.element(document.documentElement).scope().$apply();
                }
            }
        });
}

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);