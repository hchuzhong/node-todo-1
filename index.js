const db = require('./db.js');
const inquirer = require('inquirer');

module.exports.add = async (title) => {
    if (title === "") return;
    const list = await db.read();
    list.push({ title, done: false });
    await db.write(list);
}

module.exports.clear = async () => {
    await db.write([]);
}

function done(list, index) {
    list[index].done = true;
    db.write(list);
}

function undone(list, index) {
    list[index].done = false;
    db.write(list);
}

function changeTitle(list, index) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: 'input a new title',
        default: list[index].title
    }).then(answer => {
        list[index].title = answer.title
        db.write(list);
    })
}

function deleteTask(list, index) {
    list.splice(index, 1);
    db.write(list);
}

function askForAction(list, index) {
    const actions = { done, undone, changeTitle, deleteTask };
    inquirer.prompt({
        type: 'list', name: 'action',
        message: 'choose your operation',
        choices: [
            { name: 'quit', value: 'quit' },
            { name: 'done', value: 'done' },
            { name: 'undone', value: 'undone' },
            { name: 'change title', value: 'changeTitle' },
            { name: 'delete task', value: 'deleteTask' }
        ]
    }).then((answer2) => {
        const action = actions[answer2.action];
        action && action(list, index);
    })
}

function askForCreateTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: 'input task title'
    }).then(answer => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list);
    })
}

function printTask(list) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'index',
            message: 'choose which task you want to operate',
            choices: [
                {
                    name: 'exit', value: '-1'
                },
                {
                    name: 'create task', value: '-2'
                }, ...list.map((task, index) => {
                    return { name: `${task.done ? '[√]' : '[X]'} ${index + 1} - ${task.title}`, value: index.toString() }
                })
            ]
        }
    ]).then(answers => {
        const index = parseInt(answers.index);
        if (index >= 0) {
            askForAction(list, index);
        } else if (index === -2) {
            askForCreateTask(list);
        }
    })
}

module.exports.showAll = async () => {
    const list = await db.read();
    printTask(list);
}