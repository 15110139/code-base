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
	private context!: string;
	private traceId!: string;
	public setTraceId(traceId: string): void {
		this.traceId = traceId;
	}
	public setContext(text: string): LoggerService {
		this.context = text;
		return this;
	}

	public debug(message: string): void {
		pino.debug(this.traceId + ": " + this.context + ": " + message);
	}

	public info(message: any): void {
		pino.info(this.traceId + ": " + this.context + ": " + message);
	}

	public error(message: string, trace?: string | undefined): void {
		const stringTrace = trace ? " " + trace : "";
		pino.error(
			this.traceId + ": " + this.context + ": " + message + stringTrace,
		);
	}

	public warn(message: any): void {
		pino.warn(this.traceId + ": " + this.context + message);
	}

	public log(message: any): void {
		pino.info(this.traceId + ": " + this.context + ": " + message);
	}
}
