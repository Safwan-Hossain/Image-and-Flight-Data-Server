# BUGS AND FIXES
- Battery icon is too bright for background  
- ~~When server starts before the gui, the timeline graphs start in the middle of the graph~~
   - ~~possibly because the graph is still updating without receiving values~~
- ~~timeline x values are being set as elapsed time (positive constant values~~
   - ~~How are they shifting on their own?~~
   - ~~The graph is split into intervals of 0.1 and the mock data is passing in values every 0.1 seconds. Thats why there was an illusion of the graph working.~~

# TODO
- Consider using animation loop for updating certain modules such as vtk and video handler
- Consider making a vector module instead of using raw data
- add better color scheme for chart colors
- prevent user from rotating drone visualization window
- ~~add title option for graphs~~
- ~~change graph title color in config~~