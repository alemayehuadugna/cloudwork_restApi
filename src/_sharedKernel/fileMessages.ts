import { messageSource } from "@/_lib/message/MessageBundle";

type FileMessages = {
	file: {
		error: {
			noFileOrDir: { path: string };
			writeError: { path: string }
		}
		created: { path: string };
	}
}

const fileMessages = messageSource<FileMessages>({
	file: {
		error: {
			noFileOrDir: "#({{path}}) no such file or directory",
			writeError: "#({{path}}) cannot save file."
		},
		created: "#({{path}}) has been saved."
	}
});

export { fileMessages };
export type { FileMessages };