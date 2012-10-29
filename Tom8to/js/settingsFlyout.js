(function () {
	function initSettingsFlyout(element, options) {
		var alarmFont, alarmSound, reset;
		var settings = Windows.Storage.ApplicationData.current.roamingSettings;
		var container = settings.createContainer("Tom8toSettings", Windows.Storage.ApplicationDataCreateDisposition.always);

		alarmFont = document.querySelector('#alarmFont');
		alarmSound = document.querySelector('#alarmSound');
		reset = document.querySelector('#resetDefaults');

		if (container.values["alarmFont"]) { 
			alarmFont.value = container.values["alarmFont"];
		}

		if (container.values["alarmSound"]) {
			alarmSound.value = container.values["alarmSound"];
		}

		alarmFont.addEventListener('change', function () {
			container.values["alarmFont"] = alarmFont.value;

			Observer.publish('Settings.FontChange');
		});

		alarmSound.addEventListener('change', function () {
			container.values["alarmSound"] = alarmSound.value;

			if (alarmSound.value !== 'none') {
			  alarmSoundPreview.src = "audio/" + alarmSound.value + ".mp3";
			}

			Observer.publish('Settings.AlarmChange');
		});

		alarmSoundPreview.oncanplay = function () {
		  alarmSoundPreview.play();		  
		};
    
		reset.addEventListener('click', function () {
			container.values["alarmSound"] = "alarmRing";
			container.values["alarmFont"] = "segoeUI";

			alarmFont.value = "segoeUI";
			alarmSound.value = "alarmRing";

			Observer.publish('Settings.AlarmChange');
			Observer.publish('Settings.FontChange');
		});
	}

	WinJS.UI.Pages.define('/html/settingsFlyout.html', {
		ready: initSettingsFlyout
	});
})();