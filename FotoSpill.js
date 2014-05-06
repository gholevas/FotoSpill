	    window.onload = function() {
        cast.receiver.logger.setLevelValue(0);
        window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        console.log('Starting Receiver Manager');
        
        // handler for the 'ready' event
        castReceiverManager.onReady = function(event) {
          console.log('Received Ready event: ' + JSON.stringify(event.data));
          window.castReceiverManager.setApplicationState("Application status is ready...");
        };
        
        // handler for 'senderconnected' event
        castReceiverManager.onSenderConnected = function(event) {
          console.log('Received Sender Connected event: ' + event.data);
          console.log(window.castReceiverManager.getSender(event.data).userAgent);
        };
        
        // handler for 'senderdisconnected' event
        castReceiverManager.onSenderDisconnected = function(event) {
          console.log('Received Sender Disconnected event: ' + event.data);
          if (window.castReceiverManager.getSenders().length == 0) {
                // window.close();
              }
        };
        
        // handler for 'systemvolumechanged' event
        castReceiverManager.onSystemVolumeChanged = function(event) {
          console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
              event.data['muted']);
        };

        // create a CastMessageBus to handle messages for a custom namespace
        window.messageBus =
          window.castReceiverManager.getCastMessageBus(
              'urn:x-cast:com.google.cast.sample.helloworld');

        // handler for the CastMessageBus message event
        window.messageBus.onMessage = function(event) {
          console.log('Message [' + event.senderId + ']: ' + event.data);
          // display the message from the sender
          displayText(event.data);
          if (event.data == "quit") {
          	window.close();
          };
          // inform all senders on the CastMessageBus of the incoming message event
          // sender message listener will be invoked
          window.messageBus.send(event.senderId, event.data);
        }

        // initialize the CastReceiverManager with an application status message
        window.castReceiverManager.start({statusText: "Application is starting"});
        console.log('Receiver Manager started');
      };
      

      // utility function to display the text message in the input field
      function displayText(text) {
        console.log(text);

        document.getElementById("message").innerHTML=text;
        

        window.castReceiverManager.setApplicationState(text);


      };


















var FotoSpill = angular.module('FotoSpill', []);
	FotoSpill.config(['$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {$routeProvider.when('/tag/:tag');}]);
  	FotoSpill.controller('slideshow', function ( $scope, $http, $timeout, $route, $location ) {
			// Set the API endpoint
			var api = 'https://api.instagram.com/v1/locations/436022/media/recent?access_token=257058201.9af4692.3d68e63b114944a0be332da732923a23&callback=JSON_CALLBACK',
				newReq, refreshApi;
			var seconds = 1000;


			$scope.fetchImages = function() {
				
				$scope.loadingClass = 'loading';
				$scope.imgCurrent = 0;


				// if ( ! $route.current )
				// 	$location.path( '/tag/' + $scope.tag );
				// else if ( angular.isDefined( $route.current.params.tag ) )
				// 	$scope.tag = $route.current.params.tag;

				$http.jsonp( 
					api.replace( '%tag%', $scope.tag )
				).success( function( data ) {
					delete $scope.loadingClass;

					$scope.images = data.data;

					// Set the first image active
					if ( data.data.length )
						$scope.makeActiveSlide( $scope.imgCurrent );

					// Cancel the previous update request
					if ( refreshApi )
						$timeout.cancel( refreshApi );

					// Check for new images on every loop
					if ( data.data.length )
						refreshApi = $timeout( $scope.fetchImages, 100*seconds );
				}).error( function() {
					delete $scope.loadingClass;
					refreshApi = $timeout( $scope.fetchImages, 2*seconds );
				});
			}

			// Fetch images
			$timeout( $scope.fetchImages );

			$scope.advanceSlide = function() {
				// Method 1
				// Use a classname to highlight the current active slide
				if ( angular.isDefined( $scope.images ) && $scope.images.length )
					$scope.makeActiveSlide( $scope.imgCurrent + 1 );
					

				$timeout( $scope.advanceSlide, 10*seconds );  //time between slide transition
			}

			// Advance slides
			$timeout( $scope.advanceSlide );

			$scope.makeActiveSlide = function( index ) {
				// Inactivate the previous slide
				delete $scope.images[ $scope.imgCurrent ].isActive;

				// Select the next slide
				$scope.imgCurrent = ( index ) % $scope.images.length;
				// Activate the next slide
				$scope.images[ $scope.imgCurrent ].isActive = true;
			}

			$scope.tagChange = function() {
				$location.path( '/tag/' + $scope.tag );

				if ( newReq )
					$timeout.cancel( newReq );

				newReq = $timeout( function() {
					$scope.fetchImages();
					$timeout.cancel( newReq );
				}, 1*seconds);
			}
		}
	).filter(
		'escape', function () {
			return function( input ) {
				return escape( input );
			}
		}	
	);






