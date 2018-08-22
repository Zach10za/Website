const canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

let raf;

const mousePos = {x: 0, y: 0};
let attract = false;

const spacing = 110;
const maxRadius = 10;
const minRadius = 1;
const padding = 120;
const speed = 1;

const gridSize = {
    x: Math.ceil((window.innerWidth + spacing) / spacing), 
    y: Math.ceil((window.innerHeight + spacing) / spacing)
};
const offset = {
    x: (window.innerWidth % spacing + spacing) / 2,
    y: (window.innerHeight % spacing + spacing) / 2
}
const parallaxOffset = {
    target: {
        x: 0,
        y: 0
    },
    actual: {
        x: 0,
        y: 0
    }
}

function link(p1,p2,width=1,opacity=0.5,p1opacity=1,p2opacity=1) {
    ctx.lineWidth = width;
    ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
    ctx.beginPath();
        ctx.moveTo(p1.x + (p1opacity ? parallaxOffset.actual.x * p1opacity : 0), p1.y + (p1opacity ? parallaxOffset.actual.y * p1opacity : 0));
        ctx.lineTo(p2.x + (parallaxOffset.actual.x * p2opacity), p2.y + (parallaxOffset.actual.y * p2opacity));
    ctx.closePath();
    ctx.stroke();
}

let points = [];
function Point() {
    this.random = {
        x: Math.random(),
        y: Math.random(),
        radius: Math.random(),
    },
    this.x = 1;
    this.y = 1;
    this.radius = this.random.radius * maxRadius + minRadius;
    this.opacity = this.random.radius;
    this.color = [255,255,255];
    this.connections = [];
    this.draw = function() {
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]},${this.opacity})`;
        ctx.beginPath();
            ctx.arc(this.x + (parallaxOffset.actual.x * this.opacity), this.y + (parallaxOffset.actual.y * this.opacity), this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }
}

for (let y = 0; y < gridSize.y; y++) {
    for (let x = 0; x < gridSize.x; x++) {
        let rand = Math.random();
        let point = new Point();
        point.x = x * spacing + offset.x + Math.random() * spacing - spacing/2;
        point.y = y * spacing + offset.y + Math.random() * spacing - spacing/2;
        point.radius = rand * (maxRadius - minRadius) + minRadius;
        point.opacity = 1 - rand;
        points.push(point);
    }   
}
let counter = 0;

function updatePoints() {
    for (let index = 0; index < points.length; index++) {
        let p = points[index];

        // if (++counter === 9999) {
        //     p.random.x = Math.random();
        //     p.random.y = Math.random();
        //     p.random.radius = Math.random();
        //     counter = 0;
        // }

        // smoothly apply parallax effect. Incase mouse leaves the canvas then re enters in a new place
        if (parallaxOffset.actual.x < parallaxOffset.target.x) {
            parallaxOffset.actual.x += 0.1;
        } else if (parallaxOffset.actual.x > parallaxOffset.target.x) {
            parallaxOffset.actual.x -= 0.1;
        }
        if (parallaxOffset.actual.y < parallaxOffset.target.y) {
            parallaxOffset.actual.y += 0.1;
        } else if (parallaxOffset.actual.y > parallaxOffset.target.y) {
            parallaxOffset.actual.y -= 0.1;
        }

        // set location/radius/opacity of each point
        p.x += (p.random.x * speed - speed / 2) * ((maxRadius - p.radius) / 2);
        p.y += (p.random.y * speed - speed / 2) * ((maxRadius - p.radius) / 2);
        p.color = [255,255,255];
        p.opacity = (1 - p.radius / maxRadius) + 0.1;
        p.radius += p.random.radius * 0.1 - 0.05;
        if (p.radius < minRadius) {
            p.radius = 1;
            p.random.radius = 0.9;
        } else if (p.radius > maxRadius) {
            p.random.radius = 0.1;
        }

        // calculations for interactions between points
        for (let i = index + 1; i < points.length; i++) {
            let dist = distance(p, points[i])
            if (dist < padding) {
                // create line between two points
                link(p, points[i], points[i].radius / 2, 1 - (dist / padding + points[i].opacity / 3), p.opacity, points[i].opacity);

                // slightly change point acceleration towards adjacent point
                if (p.x < points[i].x) {
                    p.random.x += 0.001;
                } else {
                    p.random.x -= 0.001;
                }
                if (p.y < points[i].y) {
                    p.random.y += 0.001;
                } else {
                    p.random.y -= 0.001;
                }
                
                // if 2 points touch "bounce" them the opposite direction
                if (dist < p.radius + points[i].radius && Math.abs(p.opacity - points[i].opacity) < 0.3) {
                    if (p.x + p.radius > points[i].x - points[i].radius && p.x + p.radius > points[i].x + points[i].radius) {
                        p.random.x = 1 - p.random.x;
                        points[i].random.x = 1 - points[i].random.x;
                    }
                    if (p.y + p.radius > points[i].y - points[i].radius && p.y + p.radius > points[i].y + points[i].radius) {
                        p.random.y = 1 - p.random.y;
                        points[i].random.y = 1 - points[i].random.y;
                    }
                }
            }
            // Speed limiter if needed
            // if (p.random.x > 2) p.random.x = 2;
            // else if (p.random.x < -1) p.random.x = -1;
            // if (p.random.y > 2) p.random.y = 2;
            // else if (p.random.y < -1) p.random.y = -1;
        }

        // if points reaches edge of screen "bounce" the opposite direction
        if (p.x + p.radius > canvas.width - parallaxOffset.actual.x * p.opacity && p.random.x >= 0.5) {
            p.random.x = 1 - p.random.x;
        } else if (p.x - p.radius < 0 - parallaxOffset.actual.x * p.opacity && p.random.x < 0.5) {
            p.random.x = 1 - p.random.x;
        }
        if (p.y + p.radius > canvas.height - parallaxOffset.actual.y * p.opacity && p.random.y >= 0.5) {
            p.random.y = 1 - p.random.y;
        } else if (p.y - p.radius < 0 - parallaxOffset.actual.y * p.opacity && p.random.y < 0.5) {
            p.random.y = 1 - p.random.y;
        }

        // draw lines between mouse and adjacent points. Also move points towards mouse if clicked
        let dist = distance(p, mousePos)
        if (dist < padding * 2 && p.opacity > 0.1) {
            if (attract) {
                p.color = [255,0,0];
                if (p.x < mousePos.x) {
                    p.x -= ((p.x - mousePos.x) / (padding / 2));
                } else {
                    p.x += ((mousePos.x - p.x) / (padding / 2));
                }
                if (p.y < mousePos.y) {
                    p.y -= ((p.y - mousePos.y) / (padding / 2));
                } else {
                    p.y += ((mousePos.y - p.y) / (padding / 2));
                }
            }
            link(mousePos, p, p.radius / 2, 1 - dist / (padding * 2), null, p.opacity)
        }
    }
}

function draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    updatePoints();

    for (let index = 0; index < points.length; index++) {
        let p = points[index];
        p.draw();
    }

    raf = window.requestAnimationFrame(draw);
}

// if viewing on mobile use the accelerometer for use interaction instead of the mouse
if (isMobile()) {
    if (window.DeviceMotionEvent !== undefined) {
        window.addEventListener("devicemotion", function(evt) {
            let rect = canvas.getBoundingClientRect();
            parallaxOffset.target.x += evt.rotationRate.beta / 10;
            parallaxOffset.target.y += evt.rotationRate.alpha / 10;
        }, true);
    }
} else {

    window.addEventListener('mousemove', function(evt) {
        let rect = canvas.getBoundingClientRect();

        mousePos.x = evt.clientX - rect.left;
        mousePos.y = evt.clientY - rect.top;
        
        // offset the points by 10% of the distance of the mouse to the center of the screen to create "3D" effect
        parallaxOffset.target.x = (canvas.width / 2 - (evt.clientX - rect.left)) / 10;
        parallaxOffset.target.y = (canvas.height / 2 - (evt.clientY - rect.top)) / 10;
    }, false);

    window.addEventListener('mousedown', function(evt) {
        attract = true;
    }, false);
    window.addEventListener('mouseup', function(evt) {
        attract = false;
    }, false);

}

// set canvas size to window size on resize
window.addEventListener('resize', function(evt) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, false);


 draw();

 function distance(p1,p2) {
    return Math.hypot( p2.x - p1.x, p2.y - p1.y );
 }

 function isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
 }