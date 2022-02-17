'use strict';

var Renderer = (function() {
    var privateVar = '';

    function privateMethod () {
    // ...
    }

    return {
        renderMap: function(map) {
            for (var i = 0; i< map.chunks.length; i++) {
                Renderer.renderChunk(map.chunks[i]);
            }
            for (var i = 0; i< map.flaggedAstrobjects.length; i++) {
                Renderer.renderFlagHint(map.flaggedAstrobjects[i]);
            }
        },
        renderChunk: function(chunk) {
            for (var i = 0; i < chunk.allAstrobjects.length; i++) {
                Renderer.renderAstrobject(chunk.allAstrobjects[i]);
            }
        },
        renderViewportBorders: function() {
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(canvas.width, 0);
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.lineTo(0,0);
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.closePath();
        },
        renderShip: function(ship)  {

            // //particles
            // ctx.shadowColor = 'yellow';
            // ctx.shadowBlur = 10;
            // ctx.fillStyle = "#83E8EB";
            // ctx.globalAlpha = 1;

            // for (let i = 0; i < ship.history.length; i++) {
            //     if (i < 10 && i > 5) {
            //         ctx.beginPath();
            //         ctx.arc(ship.history[i].x, ship.history[i].y, 0.25*i, 0, Math.PI*2);
            //         ctx.fill();
            //         ctx.closePath();
            //     }
            // }
            // ctx.globalAlpha = 1;
            // ctx.shadowColor = "transparent";
            // ctx.shadowBlur = 0;

            if(ship.engines[0].speed > 0) {
                ctx.beginPath();
                ctx.moveTo(Math.cos(ship.engines[0].angle - Math.PI) * 4 + ship.x, Math.sin(ship.engines[0].angle - Math.PI) + ship.y);
                ctx.lineTo(Math.cos(ship.engines[0].angle - Math.PI) * (4 +  ship.engines[0].speed / 15) + ship.x, Math.sin(ship.engines[0].angle - Math.PI) * (4 +  ship.engines[0].speed / 15) + ship.y);
                ctx.lineTo(Math.cos(ship.engines[0].angle - Math.PI) + ship.x, Math.sin(ship.engines[0].angle - Math.PI) * 4 + ship.y);
                ctx.lineTo(ship.x, ship.y);
                ctx.closePath();
                ctx.fillStyle = "orange";
                ctx.fill();
            }
            ctx.restore();

            //hull
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = "#eeeeee";
            ctx.fill();

            //energyContainer
            ctx.beginPath();
            ctx.rect(ship.x + 15, ship.y + 16, 0.5, 1);
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            ctx.closePath();

            //energyAmount
            ctx.beginPath();
            ctx.rect(ship.x - 15, ship.y + 15, (ship.storages[0].amount / ship.storages[0].capacity) * 30, 3);
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = "#FFA500";
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.closePath();

            //energyContainer
            ctx.beginPath();
            ctx.rect(ship.x + 15, ship.y + 21, 0.5, 1);
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            ctx.closePath();

            //energyAmount
            ctx.beginPath();
            ctx.rect(ship.x - 15, ship.y + 20, (ship.storages[2].amount / ship.storages[2].capacity) * 10, 3);
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = "#FFA500";
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.closePath();

            //shield
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r + 5, 0, Math.PI*1.5);
            ctx.strokeStyle = '#05C7F2';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1;
        },
        renderResource: function(planet, resource) {
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.resourceRanges[resource.depth] + 5, resource.angleStart, resource.angleEnd);
            ctx.strokeStyle = resource.color;
            ctx.lineWidth = 10;
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
        },
        renderFlagHint: function(astrobject) {
            var lines = [
                {
                    p1:{x:0,y:0},
                    p2:{x:0, y:canvas.height}
                },
                {
                    p1:{x:canvas.width, y:canvas.height},
                    p2:{x:0, y:canvas.height}
                },
                {
                    p1:{x:canvas.width, y:canvas.height},
                    p2:{x:canvas.width, y:0}
                },
                {
                    p1:{x:0, y:0},
                    p2:{x:canvas.width, y:0}
                }
            ];

            for (var i = 0; i < lines.length; i++) {
                var intersection = checkLineIntersection(
                    lines[i].p1.x, lines[i].p1.y,
                    lines[i].p2.x, lines[i].p2.y,
                    astrobject.x - app.viewport.x, astrobject.y - app.viewport.y,
                    app.ship.x - app.viewport.x, app.ship.y - app.viewport.y
                    );

                if (intersection && intersection.onLine1 && intersection.onLine2) {
                   ctx.beginPath();
                   ctx.arc(intersection.x + app.viewport.x, intersection.y + app.viewport.y, 10, 0, Math.PI*2);
                   ctx.fillStyle = 'magenta';
                   ctx.fill();
                   ctx.closePath();
                }
            }

        },
        renderAstrobject: function (obj, backgroundStar, timeDelta) {

            if (backgroundStar || app.viewport.isInside(obj.x, obj.y)) {

                if (backgroundStar === 1 && app.ship.engines[0].speed > 0) {
                    obj.x -= app.ship.engines[0].speed * Math.cos(app.ship.engines[0].angle) * timeDelta * 0.1;
                    obj.y -= app.ship.engines[0].speed * Math.sin(app.ship.engines[0].angle) * timeDelta * 0.1
                }
                if (backgroundStar === 2 && app.ship.engines[0].speed > 0) {
                    obj.x -= app.ship.engines[0].speed * Math.cos(app.ship.engines[0].angle) * timeDelta * 0.05;
                    obj.y -= app.ship.engines[0].speed * Math.sin(app.ship.engines[0].angle) * timeDelta * 0.05;
                }
                if (backgroundStar === 3 && app.ship.engines[0].speed > 0 && timeDelta) {
                    obj.x -= app.ship.engines[0].speed * Math.cos(app.ship.engines[0].angle) * timeDelta * 0.01;
                    obj.y -= app.ship.engines[0].speed * Math.sin(app.ship.engines[0].angle) * timeDelta * 0.01;
                }

                switch(obj.name) {

                    case 'Astrobject':
                    case 'Asteroid':
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();
                        break;

                    case 'Star':
                        ctx.shadowColor = obj.color;
                        ctx.shadowBlur = obj.range/2;

                        // hull
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();

                        ctx.shadowColor = "transparent";
                        ctx.shadowBlur = 0;

                        //draw range line
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.range, 0, Math.PI*2);
                        ctx.globalAlpha = 0.03;
                        ctx.strokeStyle = obj.color;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                        break;

                    case 'Planet':
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();

                        if (obj.hasBelt) {
                            ctx.globalAlpha = 0.3;
                            ctx.beginPath();
                            ctx.arc(obj.x, obj.y, obj.beltRadius, 0, Math.PI*2);
                            ctx.strokeStyle = obj.beltColor;
                            ctx.lineWidth = obj.beltWidth;
                            ctx.stroke();
                            ctx.closePath();
                            ctx.lineWidth = 1;
                            ctx.globalAlpha = 1;
                        }

                        if (obj.resourceRanges instanceof Array) {
                            for (let i = 0; i < obj.resourceRanges.length; i++) {
                                ctx.beginPath();
                                ctx.arc(obj.x, obj.y, obj.resourceRanges[i], 0, Math.PI*2);
                                ctx.globalAlpha = 1;
                                ctx.strokeStyle = 'gray';
                                ctx.lineWidth = 1;
                                ctx.stroke();
                                ctx.closePath();
                                ctx.globalAlpha = 1;
                            }
                        }

                        if (obj.resources instanceof Array) {
                            for (let i = 0; i < obj.resources.length; i++) {
                                Renderer.renderResource(obj,obj.resources[i]);
                            }
                        }

                        break;

                    case 'Nebula':

                        var innerRadius, outerRadius, gradient;

                        switch (obj.nebulaType) {
                            case 'emission':
                                ctx.beginPath();
                                innerRadius = obj.r/4;
                                outerRadius = obj.r;
                                // Radius of the entire circle.
                                ctx.globalAlpha = 0.2;

                                gradient = ctx.createRadialGradient(obj.x, obj.y, innerRadius, obj.x, obj.y, outerRadius);
                                gradient.addColorStop(0, 'purple');
                                gradient.addColorStop(0.3, 'blue');
                                gradient.addColorStop(0.4, 'green');
                                gradient.addColorStop(0.5, 'orange');
                                gradient.addColorStop(0.8, '#652323');
                                gradient.addColorStop(1, '#000000');

                                ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);

                                ctx.fillStyle = gradient;
                                ctx.fill();
                                ctx.closePath();
                                ctx.globalAlpha = 1;
                                break;

                            case 'reflection':
                                ctx.beginPath();
                                innerRadius = obj.r/3;
                                outerRadius = obj.r;
                                // Radius of the entire circle.
                                ctx.globalAlpha = 0.3;

                                gradient = ctx.createRadialGradient(obj.x, obj.y, innerRadius, obj.x, obj.y, outerRadius);
                                gradient.addColorStop(0, '#51FFD6');
                                gradient.addColorStop(1, 'white');

                                ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);

                                ctx.fillStyle = gradient;
                                ctx.fill();
                                ctx.closePath();
                                ctx.globalAlpha = 1;
                                break;

                            case 'dark':
                                ctx.beginPath();
                                innerRadius = obj.r/3;
                                outerRadius = obj.r;
                                // Radius of the entire circle.
                                ctx.globalAlpha = 0.3;

                                gradient = ctx.createRadialGradient(obj.x, obj.y, innerRadius, obj.x, obj.y, outerRadius);
                                gradient.addColorStop(0, '#582335');
                                gradient.addColorStop(0.3, '#6F274C');
                                gradient.addColorStop(0.6, '#652323');
                                gradient.addColorStop(1, '#000000');

                                ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);

                                ctx.fillStyle = gradient;
                                ctx.fill();
                                ctx.closePath();
                                ctx.globalAlpha = 1;
                                break;

                            case 'supernova':
                                ctx.beginPath();
                                innerRadius = obj.r/4;
                                outerRadius = obj.r/2;
                                // Radius of the entire circle.
                                ctx.globalAlpha = 0.3;

                                gradient = ctx.createRadialGradient(obj.x, obj.y, innerRadius, obj.x, obj.y, outerRadius);
                                gradient.addColorStop(0, 'white');
                                gradient.addColorStop(0.3, 'purple');
                                gradient.addColorStop(0.6, 'white');
                                gradient.addColorStop(1, 'purple');

                                ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);

                                ctx.fillStyle = gradient;
                                ctx.fill();
                                ctx.closePath();
                                ctx.globalAlpha = 1;
                                break;
                            }
                        break;

                    case 'Wormhole':
                        ctx.shadowColor = obj.color;
                        ctx.shadowBlur = obj.range;
                        ctx.globalAlpha = 1;

                        // hull
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();

                        ctx.shadowColor = "transparent";
                        ctx.shadowBlur = 0;
                        break;

                    case 'Moon':
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();

                        //draw range line
                        ctx.beginPath();
                        ctx.arc(obj.originX, obj.originY, obj.extRadius, 0, Math.PI*2);
                        ctx.globalAlpha = 0.1;
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                        break;

                    case 'TradingPost':
                        ctx.beginPath();
                        ctx.fillStyle = obj.color;
                        ctx.fillRect(obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                        // ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
                        ctx.fill();
                        ctx.closePath();

                        //draw range line of planet
                        ctx.beginPath();
                        ctx.arc(obj.originX, obj.originY, obj.extRadius, 0, Math.PI*2);
                        ctx.globalAlpha = 0.1;
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;

                        //draw range line of post
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.range, 0, Math.PI*2);
                        ctx.globalAlpha = 0.5;
                        ctx.strokeStyle = obj.color;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                        break;

                    case 'ShipYard':
                        ctx.beginPath();
                        ctx.fillStyle = obj.color;
                        ctx.fillRect(obj.x - obj.r/2, obj.y - obj.r/2, obj.r, obj.r);
                        // ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
                        ctx.fill();
                        ctx.closePath();

                        //draw range line of planet
                        ctx.beginPath();
                        ctx.arc(obj.originX, obj.originY, obj.extRadius, 0, Math.PI*2);
                        ctx.globalAlpha = 0.1;
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;

                        //draw range line of post
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.range, 0, Math.PI*2);
                        ctx.globalAlpha = 0.2;
                        ctx.strokeStyle = obj.color;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                        break;

                    case 'BackgroundStar':
                        ctx.beginPath();
                        ctx.globalAlpha = obj.opacity/100;
                        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                        break;

                    default:
                        console.error('Invalid object name given for rendering Astrobject: ' + obj.name);
                    }

                if (obj.hasFlag) {
                    // ctx.beginPath();
                    // ctx.arc(obj.x, obj.y, 5, 0, Math.PI*2);
                    // ctx.fillStyle = 'magenta';
                    // ctx.fill();
                    // ctx.closePath();

                    ctx.beginPath();
                    ctx.moveTo(obj.x, obj.y);
                    ctx.lineTo(obj.x - 8, obj.y - 32);
                    ctx.lineTo(obj.x + 8, obj.y - 32);
                    ctx.lineTo(obj.x, obj.y);
                    ctx.closePath();
                    ctx.fillStyle = "magenta";
                    ctx.fill();

                    ctx.beginPath();
                    ctx.moveTo(obj.x, obj.y);
                    ctx.lineTo(app.ship.x, app.ship.y);
                    ctx.closePath();
                    ctx.strokeStyle = "rgba(256,256,256,0.05)";
                    ctx.stroke();
                }
            }
        }
    };
})();
