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
        },
        renderChunk: function(chunk) {
            for (var j = 0; j < chunk.backgroundStars.length; j++) {
                Renderer.renderAstrobject(chunk.backgroundStars[j]);
            }
        
            for (var i = 0; i < chunk.allAstrobjects.length; i++) {
                Renderer.renderAstrobject(chunk.allAstrobjects[i]);
            }
        },
        renderShip: function(ship)  {

            //particles
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 10;
            ctx.fillStyle = "#83E8EB";
            ctx.globalAlpha = 1;

            for (let i = 0; i < ship.history.length; i++) {
                if (i < 10 && i > 5) {
                    ctx.beginPath();
                    ctx.arc(ship.history[i].x, ship.history[i].y, 0.25*i, 0, Math.PI*2);
                    ctx.fill();
                    ctx.closePath();
                }
            }
            ctx.globalAlpha = 1;
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;

            //hull
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.radius, 0, Math.PI*2);
            ctx.fillStyle = "#eeeeee";
            ctx.fill();
            ctx.closePath();

            //energyContainer
            ctx.beginPath();
            ctx.rect(ship.x + 15, ship.y + 16, 0.5, 1);
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            ctx.closePath();

            //energyAmount
            ctx.beginPath();
            ctx.rect(ship.x - 15, ship.y + 15, (ship.batteries.energy / ship.batteries.energyCapacity) * 30, 3);
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = "#FFA500";
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.closePath();

            //shield
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.radius + 5, 0, Math.PI*2);
            ctx.strokeStyle = '#05C7F2';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1;
        },
        renderResource: function(planet, resource) {
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.resourceRanges[resource.depth] + 5, resource.angleStart, resource.angleEnd);
            ctx.strokeStyle = 'aqua';
            ctx.lineWidth = 10;
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1;
        },
        renderAstrobject: function (obj) {

            if (viewport.isInside(obj.x, obj.y)) {

                switch(obj.name) {

                case 'Astrobject':
                case 'Asteroid':
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();
                    break;
                
                case 'Star':
                        ctx.shadowColor = obj.color;
                        ctx.shadowBlur = obj.range/2;
                
                        // hull
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
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
                        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
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
                                innerRadius = obj.radius/4;
                                outerRadius = obj.radius;
                                // Radius of the entire circle.
                                ctx.globalAlpha = 0.2;
                
                                gradient = ctx.createRadialGradient(obj.x, obj.y, innerRadius, obj.x, obj.y, outerRadius);
                                gradient.addColorStop(0, 'purple');
                                gradient.addColorStop(0.3, 'blue');
                                gradient.addColorStop(0.4, 'green');
                                gradient.addColorStop(0.5, 'orange');
                                gradient.addColorStop(0.8, '#652323');
                                gradient.addColorStop(1, '#000000');
                
                                ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
                
                                ctx.fillStyle = gradient;
                                ctx.fill();
                                ctx.closePath();
                                ctx.globalAlpha = 1;
                                break;
                
                            case 'reflection':
                                ctx.beginPath();
                                innerRadius = obj.radius/3;
                                outerRadius = obj.radius;
                                // Radius of the entire circle.
                                ctx.globalAlpha = 0.3;
                
                                gradient = ctx.createRadialGradient(obj.x, obj.y, innerRadius, obj.x, obj.y, outerRadius);
                                gradient.addColorStop(0, '#51FFD6');
                                gradient.addColorStop(1, 'white');
                
                                ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
                
                                ctx.fillStyle = gradient;
                                ctx.fill();
                                ctx.closePath();
                                ctx.globalAlpha = 1;
                                break;
                
                            case 'dark':
                                ctx.beginPath();
                                innerRadius = obj.radius/3;
                                outerRadius = obj.radius;
                                // Radius of the entire circle.
                                ctx.globalAlpha = 0.3;
                
                                gradient = ctx.createRadialGradient(obj.x, obj.y, innerRadius, obj.x, obj.y, outerRadius);
                                gradient.addColorStop(0, '#582335');
                                gradient.addColorStop(0.3, '#6F274C');
                                gradient.addColorStop(0.6, '#652323');
                                gradient.addColorStop(1, '#000000');
                
                                ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
                
                                ctx.fillStyle = gradient;
                                ctx.fill();
                                ctx.closePath();
                                ctx.globalAlpha = 1;
                                break;
                
                            case 'supernova':
                                ctx.beginPath();
                                innerRadius = obj.radius/4;
                                outerRadius = obj.radius/2;
                                // Radius of the entire circle.
                                ctx.globalAlpha = 0.3;
                
                                gradient = ctx.createRadialGradient(obj.x, obj.y, innerRadius, obj.x, obj.y, outerRadius);
                                gradient.addColorStop(0, 'white');
                                gradient.addColorStop(0.3, 'purple');
                                gradient.addColorStop(0.6, 'white');
                                gradient.addColorStop(1, 'purple');
                
                                ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
                
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
                        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();
                
                        ctx.shadowColor = "transparent";
                        ctx.shadowBlur = 0;
                    break;

                case 'Moon':
                        ctx.beginPath();
                        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
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

                case 'BackgroundStar':
                        ctx.beginPath();
                        ctx.globalAlpha = obj.opacity/100;
                        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
                        ctx.fillStyle = obj.color;
                        ctx.fill();
                        ctx.closePath();
                        ctx.globalAlpha = 1;
                    break;

                default:
                    console.error('Invalid object name given for rendering Astrobject: ' + obj.name);
                }
            }
        }
    };
})();