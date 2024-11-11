var db = connect("localhost:27017/myDatabase");

var album = db.albums.findOne({ name: "Thriller", artist: "Michael Jackson" });

var album_songs = db.songs.find({ _id: { $in: album.songs }}, { name: 1 }).toArray();
