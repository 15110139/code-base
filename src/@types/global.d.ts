type Writable<T> = {
	-readonly [K in keyof T]: T[K];
};
export type Constructor<T> = Function & { prototype: T }