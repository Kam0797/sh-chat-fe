// this file has nothing to do with this project. this is just a play-around of dexie syntax from its docs

let db = new Dexie("FriendDatabase");
db.version(1).stores({
  friends: `
  id,
  name,
  age`,
});

db.friends.bulkPut([
  {id:1, name: "sh", age: 22},
  {id: 2, name: "man", age: 21},
  {id: 3, name: "mak", age: 30},
  {id: 4, name: "nou", age: 21, notIndexedProperty: 'foo'}
]).then( ()=> {
  return db.friends.where("age").between(0,25).toArray();
}).then(friends => {
  // alert("Found gems: "+ friends.map(friend => friend.name));

  return db.friends
  .orderBy("age")
  .reverse()
  .toArray();
}).then(friends => {
  // alert("friends in reverse: "+ friends.map(friend => `${friend.name} ${friend.age}`));

}).catch(err => {
  alert ("ffffffff", err)
})

