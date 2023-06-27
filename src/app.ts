import {
	CatCommand,
	Command,
	DogCommand,
	HelpCommand,
	StartCommand,
	WeatherCommand,
} from "@commands";
import { ConfigService, IConfigService } from "@config";
import { tasks as taskActions, unsub } from "@constants/actions";
import { IBotContext } from "@context";
import {
	cat,
	createTask,
	dog,
	editTask,
	readTasks,
	removeTask,
	tasks,
	unsubscribe,
	weather,
} from "@scenes";
import { dbService } from "@services";
import { Scenes, Telegraf } from "telegraf";
import LocalSession from "telegraf-session-local";

class Bot {
	bot: Telegraf<IBotContext>;
	commands: Command[] = [];
	stage = new Scenes.Stage<IBotContext>(
		[
			weather,
			cat,
			dog,
			tasks,
			createTask,
			readTasks,
			editTask,
			removeTask,
			unsubscribe,
		],
		{ ttl: 120 }
	);

	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<IBotContext>(this.configService.get("BOT_TOKEN"));
		this.bot.use(
			new LocalSession<IBotContext>({
				database: "sessions.json",
			}).middleware()
		);
		this.bot.use(this.stage.middleware());
	}

	init() {
		this.commands = [
			new StartCommand(this.bot),
			new HelpCommand(this.bot),
			new WeatherCommand(this.bot),
			new CatCommand(this.bot),
			new DogCommand(this.bot),
		];
		for (const command of this.commands) {
			command.handle();
		}
		this.bot.launch();
	}

	initTasksListener() {
		const regex = new RegExp(
			`${taskActions.create.action}|${taskActions.edit.action}|${taskActions.read.action}|${taskActions.remove.action}`
		);
		this.bot.hears(regex, ctx => ctx.scene.enter("tasks"));
	}

	initUnsubListener() {
		this.bot.action(unsub.action, ctx => {
			ctx.scene.enter("unsubscribe");
		});
	}
}

const bot = new Bot(new ConfigService());

(async () => {
	await dbService.connectToDB();
	bot.init();
	bot.initTasksListener();
	bot.initUnsubListener();
})();
