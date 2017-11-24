// const mongo = require('mongodb');
// const Grid = require('gridfs');

// const db = new mongo.Db('mydb', new mongo.Server("127.0.0.1", 27017));


function Storage(){
    
    // this.store = store
    
    // function store(audio){
    //     mongo.MongoClient.connect('tdpidb',function(err,db){
    //         const gfs = Grid(db, mongo)
    //         gfs.writeFile({filename: 'audio.wav'}, contents, function (err, file) {
    //         console.log('wrote "%s" to GridFS file %s', contents, file._id);
    //         gfs.toFile({_id: file._id}, target, function (err) {
    //             var fileContents = fs.readFileSync('./out.txt').toString();
    //             console.log('wrote file %s to %s: %s', file._id, target, fileContents);
    //         });
    //         });
    //     })
    //     db.open(function())
    // }
}


module.exports = new Storage()




// create or use an existing mongodb-native db instance.
// for this example we'll just create one:

// make sure the db instance is open before passing into `Grid`
db.open(function(err) {
    if (err)
        return handleError(err);


var writestream = gfs.createWriteStream({
    mode: 'w',
    filename: 'dummy_video',  //        files.contentType  (Optional. A valid MIME type for the document.)
    content_type: 'video/mp4' //          files.filename (Optional. A human-readable name for the document.)
});    


    var vidoBase64 = 'data:video/mp4;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAFpg2qXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MERENjc3QTVBNzlCMTFFNDlBM0JEN0VDQUUyNEIzODgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MERENjc3QTZBNzlCMTFFNDlBM0JEN0VDQUUyNEIzODgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowREQ2NzdBM0E3OUIxMUU0OUEzQkQ3RUNBRTI0QjM4OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowREQ2NzdBNEE3OUIxMUU0OUEzQkQ3RUNBRTI0QjM4OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pikq+moAAASaSURBVHjaYvz//z8DEGQwoIIZDECJjP+oACT2nwVJFSOUBhvBBOVIoxkFl3gGVfkfppMRatxvdB0AAQSSMAXSxshijP+hbkUWZEJzTRfIfGSVjOiuYERyBVwQ2dz/AAEE8qb2fyIByARbBvyAEeYOZNfyoUkyIrmNAV3xZyh9GsWdSIAF2atobAw+QAAx4oh0dPAGiNewoFuFDzARkOeAOqWQGMWKUNoC5kEGPJ76j80ZjDhCoxWI/wBxDjHOcIXazoyueD6ataDUaoZsG7Kbk4DYDk2DF3oMIgMVHM75hayYmIjZCxBAsOgG5T9JBuoBVVBgZFJgqAVa0t8JFb/NREqawwIuoPF3EJs+YSAZyVXyQHwDKv4DqfAA4X5cBi8A4lVIfE+oYfOQxB4BsSZU/AdU7DUQr0DxAVo5DOJ7ofHxYXS9ecgFFzrYhsR+hyd4hIB4OpQ9GV2SBU8pCAozQaTIfQvEd4DYHE1tMBCvI6VwgUWWOjS2haCG/gTiUiT5dVg1A4MDZOMaKH8jliRECqhHjjwQ1vlPPbALZCZAADEiVYUhQCxKYYY5C6tbWKAlz20qlhPPgVgKW+1NDaDDRIHm31jqXxiwo8Tgi3jk/jMx0AhQYrAmpQaDSjNlpHCMgopzoxWZ/0kxeD60/L2HJLYcS4WO18WghL0SiJ9A+X+h1TEuYILEXgt1BANyloaBCGj2fgPlTyGiPIYBSTR+BhOWIlQYKQcRC9yIiby/UDqGBIPPEGNwE5TWgEYcLvAQiX2VFINB4AEQO2JRsx+I5aDsraSkYyck9j5oGj0FxC+hbAckeR9SDAa5yApNDNSxEUPiv8CXnvFlkONQjQVA/A3NB/qEmmXItfRPHGomQjEpgBHZYFALqJGCQskMif0KVIPsATKcqVxqsoLC2AWId1PRUF1QDwMgwJDzvQ606h5sYBfUbQywZgULtAVF7WCmNtgLxB7oLTd6gltAPBParYIl+n9AzAVyGLQNiw5CWNAyP73AJWiZgAvMAeI8LNldjNKuGLngD3S0gNgyjPatKyLALyLam0T5ghIA6lM9hvarQPW8KhDLYEl2RkB8FIg7oA0M5ME8kJsCgbgEewsWc2iQVLAQiCWIaC4JQJtVlIAMSpLETSDmB+J4aE1NCHyADiuxQJsQVG3IB6H1VQ5haaKBWl6fyLDzL7THvAdLACDbmUqKg7nR0psdmvxaKqT3lWh80BCAOxKfi5pdJRUqOFiTwFAm2V2wy1jSHGgkK5ECx4Kau/loYveB+DA1HPwb6sC/aOKgUbKDQMxGomNBozubYUO1SACUeb9Sq/d8Bdq1eYsmbgdtScPGBUEhp4QkLwdNl61I44iBaGZ8hyaPw8Q4hJSK4ykQiwBxLDR00fUWQDEpIA/b6B+1xycWg1ro0M5MDxB/JEHvT+gwpRI0g00m1XJcIfyPCL0voCOPpUhiEtDhTxloYDyFjrO+INJMgm5gwVGUgNqjy8gI/RdQfJ0KxZ4LtmIP1IDXhmaqoQDAw41Xoa2q54PYoc+hbrzKiGXc1RRahIkwoM050gnA7HwDHQlCntZkAAD2FHBZPcvq3AAAAABJRU5ErkJggg==';//The base64 has a Video
// if you are getting this byte string into chunks you need to man


var byte_string = vidoBase64.substr(23);//The base64 has a imageURL
var buffer = new Buffer(byte_string);   //new Buffer(b64string, 'base64');  you can use base64 encoding with creating new buffer string
var response = streamifier.createReadStream(buffer).pipe(writestream);  // returns response which is having all information regarding saved byte string
var lastInsertedFileId = response._store.fileId;  // now you can store it into another document for future use.
console.log(lastInsertedFileId);   // this is _id saved in mydb.fs.files
     //Now you can check mydb.fs.files and mydb.fs.chunks document.




});