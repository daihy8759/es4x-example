/// <reference types="es4x" />
import { PgPool } from '@vertx/pg-client';
import { PgConnectOptions } from '@vertx/pg-client/options';
import { Tuple } from '@vertx/sql-client';
import { PoolOptions } from '@vertx/sql-client/options';
import { Router } from '@vertx/web';

const app = Router.router(vertx);
const pgPool = PgPool.pool(
    vertx,
    new PgConnectOptions()
        .setCachePreparedStatements(true)
        .setHost('localhost')
        .setUser('postgres')
        .setPassword('postgres')
        .setDatabase('techempower-test'),
    new PoolOptions().setMaxSize(200)
);

app.route('/').handler(async ctx => {
    const rowSet = await pgPool.preparedQuery('SELECT id from world where id=$1')
        .executeBatch(Tuple.of(1));
    if (rowSet.rowCount() === 0){
        await ctx.response().end(  JSON.stringify({
            success: false,
            message: "data not found!"
        }));
        return;
    }
    await ctx.response().end(
        JSON.stringify({
            id: rowSet.iterator().next().getInteger('id')
        })
    );
});

vertx
    .createHttpServer()
    .requestHandler(app)
    .listen(8080)
    .then(()=> {
        console.log('Server listening at: http://localhost:8080/');
    });

