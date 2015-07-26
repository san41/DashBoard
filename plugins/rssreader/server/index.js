var RssReader = require('./models/rssreader.js');
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

// List feed by user  Todo change for adpte 

  socket.on('rssreader/list', function(callback){
    RssReader.find({user:socket.request.user}, callback);
    console.log('ok')
  });

  socket.on('rssreader/delete', function(rssreaderp, callback){
    RssReader.findOneAndRemove({_id:rssreaderp._id, user:socket.request.user}, callback);
  });



}