import * as Pino from "pino";
const PinoLevelToSeverityLookup = {
	trace: "DEBUG",
	debug: "DEBUG",
	info: "INFO",
	warn: "WARNING",
	error: "ERROR",
	fatal: "CRITICAL",
};

type LEVEL_LOG = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export const pino = Pino({
	level: "trace",
	formatters: {
		level: (label: string) => {
			return {
				level:
					PinoLevelToSeverityLookup[label as LEVEL_LOG] ||
					PinoLevelToSeverityLookup["info"],
			};
		},
	},
});
export class LoggerService implements LoggerService {
	constructor(private context: string) {
		this.context = context;
	}
	public setTraceId(id: string) {
		return this.setContext(this.context + " - " + id);
	}
	private setContext(text: string) {
		this.context = text;
	}

	public log(message: any): void {
		pino.log(this.context + ": " + message);
	}

	public info(message: any): void {
		pino.info(this.context + ": " + message);
	}

	public error(message: any, trace?: string | undefined): void {
		const stringTrace = trace ? " " + trace : "";
		pino.error(this.context + ": " + message + stringTrace);
	}

	public warn(message: any): void {
		pino.warn(this.context + message);
	}
}
