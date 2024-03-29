import { Composer, Scenes } from "telegraf";

import { dbService } from "@services";
import { editTaskButtons } from "@buttons";
import { IBotContext } from "@interfaces";
import { taskEdit, taskIdRegex, taskTitleRegex } from "@constants";

const taskIdHandler = new Composer<IBotContext>();
const editTypeHandler = new Composer<IBotContext>();
const resEditTypeHandler = new Composer<IBotContext>();

const enterTaskIdHandler = async (ctx: IBotContext) => {
	await ctx.reply("Enter number of task📀");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

taskIdHandler.hears(taskIdRegex, async ctx => {
	ctx.scene.session.taskId = Number(ctx.message.text);
	const tasks = await dbService.readTasks(ctx.session.chatId);
	if (!tasks?.length) {
		await ctx.reply("List is empty👀");
		return ctx.scene.leave();
	}

	const matchedTask = tasks.find((task: any) => task.id === ctx.scene.session.taskId);
	if (!matchedTask) {
		await ctx.reply("Task is not found🤷🏼");

		return ctx.scene.leave();
	}

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
taskIdHandler.on("text", async ctx => {
	if (!taskIdRegex.test(ctx.message.text)) {
		await ctx.reply("Task number is incorrect❌\nEnter valid task number🔁");
	}
});

const enterEditTypeHandler = async (ctx: IBotContext) => {
	await ctx.reply("Select edit type⬇️", editTaskButtons());

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

editTypeHandler.action(taskEdit.status.action, async ctx => {
	await ctx.editMessageText("Write status in format <b>done/todo</b>⬇️", {
		parse_mode: "HTML",
	});

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});
editTypeHandler.action(taskEdit.title.action, async ctx => {
	await ctx.editMessageText("Enter task title✍🏼");

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
});

resEditTypeHandler.hears(/done|todo/gm, async ctx => {
	await dbService.editTask(ctx.session.chatId, {
		id: ctx.scene.session.taskId,
		editType: "status",
		content: ctx.message.text === "done",
	});
	await ctx.replyWithHTML("Task <b>status</b> is changed✅");
	return ctx.scene.leave();
});
resEditTypeHandler.hears(taskTitleRegex, async ctx => {
	await dbService.editTask(ctx.session.chatId, {
		id: ctx.scene.session.taskId,
		editType: "title",
		content: ctx.message.text,
	});
	await ctx.replyWithHTML("Task <b>title</b> is changed✅");
	return ctx.scene.leave();
});

export const editTask = new Scenes.WizardScene<IBotContext>(
	"editTask",
	enterTaskIdHandler,
	taskIdHandler,
	enterEditTypeHandler,
	editTypeHandler,
	resEditTypeHandler
);
