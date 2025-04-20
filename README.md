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

--autoemit-temperature-commands
                     M104 or M190. If so, the temperatures will not be emitted automatically so
                     can put a "M109 S[first_layer_temperature]" command wherever you want. If your
                     Start G-Code after bed reached its target temperature and extruder just started
 --bed-temperature N Bed temperature for layers after the first one. Set this to zero to disable bed
                     temperature control commands in the output. (°C, default: 0)
                     extruder and bed temperature are reset using non-wait command; however if M104,
                     temperature commands. Note that you can use placeholder variables for all Slic3r
                     settings, so you can put a "M109 S[first_layer_temperature]" command wherever
                     off temperature\nG28 X0 ; home X axis\nM84 ; disable motors\n)
 --first-layer-bed-temperature N
                     Heated build plate temperature for the first layer. Set this to zero to disable
                     bed temperature control commands in the output. (°C, default: 0)
 --first-layer-temperature N
                     Nozzle temperature for the first layer. If you want to control temperature
                     manually during print, set this to zero to disable temperature control commands
 --gcode-flavor      Some G/M-code commands, including temperature control and others, are not
 --ooze-prevention   This option will drop the temperature of the inactive extruders to prevent
 --standby-temperature-delta N
                     is not used when 'idle_temperature' in filament settings is defined. (∆°C,
                     for all PrusaSlicer settings, so you can put a "M109 S[first_layer_temperature]"
                     temperature-changing commands. See 'autoemit_temperature_commands'. (default:
 --temperature N     Nozzle temperature for layers after the first one. Set this to zero to disable
                     temperature control commands in the output G-code. (°C, default: 200)
