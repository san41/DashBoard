// TODO 
// 
// Add filter for color and cateogry 
// Test link 

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function($scope, socket, toaster){

	$scope.rssfeed = null;

	$scope.modal = null;


// function 

	function modalAddFeed(){

	}


// Add rss feed
	$scope.addRSSFeed = function(){

		var newFeed = {
			editable : true, 
		}
		$scope.modal = newFeed;
  	}

  	$scope.modalNewFeed = function (){
  		var newFeed = $scope.modal;
  		// Debug 
  		console.log(newFeed);

  		// Check all information : TODO 
  		// Change et evol information
		if(newFeed.name ==  null || newFeed.name == "" ){
			toaster.pop('error', 'Error', 'Title is empty !');
			return;
		}
		if(newFeed.link ==  null || newFeed.link == "" ){
			toaster.pop('error', 'Error', 'Link is empty or not valid !');
			return;
		}
		if(newFeed.category ==  null || newFeed.category == "" ){
			// todo add list
			toaster.pop('error', 'Error', 'Category is empty or not valid !');
			return;		
		}
		if(newFeed.color ==  null || newFeed.color == "" ){
			toaster.pop('error', 'Error', 'Color is empty or not valid !');
			return;	
		}
		console.log(newFeed);
		// Check
		socket.emit('feed/addfeed',newFeed, function(err, res){
			if(err){
				toaster.pop('error', 'Error', err);
				return;
			}
			toaster.pop('success', 'Success', 'RSS feed has been added');
			$scope.modal = null;
			      $scope.rssfeedCount = 1;
		});
  	}

  socket.emit('feed/list', function(err, list){
    // if(err){
    //   console.error(err);
    //   toaster.pop('error', 'Error', '')
    //   return
    // }
    console.log(list); 
       if(list > 0){
   		$scope.rssfeedCount = list;
    }else{
    	$scope.rssfeedCount = 0;
    }

  });


// Todo add check message 


}
},{}],2:[function(require,module,exports){
var plugin = getPlugin('rssreader');

plugin.registerController('RssReaderController', require('./controller/rssreader.js'));

plugin.registerRoute('/rssreader', {
  controller: 'RssReaderController',
  templateUrl: 'index.html'
});

plugin.registerMenuItem('RssReader', '/rssreader', 'fa-rss-square');
},{"./controller/rssreader.js":1}]},{},[2])