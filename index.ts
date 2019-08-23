/// <reference types="@vertx/core/runtime" />
// @ts-check
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
    pgPool.preparedQuery('SELECT id from world where id=$1', Tuple.of(1), ar => {
        if (ar.succeeded()) {
            const row = ar
                .result()
                .iterator()
                .next();
            ctx.response().end(
                JSON.stringify({
                    id: row.getInteger('id')
                })
            );
        } else {
            ctx.response().end(
                JSON.stringify({
                    error: ar.cause().message
                })
            );
        }
    });
});

vertx
    .createHttpServer()
    .requestHandler(app)
    .listen(8080);

console.log('Server listening at: http://localhost:8080/');
