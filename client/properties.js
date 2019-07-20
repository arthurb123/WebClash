const properties = {
    /*      General Settings        */

    //The address to connect to, leave 
    //this empty if connecting to the 
    //host directly.
    
    address: "",
    
    //The port the server is running on
    
    port: 5315,

    /*     Graphics Settings        */
    
    //The graphics settings for the
    //night shading
      
    nightColor: "#0f1842",
    nightOpacity: 0.5,
    
    //The graphics settings for the
    //general darkness shading
    
    darknessColor: "black",
    darknessOpacity: 0.45,

    //The standard rendering scale,
    //higher is a zoom-in, lower
    //is a zoom-out.

    computerRenderScale: 2,
    mobileRenderScale: 1,

    //This makes sure the camera never 
    //goes beyond map boundaries.
    //On imcompatible (too small) maps 
    //this effect will be disabled

    lockCamera: true
};