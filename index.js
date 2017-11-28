const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const mongo = require('mongodb');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

function getDBObjectId(id){
  var resultId = "";
  try{
    resultId = new mongo.ObjectID(id);
  }catch(e){
     console.log(e);
  }
  return resultId;
}

function getDBTransactionQueryResultObject(err, result){
  if ((err != null || result == null) || (typeof result.lastErrorObject != 'undefined' && parseInt(result.lastErrorObject.n) == 0))
     return null;
  else
    return result;  
}

app.get('/', function (request, response) {     
  db.collection('cliente').find().toArray((err, result) => {
    if (err) return console.log(err)    
    response.render(__dirname + '/views/index.ejs', {clientesList: result});
  })
});

app.get('/cadastro-cliente', function (request, response) {
  response.render(__dirname + '/views/create.ejs');
});

app.post('/salvar-cliente', function (request, response) {
  db.collection('cliente').save(request.body, (err, result) => {
    var resultMessage = "Dados salvos com sucesso";
    if (err) resultMessage = "Erro ao salvar os dados";    
    response.render(__dirname + '/views/create.ejs', {message: resultMessage})
  });
});

app.get('/buscar-cliente/:id', function (request, response) {
  var responseObject = {};
  var objectId = getDBObjectId(request.params.id);
  db.collection('cliente').findOne({_id:objectId},(err, result) => {
    var dbResult = getDBTransactionQueryResultObject(err,result);
    if (dbResult == null) 
      responseObject['message'] = "Não foi possível localizar o cliente.";
    else
      responseObject['clienteData'] = dbResult;      
    response.render(__dirname + '/views/create.ejs', responseObject);
  })
});

app.delete('/deletar-cliente', function (request, response) {
  var objectId = getDBObjectId(request.body._id);
  var responseStatus = 200;
  db.collection('cliente').findOneAndDelete({_id: objectId}, 
  (err, result) => {
    var responseObject = getDBTransactionQueryResultObject(err,result);
    if(responseObject == null) responseStatus = 500;
    return response.status(responseStatus).send(responseObject);
  });
});

app.put('/atualizar-cliente', (request, response) => {   
   var objectId = getDBObjectId(request.body._id);
   var responseStatus = 200;
    db.collection('cliente').findOneAndUpdate({_id: objectId}, {
      $set: {
        name: request.body.name,
        idade: request.body.idade,
        cpf: request.body.cpf
      }
    }, {
      sort: {_id: -1},
      upsert: false
    }, (err, result) => {
      var responseObject = getDBTransactionQueryResultObject(err,result);
      if(responseObject == null) responseStatus = 500;
      return response.status(responseStatus).send(responseObject);
    }); 
});

const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb://127.0.0.1:27017/mydb', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});