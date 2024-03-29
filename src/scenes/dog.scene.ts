import { Scenes } from "telegraf";

import axios from "axios";

import { IBotContext } from "@interfaces";
import { dogApiUrl } from "@constants";

const requestPicHandler = async (ctx: IBotContext) => {
	await ctx.replyWithHTML("🔎<b>Looking for a random dog picture...</b>🐕");
	try {
		const { data } = await axios.get(dogApiUrl);
		await ctx.replyWithPhoto({ url: data.message });
	} catch (e) {
		return "Oops the image was not found🙁";
	}
	return ctx.scene.leave();
};

export const dog = new Scenes.WizardScene<IBotContext>("dog", requestPicHandler);
