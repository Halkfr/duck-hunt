# Make-your-game

  

## Description

  

This game got basic mechanics and some sprites from the original Duck Hunt published by Nintendo.

The game made for educational purposes only.

  

## Authors

  

Orel Margarita @maggieeagle

Litvintsev Anton @Antosha7

  

## Usage
  
To run the game on local machine:

- Download the repository

- Run Python server with a command `python3 -m http.server 8000`

- Or use [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VSCode

- Open [http://localhost:8080/](http://localhost:8000/) in browser

  

## Implementation details

- Developed with JS

- No canvas used

### TODO: 
1. Change speed of the duck according to screen size (PC/mobile)? Make hitbox bigger?
2. Improve Duck generateAim function
3. Add top score to cookies
4. Timer works correctly if window lost focus and continue is pressed
5. Create hunter escape animation
6. Create shooting animation or maybe create bullets timeout
7. Refactor timer (we have two in actors.js and in menu.js)

### FIX:
1. Game could pause on a screen shot
2. Fix resize (actors drop images after screen resize)
