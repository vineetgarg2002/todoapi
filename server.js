var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var PORT =  process.env.PORT || 3000;
var nextTodoId = 1;
var todos = [];
var _= require('underscore');

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
	var matched = _.findWhere(todos, {id:todoid});
	if(matched)
	{
		res.json(matched);
	}
	else
	{
		res.status(404).send();
	}
});

// post request
app.post('/todos', function(req,res)
{
	var body = req.body;
	body = _.pick(req.body,'description','completed');

	console.log(body);

	if(!_.isBoolean(body.completed) || !_.isString(body.description) 
		|| body.description.trim().length === 0) 
	{
		res.status(404).send();
	}
	else
	{
		body.id = nextTodoId++;
		body.description = body.description.trim();
		todos.push(body);
		console.log('desc ' + body.description);
		res.json(body);
	}
});
