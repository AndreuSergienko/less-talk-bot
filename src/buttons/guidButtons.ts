import { guid } from "@constants/actions";
import { Markup } from "telegraf";

export const guidButtons = () =>
	Markup.inlineKeyboard(
		[
			Markup.button.callback(guid.food.text, guid.food.action),
			Markup.button.callback(guid.attractions.text, guid.attractions.action),
			Markup.button.callback(guid.events.text, guid.events.action),
		],
		{
			columns: 2,
		}
	);
