import { guidButtons } from "@buttons";
import { guid } from "@constants/actions";
import { IBotContext } from "@context";
import { Composer, Scenes } from "telegraf";

const guidHandler = new Composer<IBotContext>();

const enterGuidHandler = async (ctx: IBotContext) => {
	await ctx.replyWithMarkdownV2(
		"🤩Don't know where to go?\n*LessTalkBot* is gonna help you🌄",
		guidButtons()
	);

	ctx.wizard.next();
	if (typeof ctx.wizard.step === "function") {
		return ctx.wizard.step(ctx, async () => {});
	}
};

guidHandler.action(guid.attractions.action, ctx => {
	ctx.scene.enter("attractions");
});
guidHandler.action(guid.events.action, ctx => {
	ctx.scene.enter("events");
});
guidHandler.action(guid.food.action, ctx => {
	ctx.scene.enter("food");
});

export const guidance = new Scenes.WizardScene<IBotContext>(
	"guidance",
	enterGuidHandler,
	guidHandler
);
