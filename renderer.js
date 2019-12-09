'use strict';

var Renderer = (function() {
    var privateVar = '';

    function privateMethod () {
    // ...
    }

    return {
        renderMap: function(obj) {
            for (var i = 0; i< obj.chunks.length; i++) {
                Renderer.renderChunk(obj.chunks[i]);
            }
        },
        renderChunk: function(obj) {
            for (var j = 0; j < obj.backgroundStars.length; j++) {
                Renderer.renderAstrobject(obj.backgroundStars[j]);
            }
        
            for (var i = 0; i < obj.allAstrobjects.length; i++) {
                Renderer.renderAstrobject(obj.allAstrobjects[i]);
            }
        },
        renderShip: function(obj)  {
            //hull
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
            ctx.fillStyle = "#eeeeee";
            ctx.fill();
            ctx.closePath();

            //energyContainer
            ctx.beginPath();
            ctx.rect(obj.x + 15, obj.y + 16, 0.5, 1);
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
            ctx.closePath();

            //energyAmount
            ctx.beginPath();
            ctx.rect(obj.x - 15, obj.y + 15, (obj.batteries.energy / obj.batteries.energyCapacity) * 30, 3);
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = "#FFA500";
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.closePath();

            //shield
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius + 5, 0, Math.PI*2);
            ctx.strokeStyle = '#05C7F2';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
            ctx.lineWidth = 1;

            //particles
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 5;
            ctx.fillStyle = "red";

            for (let i = 0; i < obj.history.length; i++) {
                if (i > 10) {
                    ctx.beginPath();
                    ctx.arc(obj.history[i].x, obj.history[i].y, 3, 0, Math.PI*2);
                    ctx.fill();
                    ctx.closePath();
                }
            }

            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
        },
        renderAstrobject: function (obj) {

            if (viewport.isInside(obj.x, obj.y)) {

                ctx.beginPath();

                switch(obj.name) {

                case 'Astrobject':
                    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
                    ctx.fillStyle = obj.color;
                    ctx.fill();
                    break;
                
                case 'Star':
                    ctx.shadowColor = obj.color;
                    ctx.shadowBlur = obj.range/2;
            
                    // hull
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
                    break;

                case 'Planet':
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
                        ctx.lineWidth = 1;
                    }
            
                    if (obj.resourceRanges instanceof Array) {
                        for (let i = 0; i < obj.resourceRanges.length; i++) {
                            ctx.beginPath();
                            ctx.arc(obj.x, obj.y, obj.resourceRanges[i], 0, Math.PI*2);
                            ctx.globalAlpha = 1;
                            ctx.strokeStyle = 'gray';
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                    break;
                        
                case 'Nebula':
                       
                    var innerRadius, outerRadius, gradient;
            
                    switch (obj.nebulaType) {
                        case 'emission':
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
                            break;
            
                        case 'reflection':
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
                            break;
            
                        case 'dark':
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
                            break;
            
                        case 'supernova':
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
                            break;
                    }
                    break;

                case 'Wormhole':
                    ctx.shadowColor = obj.color;
                    ctx.shadowBlur = obj.range;
                    ctx.globalAlpha = 1;
            
                    // hull
                    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
                    ctx.fillStyle = obj.color;
                    ctx.fill();
            
                    ctx.shadowColor = "transparent";
                    ctx.shadowBlur = 0;
                    break;

                case 'Moon':
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
                    break;

                case 'BackgroundStar':
                    ctx.globalAlpha = obj.opacity/100;
                    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2);
                    ctx.fillStyle = obj.color;
                    ctx.fill();
                    break;

                default:
                    console.error('Invalid object name given for rendering Astrobject: ' + obj.name);
                }

                ctx.closePath();
                ctx.globalAlpha = 1;
            }
        }
    };
})();