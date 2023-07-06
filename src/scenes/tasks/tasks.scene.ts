import { Composer, Scenes } from "telegraf";

import { IBotContext } from "@interfaces";
import { tasks as taskActions } from "@constants";

const taskHandler = new Composer<IBotContext>();

taskHandler.hears(taskActions.read.action, ctx => {
	ctx.scene.enter("readTasks");
});

taskHandler.hears(taskActions.create.action, ctx => ctx.scene.enter("createTask"));

taskHandler.hears(taskActions.edit.action, ctx => {
	ctx.scene.enter("editTask");
});

taskHandler.hears(taskActions.remove.action, ctx => {
	ctx.scene.enter("removeTask");
});

export const tasks = new Scenes.WizardScene<IBotContext>("tasks", taskHandler);
