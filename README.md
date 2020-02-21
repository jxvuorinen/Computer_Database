# Computer Database
Full-stack exercise: app for storing info about computers into a database.  
Runs on your localhost. Two versions: "normal" and REST.  
##  How to test it:
### Install:
- Open folder in terminal and run "npm install".  
###  Create the database on your localhost:  
- Open folder "tietokanta" in terminal and run "node luoTietokanta".
###  Run it on localhost:  
- Go back to root-folder and run "node index".
- Open your web-browser and go to "localhost:3000"  
You should be able to run the app!
  - Click "hae kaikki" and you should be able to see two examples of computers and their details.
  - With "Hae tietokone" you can search for a computer with the Id (= "tunniste").
  - "Lisää tietokone" adds a new computer into the database.
  - With "Muuta tietokoneen tietoja" you can edit the details after you have typed the Id of the preferred computer and clicked "Lähetä".
  - "Poista tietokone" removes the computer from the database (use the Id).
