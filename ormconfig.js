module.exports = {
    type: 'sqlite',
    database: 'path/to/database.sqlite',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
};