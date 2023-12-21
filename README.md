![OrderOfAncient Game Logo](https://pub-1ba5d42028314e148e3c88dc068c7618.r2.dev/assets/images/loading_logo.png)

> Enjoy your life on the open crazy game.

## Tech Stack

This is a fully 3D web-based browser game using Three.js.

-   React ^18 for website frontend
-   Three.js for game rendering
-   Socket.io for RTC server.
-   TailWindCSS & Styled-Components for styling

## How does it works

### Client-side logic

Client side is only responsible to hanlde the rendering.

-   Provides the game UI
-   Render the Three.js/3D scene, environment, bots, and particles.

### Server-side logic

All the game logic is implemented on server-side for both single and multiplayer mode.

-   Lobby logic to join the game
-   Timer logic( total time, round time, second time, etc )
-   Bot logic( bot wave, position, status, health point, animation status, etc )
-   Tower logic( health point, level, etc )
-   Player State( gold, weapons, weapons claim time, etc )
-   Collision logic( launch the weapons, attack the bots, etc )
-   Sprite logic( position, status, target, etc )

### Configuration

-   You can set `REACT_APP_SHOW_SINGLE_PLAY_OPTION=true` to show SINGLE-PLAY option to menu.
