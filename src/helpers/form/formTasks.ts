import { ITask } from "@interfaces";

const isCompleted = (value: boolean) => (value ? "✅" : "❌");

export const formTasks = (tasks: ITask[]): string => {
	if (!tasks.length) "Your tasks list is empty☁️";

	return `🗒️Here's your current list of tasks\n\n${tasks
		.map(
			(task, idx) =>
				`${idx + 1}. ${task.title} ${isCompleted(task.isCompleted)}\n`
		)
		.join("")}`;
};
