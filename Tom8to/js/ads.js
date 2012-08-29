﻿(function() {
    var el;

    Observer.publish('Timer.start', function () {
        WinJS.UI.Animation.fadeOut(el);
    });

    Observer.subscribe('Timer.end', function () {
        WinJS.UI.Animation.fadeIn(el);
    });

    var init = function (adElement) {
        if (!adElement) {
            throw "Please provide an element for the ad control.";
        }

        el = document.getElementById(adElement);

        var adsSdk = new MicrosoftNSJS.Advertising.AdControl(el, { applicationId: 'a0ac85c7-c493-4006-a9f2-d598d3e3dfcf', adUnitId: '10042356' });
    }

    WinJS.Namespace.define("ADS", {
        init: init
    });
})();