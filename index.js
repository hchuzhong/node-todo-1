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

module.exports.showAll = async () => {
    const list = await db.read();
    inquirer
        .prompt([
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
        ])
        .then(answers => {
            const index = parseInt(answers.index);
            if (index >= 0) {
                // choose a task
                inquirer.prompt({
                    type: 'list', name: 'action',
                    message: 'choose your operation',
                    choices: [
                        { name: 'quit', value: 'quit' },
                        { name: 'done', value: 'done' },
                        { name: 'undone', value: 'undone' },
                        { name: 'change title', value: 'changeTitle' },
                        { name: 'delete', value: 'delete' }
                    ]
                }).then((answer2) => {
                    switch (answer2.action) {
                        case 'done':
                            list[index].done = true;
                            db.write(list);
                            break;
                        case 'undone':
                            list[index].done = false;
                            db.write(list);
                            break;
                        case 'changeTitle':
                            inquirer.prompt({
                                type: 'input',
                                name: 'title',
                                message: 'input a new title',
                                default: list[index].title
                            }).then(answer => {
                                list[index].title = answer.title
                                db.write(list);
                            })
                            break;
                        case 'delete':
                            list.splice(index, 1);
                            db.write(list);
                            break;
                    }
                })
            } else if (index === -2) {
                // create task
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
        })
}