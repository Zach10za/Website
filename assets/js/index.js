

const svg = document.getElementById('bgAnimation');

const viewBox = [100,100];
const modifier = 10;
const radius = 0.1;

const circles = [];
for (let x=0; x<viewBox[0]; x += modifier) {
  for (let y=0; y<viewBox[1]; y += modifier) {
    let opacity = Math.random();
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx",x + (modifier / 2));
    circle.setAttribute("cy",y + (modifier / 2));
    circle.setAttribute("r",radius);
    circle.setAttribute("fill",'rgba(0,0,0,'+(opacity - 0.3)+')');
    circle.setAttribute("stroke-width",(1-opacity)*2);
    circle.setAttribute("stroke",'rgba(0,0,0,'+opacity+')');
    circles.push(circle);
    svg.appendChild(circle);
    animate(circle)
  }
}

function animate(target) {
  let opacity = Math.random();
  anime({
    targets: target,
    translateX: () => Math.random() * 10 * anime.random(-1,1),
    translateY: () => Math.random() * 10 * anime.random(-1,1),
    fill: () => 'rgba(0,0,0,'+(opacity - 0.5)+')',
    duration: () => 5000 * ((1-opacity)*2),
    r: () => (opacity) * 4,
    opacity,
    easing: 'easeInOutCirc',
    complete: () => {
      animate(target);
    }
  });
}