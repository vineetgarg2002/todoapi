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
	//var query = req.query;
	var filteredTodos = todos;
	if(req.query.hasOwnProperty('completed'))
	{
		if(req.query.completed === 'true')
		{
			filteredTodos = _.where(filteredTodos, {completed:true});	
		}
		else if(req.query.completed === 'false')
		{
			filteredTodos = _.where(filteredTodos, {completed:false});
		}
		else
		{
			return res.json({});
		}

	}
	if(req.query.hasOwnProperty('q') && req.query.q.length > 0)
	{
		filteredTodos = _.filter(filteredTodos, function(obj)
		{
			return obj.description.indexOf(req.query.q) > -1;
		});
	}

	res.json(filteredTodos);
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

// delete todo item

app.delete('/todos/:id',function(req,res){
	var todoid = parseInt(req.params.id,10);
	var matched = _.findWhere(todos,{id:todoid});
	if(matched)
	{
		todos = _.without(todos,matched);
		res.json({"success" : "Deleted...." + JSON.stringify(matched)});

	}
	else
	{
		res.status(404).json({"error" : "no data found with id " + todoid});
	}

})

// update 

app.put('/todos/:id', function(req,res)
{
	var todoid = parseInt(req.params.id);
	var matched = _.findWhere(todos, {id : todoid});
	if(!matched)
	{
		return res.status(404).json({"error": "requested id not found"});
	}

	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed))
	{
		validAttributes.completed = body.completed;
	}
	else if(body.hasOwnProperty('completed'))
	{
		return res.status(404).send();
	}
	
	if(body.hasOwnProperty('description') && _.isString(body.description)  && body.description.trim().length > 0)
	{
		validAttributes.description = body.description;
	}
	else if(body.hasOwnProperty('description'))
	{
		return res.status(404).send();
	}
	
	_.extend(matched,validAttributes);

	res.json(matched);
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
