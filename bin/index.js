#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs");
const path = require("path");
const { all } = require("axios");
const { allowedNodeEnvironmentFlags } = require("process");

const filePath = path.join(__dirname, "tasks.json");
allTasks = [];
id = 34;

const argv = yargs(hideBin(process.argv))
  .command(
    "add <task>",
    "Add a new task",
    (yargs) => {
      return yargs.positional("task", {
        describe: "Task description",
        type: "string",
      });
    },
    async (argv) => {
      const curr = new Date();
      const newTask = {
        id: id + 1,
        description: argv.task,
        status: "todo",
        createdAt: curr,
        upadtedAt: curr,
      };

      //   const jsonData = JSON.stringify(data, null, 2);

      if (fs.existsSync(filePath)) {
        let data;
        try {
          data = fs.readFileSync(filePath, "utf8");
          console.log(data);
        } catch (err) {
          console.error(err);
        }
        let fileData = {};
        if (data) {
          try {
            fileData = JSON.parse(data);
          } catch (err) {
            console.log("parse error: " + err);
            return;
          }
        }

        fileData["tasks"].push(newTask);
     
        const updatedData = JSON.stringify(fileData, null, 2);
      
        await fs.writeFile(filePath, updatedData, (err) => {
          if (err) {
            console.error(
              "An error occurred while writing the JSON file:",
              err
            );
            return;
          }
          id += 1;
          console.log(`Adding new task: ${argv.task} , Id: ${id}`);
        });
       
      } else {
        await fs.writeFile(
          filePath,
          JSON.stringify(`{"tasks:[${newTask}]}`),
          (err) => {
            if (err) {
              console.error(
                "An error occurred while writing the JSON file:",
                err
              );
              return;
            }
            id += 1;
            console.log(`Adding new task: ${argv.task} , Id: ${id}`);
          }
        );
      }
    }
  )

  .command(
    "update <task_id> <info>",
    "Update task using its Id",
    (yargs) => {
      return yargs
        .positional("task_id", {
          describe: "Task Id",
          type: "number",
          demandOption: true,
        })
        .positional("info", {
          describe: "Updated task description",
          type: "string",
          demandOption: true,
        });
    },
    (argv) => {
      console.log(`updated task: ${argv.info}`);
    }
  )
  .command(
    "delete <task_id>",
    "Delete task by Id",
    (yargs) => {
      return yargs.positional("task_id", {
        describe: "Task Id",
        type: "number",
        demandOption: true,
      });
    },
    (argv) => {
      console.log(`Task with Id : ${argv.task_id} deleted`);
    }
  )

  .command(
    "mark <task_id> <status>",
    "Mark task with new status",
    (yargs) => {
      return yargs
        .positional("task_id", {
          describe: "Task Id",
          type: "number",
          demandOption: true,
        })
        .positional("status", {
          describe: "Status of the task",
          type: "string",
          choices: ["todo", "in progress", "done"],
          demandOption: true,
        });
    },
    (argv) => {
      console.log(`task marked!`);
    }
  )

  .command(
    "list <status>",
    "List all tasks",
    (yargs) => {
      return yargs.positional("status", {
        describe: "Status of tasks",
        type: "string",
        choices: ["todo", "in progress", "done"],
      });
    },
    (argv) => {
      if (!argv) {
        console.log("Listing all tasks...");
        fs.readFile("tasks.json", function (err, data) {
          if (err) {
            return console.error(err);
          }
          console.log("Asynchronous read: " + data.toString());
        });
      
      } else {
        console.log(`All Tasks with status ${argv.status}`);
      }
    }
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;
