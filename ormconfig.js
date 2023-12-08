ORMConfig = {
    type: 'sqlite',
    database: 'db/database.sqlite',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
};

module.exports = ORMConfig;