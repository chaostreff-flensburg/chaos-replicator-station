# Chaos Replicatior-station³


## Todos
1. Form Input for taking names + optional phone number
2. Save Input from 1. and save in DB.
3. Use scad to create stl with info from 2.
4. (If no new stl was created in the last 2 minutes and printer is ready to print) OR 6 unsliced stl are available: slice all stls (1-6) into gcode
5. If printer is ready to print: print gcode
6. Show User the info how he can set "printer ready to print" or abort print/ "Techniker*in ist informiert"
7. if applicable inform user

---
### frontend steps (gloabl steps 1.+2.)
1. choose product
2. add personal configuration data + optional contact innfo
3. confirm sending the data + the real world consequence
4. see spinner while sending data to the backend
5. receive an confirmation with ID + very rough estimate || receive an error message with try again later

### Print manager
job.status: created|waiting|printing|completed|aborted

---
openscad -D name='"name"' examples.scad -o test.stl 
prusa-slicer --load=config-2.7.2.ini -m -g "name.stl" "name2.stl" -o=./gcodes/
---