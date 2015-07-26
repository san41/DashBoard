var RssReader = require('./models/rssreader.js');
var feed = require('feed-read');
module.exports = function(socket){

  // Socket to add feed link in database 
  
  socket.on('feed/addfeed', function(data, callback){
      RssReader.findOne({'user':socket.request.user, 'url' : data.link}, 'name, url', function (err, datafind){
        if(datafind == null){
          RssReader.findOne({'user':socket.request.user, 'name' : data.name}, 'name, url', function (err, datanamefind){
            if(datanamefind == null){
              // DEbug
              console.log('Add in database');
              var rssReader = new RssReader({name : data.name, url : data.link, category : data.category, color : data.color});
              rssReader.user = socket.request.user;
              rssReader.save(callback);
            }else{
              callback('Name is already in database');
            }
          });
        }else{
          callback('Link is already in database');
        }
      });
  });


  socket.on('feed/list', function(callback){
    RssReader.count({'user':socket.request.user}, callback);
  });

// List feed by user  Todo change for adpte and seeting

  socket.on('rssreader/list', function(callback){
    RssReader.find({user:socket.request.user}, callback);
  });

  socket.on('rssreader/delete', function(rssreaderp, callback){
    RssReader.findOneAndRemove({_id:rssreaderp._id, user:socket.request.user}, callback);
  });

  socket.on('feed/read', function(callback){
    RssReader.find({user:socket.request.user}, function(err ,feedLists){
      if(err){
        callback('Pas de lien sur la base de donnée');
      }
      var test = requestFeed(feedLists);
      callback(test);
    });
  });


  function requestFeed(feedLists){
    var feeds = [];
    var i =  0;
    var ConWhile = feedLists.length;
    var feedListsSend = ConWhile -1;
    while( i < feedLists.length){
          var ConWhile = feedLists.length;
    var feedListsSend = ConWhile -1;

      feed(feedLists[i].url, function(err, feed){

        socket.emit('get/feeds', feed,function(err, feeds){

        });
      });
      i++ ;

    }      


  }
}