# For reviewing

### Assignement 1:








### Assignment 2:
 
  
   - Use this link to load the page: https://wellybelly.github.io/OOBP/Assignment_2/
   
  OR
  
   - Download/Clone the repo and run the web page from a web server, due to browser security restrictions the JSON file cannot be accessed otherwise.
   A simple way to do it:
   Make sure you have Node.js installed and then install a development server
   
    npm install -g http-server
    
   - Then (from your terminal/console) go to the directory with the code/web page and run
   
    http-server
   - Then you will see a list of IPs which can be used to access that server. As far as I know this is a purely local server so you don't neet to worry.
   To stop the server simply hit CTRL + C in the terminal/console and the server is stopped.

# Installation

Execute `npm install` this folder to install the dependencies.

# Start

`node index.js` to start the template app

# Editing code

- ROOMS can be deleted/added/edited.
Exits should be added using the EXIT class.
The starting room should be pushed into the world array first.

- ENEMIES can be edited/deleted/added,
Make sure to place them in the room of your choice.

- PLAYER  can be only edited! Do NOT delete the player object.
