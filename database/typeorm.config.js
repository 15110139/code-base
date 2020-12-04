module.exports = [
	{
		type: "postgres",
		host: process.env.DB_HOST,
		port: process.env.DB_POST,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		synchronize: false,
		dropSchema: false,
		logging: true,
		entities: ["database/entities/**/*.entity{.ts,.js}"],
		migrations: ["database/migrations/**/*.ts"],
		cli: {
			migrationsDir: "database/migrations",
		},
	},
];
