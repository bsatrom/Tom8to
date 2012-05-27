(function() {
	var topics = {},
      subUid = -1;
	
	WinJS.Namespace.define("Observer", {
		// Publish or broadcast events of interest
		// with a specific topic name and arguments
		// such as the data to pass along
		publish: function( topic, args ) {

			if ( !topics[topic] ) {
				return false;
			}

			var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;

			while (len--) {
				subscribers[len].func( topic, args );
			}

			return this;
		},
		// Subscribe to events of interest
		// with a specific topic name and a
		// callback function, to be executed
		// when the topic/event is observed
		subscribe: function( topic, func ) {

			if (!topics[topic]) {
				topics[topic] = [];
			}

			var token = ( ++subUid ).toString();
			topics[topic].push({
				token: token,
				func: func
			});
			return token;
		},
		// Unsubscribe from a specific
		// topic, based on a tokenized reference
		// to the subscription
		unsubscribe: function( token ) {
			for ( var m in topics ) {
				if ( topics[m] ) {
					for ( var i = 0, j = topics[m].length; i < j; i++ ) {
						if ( topics[m][i].token === token) {
							topics[m].splice( i, 1 );
							return token;
						}
					}
				}
			}
			return this;
		}
	});
})();