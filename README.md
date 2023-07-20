hunter:
    appear
    + move
    shoot
    hide
    distracted

birds:
    fly in
    + fly
    fly away
    dissapear

Creature:
    happy
    sad
    game over score

TODO: 
1. Change speed of the duck according to screen size (PC/mobile)? Make hitbox bigger?
2. Improve Duck generateAim function
3. Add top score to cookies
4. Timer works correctly if window lost focus and continue is pressed
5. Create hunter escape animation
6. Create shooting animation or maybe create bullets timeout
7. Refactor timer (we have two in actors.js and in menu.js)

TOMORROW TODO:
1. add game over
2. add level count

FIX:
1. Game could pause on a screen shot
2. Fix resize (actors drop images after screen resize)
