var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  search: function(id) {
     return this.items.find(function(item) {
         return item.id === id;
     });
  },
  delete: function(id) {
      var index = this.items.findIndex(function(item) {
         return item.id === id; 
      });
     return this.items.splice(index, 1);
  },
  modify: function(id, name) {
      var itemToModify = this.items.find(function(item) {
          return item.id === id;
      });
      
      itemToModify.name = name;
      
      return itemToModify;
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.get('/items/:id', jsonParser, function(request, response) {
    response.json(storage.search(+request.params.id));
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(request, response) {
    if (!(request.params.id)) {
        return response.sendStatus(404);
    }
    else {
    response.status(200).json(storage.delete(+request.params.id));
    }
});
  
app.put('/items/:id', jsonParser, function(request, response) {
    
    var name = request.body.name;
    var id = +request.body.id;
    
    response.status(200).json(storage.modify(id, name));
    
});

app.listen(process.env.PORT || 8080, process.env.IP);