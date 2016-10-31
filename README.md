# koopa - connected turtle feeder
![koopa](/screenshots/header.PNG)

**Video Demo:**  

Koopa is a turtle feeder companion app with simulated hardware input/output through Kinoma pin simulators. The design of the simulated hardware is a motor feeder connected to a platform and a device screen. The feeder dispenses food into the water while the platform has an area underneath an attached heat lamp as well as a scale. Whenever the turtle is on the platform underneath the lamp, the heat lamp will automatically turn on. In the Kinoma pin simulator, the platform is a digital input (pin 56), the lamp intensity is a PWM output (pin 28), the scale is an analog input (pin 54), and the feed motor is a PWM output (pin 30). The associated companion app supports 4 tasks: holding the lamp button to temporarily turn on the lamp when the turtle is not on the platform, changing the heat lamp intensity when the turtle is on the platform, weighing the turtle when it’s on the scale, and dispensing food remotely. When an action is performed, both the pin simulators and device screen change in response.

![Interaction Walkthrough: T1](/screenshots/walkthru1.PNG)
![Interaction Walkthrough: T2](/screenshots/walkthru2_a.PNG)
![Interaction Walkthrough: T2](/screenshots/walkthru2_b.PNG)
![Interaction Walkthrough: T3](/screenshots/walkthru3_a.PNG)
![Interaction Walkthrough: T3](/screenshots/walkthru3_b.PNG)
![Interaction Walkthrough: T4](/screenshots/walkthru4_a.PNG)
![Interaction Walkthrough: T4](/screenshots/walkthru4_b.PNG)


