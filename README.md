# Make-your-game

  

## Description

This game got basic mechanics and some sprites from the original Duck Hunt published by Nintendo.

The game is made for educational purposes only.

  

## Authors

Orel Margarita @maggieeagle

Litvintsev Anton @Antosha7

  

## Usage
  
To run the game on local machine:

- Download the repository

- Run Python server with a command `python3 -m http.server 8000`

- Open [http://localhost:8080/](http://localhost:8000/) in browser

- Or use [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VSCode
  


## Implementation details

- Developed with JS

- No canvas used

- Aside from classic game mode we plan to add bonus game mode, which is in development



### TODO: 
1. Change speed of the duck according to screen size (PC/mobile)? Make hitbox bigger?
2. Improve Duck generateAim function
5. Create hunter escape animation
6. Create shooting animation or maybe create bullets timeout
7. Refactor timer (we have two in actors.js and in menu.js)
