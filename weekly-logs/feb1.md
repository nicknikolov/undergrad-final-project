## February, week 1
### Monday, 1st
I managed to get the mouse coordinates example working by [increasing the number of inputs to 40](https://github.com/nicknikolov/undergrad-final-project/commit/65d84d55af94af49308ceae4957aace513968f53) and [improving my downsampling code](https://github.com/nicknikolov/undergrad-final-project/commit/7d34e9c0bc69933fcd23c27023f428328ced0ced) where I also move all gestures to an origin (the location user clicked first). Additionally I added instructions and comments to the code so they could be reused by anyone learning Wekinator.
### Tuesday, 2nd
Managed to replicate the same logic but using a device's [motion data](https://github.com/nicknikolov/undergrad-final-project/blob/9b93b8f1e433907f9edaf519779945e6dbcd6501/device-motion-example/index.js). I increased the inputs to 60 (that is 20 pairs of X, Y, Z) while the sampling rate is pretty high. It seems to work with basic gestures but I have yet to explore what is possible.
### Wednesday, 3rd
Fairly unproductive day lost in getting familiar with the popular D3 data viz JavaScript library which ended in getting a basic x y graph on the screen. Hopefully tomorrow I will start plotting gesture data on the mobile screen.
### Thursday, 4rd
After some work, I started plotting device motion data on the device's screen. Here unfortunately, I started having trouble training data with Wekinator. Initially I thought something was wrong with what I was doing, or I changed my code from Tuesday without realizing so I spent the rest of the day debugging.
### Friday, 5rd
After playing around for the rest of the day on Thursday and Friday morning, I realized it might have been the case that I was less careful yesterday although there were still weird cases that I was sure my models would work but they didn't. After using more training examples I got some stuff to work again and I continued with plotting graphs. At the end of the day I had the x y z of the devices motion data plotted and each gesture would add another line on the graph so you can easily see which gestured are similar and when you make something completely different.
![Graphs by Rebecca](https://github.com/nicknikolov/undergrad-final-project/blob/master/weekly-logs/graphs.png)
