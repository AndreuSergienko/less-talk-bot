import { Scenes } from "telegraf";

import { IBotContext } from "@interfaces";
import { catApiUrl } from "@constants";

const requestPicHandler = async (ctx: IBotContext) => {
	await ctx.replyWithHTML("🔎<b>Looking for a random cat picture...</b>🐈");
	try {
		await ctx.replyWithPhoto({ url: catApiUrl });
	} catch (e) {
		return "Oops the image was not found🙁";
	}
	return ctx.scene.leave();
};

export const cat = new Scenes.WizardScene<IBotContext>("cat", requestPicHandler);
