# Website

https://ZachLoza.com


## How the background is done

I don't work with animation a lot so I wanted to try to make an interesting and interactive animation for the background of my personal website. I ended up with a graph/nodes and edges type animation. It ended up being a fun challenge and lesson on javascript's performance pitfalls.

The entire animation is rendered with HTML5's canvas. The user defined settings are:
 - Density (the horizontal/vertical distance between nodes)
 - Maximum Radius
 - Minimum Radius
 - Speed Multiplier
 - Connection Distance (the distance between two nodes before they form a connection)
 
 All the settings are applied with inidividual dynamic random multipliers for each node. The nodes' main properties are the radius and opacity which are inherintly linked. The larger the node, the less opacity it has. These values are also linked to speed so the larger/less opaque nodes move slower. This is too create a "3D" effect where the further objects appear out of focus.
 
 So far everything has been pretty standard but I wanted it too be a little more unique so I added a form of gravity. The idea was to make it similar to planets in which the more massive ones attract more and the closer two nodes get to each other, the more gravity would be acting upon them. This quickly created a jumbled mess of clusters where nodes were getting sucked into but unable to escape. Due to this I greatly lowered the gravity effect so it is hardly noticable but it is there and it creates a little more of an organic effect. Lastly, I added collision between the nodes which helped even more with the gravity cluster problem.
 
 Now all that needed was to add interactivity. On a computer, you can use the mouse to interact. When hovering over the page, connections will be made from the cursor to the nearest nodes. When clicking, nodes will begin moving towards the cursor until released in which  they will continue on their original paths. Also to add to the "3D" effect, when hovering around the page, there is a base multiplier being added to/subtracted from the nodes to create a parallax effect. This works by calculating the horizontal and vertical distance to the center of the page and applying the multipler based on a node's radius.
 
 After all this, performance wasn't great. The solution was pretty much to throw out all of the nice and pretty ES6 iterators (forEach, map, filter, etc.) and go back to the trusty for loops. Also, while it was convient store the connection information as objects, it was far faster to just draw them on the fly. After all the optimizations I was able to get a steady 60 fps in supporting browsers and monitors (it turns out requestAnimationFrame is based to your monitor's refresh rate).
 
 Overall it was good practice and a fun challenge in canvas animations.
