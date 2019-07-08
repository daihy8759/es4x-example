/// <reference types="@vertx/core/runtime" />
// @ts-check
import { Router } from '@vertx/web';

const app = Router.router(vertx);

app.route('/').handler(function(ctx) {
    ctx.response().end('Hello from Vert.x Web!');
});
