var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var PORT =  process.env.PORT || 3000;
var nextTodoId = 1;
var todos = [];

app.use(bodyParser.json());

// var todos = [{
// 	id: 1,
// 	desc: 'meet mom for lunch',
// 	completed: false
// },
// {
// 	id:2,
// 	desc: 'goto market',
// 	completed: false
// },
// {
// 	id:3,
// 	desc: "do nodejs rest apis",
// 	completed: true
// }];



app.get('/', function(req,res)
{
	res.send('TODO api root');
});

app.listen(PORT,function()
{
	console.log("Listening at port numner: " + PORT);
});

//get request
app.get('/todos',function(req,res)
{
	res.json(todos);
});

app.get('/todos/:id',function(req,res)
{
	var todoid;
	 todoid = parseInt(req.params.id,10);
	console.log(todoid + ' ' + todos.length);
	for (var i = 0; i < todos.length; i++) {
		if(todos[i].id === todoid)
		{
		 	
		 	res.json(todos[i]);
		 	break;
		}
	}
	res.status(404).send();
});

// post request
app.post('/todos', function(req,res)
{
	var body = req.body;
	body.id = nextTodoId++;
	todos.push(body);
	console.log('desc ' + body.description);
	res.json(body);
});
