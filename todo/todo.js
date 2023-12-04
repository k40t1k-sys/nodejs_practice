#!/usr/bin/env node
import chalk from 'chalk';
import * as rl from 'readline/promises';
import { JSONPreset } from 'lowdb/node';

const db = await JSONPreset(('db.json'), { todos: []});

const args = process.argv;

async function prompt() {
    const r = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    const answer = await r.question(chalk.greenBright('Type in your todo\n'));
    r.close();

    return answer;
}

function newTodo() {
    prompt().then(todo => {
        db.data.todos.push({
            title: todo,
            complete: false
        });
        db.write();
    });
}

function getTodos() {
    const todos = db.data.todos;
    let index = 1;

    todos.forEach(todo => {
        var text = `${index++}. ${todo.title}`;
        if(todo.complete) {
            text = chalk.strikethrough(text);
        }
        console.log(text);
    });

}

function completeTodo() {
    // check that length
    if (args.length != 4) {
      errorLog("invalid number of arguments passed for complete command")
      return
    }
  
    let n = Number(args[3])
    // check if the value is a number
    if (isNaN(n)) {
      errorLog("please provide a valid number for complete command")
      return
    }
  
    // check if correct length of values has been passed
    let todosLength = db.data.todos.length;
    if (n > todosLength) {
      errorLog("invalid number passed for complete command.")
      return
    }
  
    // update the todo item marked as complete
    db.data.todos[n-1].complete = true;
    db.write()
}

if(args.length > 3 && args[2] != 'cmplt') {
    errorLog('only one argument can be accepted.');
    usage();
}

const commands = ['new', 'get', 'cmplt', 'help'];

switch(args[2]) {
    case 'help':
        usage();
        break;
    case 'new':
        newTodo();
        break;
    case 'get':
        getTodos();
        break;
    case 'cmplt':
        completeTodo();
        break;
    default:
        errorLog('invalid command passed');
        usage();
}

function errorLog(error) {
    const eLog = chalk.red(error);
    console.log(eLog);
}

const usage = () => {
    const usageText = `
    todo helps you manage your todo tasks.

    usage:
        todo <command>

        commands can be:

        new:        used to create a new todo
        get:        used to retrieve your todos
        cmplt <task_no>:   used to mark a todo as complete
        help:       used to print the usage guide
    `

    console.log(usageText);
}