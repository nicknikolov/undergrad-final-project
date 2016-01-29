# Friday, 29 January

This week started with more brainstorming which resulted in a change of direction for my project. I settled on the idea of personalized smartphone gesture recognition which still belongs to the topic of usable interactive  Machine Learning.

![Brainstorming by Rebecca](https://github.com/nicknikolov/undergrad-final-project/blob/master/weekly-logs/rebecca-brainstorm-4.jpg)

Shortly after I set out to rewrite my proposal to reflect the change in my ideas. There are still edges to be ironed out but at this point I had enough to start building a prototype. As a proof of concept I wanted to send any kind of OSC messages from the browser to Wekinator. In order to do that I had to reroute the data through a server using Websockets. To clarify, the server script receives the data from the web browser using a web socket connection, transforms it into OSC and sends a message to Wekinator. After some research I found a very useful [tutorial](https://learn.adafruit.com/raspberry-pi-open-sound-control/interacting-with-a-web-browser) by Todd Treece. As I am familiar with NodeJS I decided to use it for my server script. There are bunch of OSC npm modules but the one that Todd used was good enough for my purposes. For the web socket connection I used the popular socket.io library. I collect the mouse xy positions when it is clicked, normalize them to a 0-1 range and downsample them to a specific number. The server script, as said, only translates the data into OSC and sends the message. All the code is in the repo.


