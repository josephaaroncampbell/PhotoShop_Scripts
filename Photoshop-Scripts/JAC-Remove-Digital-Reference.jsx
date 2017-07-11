////////////////////////////////////////////////////////////////////////////
//Creator: Joseph Aaron Campbell
//http://josephaaroncampbell.com
//Photographer/Imaging Specialist
/////////////////////////////////////////////////////////////////////////////

                                 //reference the open document
                                var originalDoc = activeDocument;
                                
                                //return the name of the specific file currently in loop
                                var objectName = originalDoc.name;
                                
                                //remove dialogs
                                displayDialogs = DialogModes.NO 

                                //change document to pixels  - !or this wont work!-
                                var originalUnit = preferences.rulerUnits;
                                preferences.rulerUnits = Units.PIXELS;

                                //store the height and width
                                var originalH = originalDoc.height;
                                var originalW = originalDoc.width;

                               
                                //return value of current dpi for original active document
                                var originalRes = originalDoc.resolution;

                                //create a point for the bottom right of the image
                                //this is where the magicwand will pull its data from
                                var pointX = 0;
                                var pointY = originalDoc.height - 1;

                                //create a variable to store the tolerance for the magicWand
                                var tolR = 0;
                                
                                 if (app.activeDocument.colorSamplers.length > 0 ) {
                                  //clear any existing sample points
                                  clearSamplePoints()
                                  }
                              
                                //return the rgb value of specific point
                                var rgbSample = app.activeDocument.colorSamplers.add([pointX,pointY]);
                                //alert(rgbSample.color.rgb.green);

                                /////////////////FUNCTION CALLS//////////////////////
                                //Call  selction function with desired parameters
                                 selectWhite( pointX, pointY );
                                 
                                /////////////////CONTINUE SCRIPT/////////////////////
                                //store the height of the selection created by the magicWand function
                                var selHeight = (originalDoc.height - activeDocument.selection.bounds[1] );
                                
                                //deselect  the magicWand function
                                originalDoc.selection.deselect();

                                //this is the total height minus the height of the white area
                                var pointSel = (originalH - selHeight);

                                //if the selection worked. crop the image. 
                                //this double checks if target is there
                                if(rgbSample = 255  && selHeight > 0 ){
                                //crop the image
                                originalDoc.crop (new Array(0,0,originalW,pointSel));
                                }else{
                                //alert("do not crop the image" + " " + selHeight)
                                }


/////////////////////////FUNCTIONS///////////////////////////
//include the function in the script file
function selectWhite(pntX, pntY)
{
var idsetd = charIDToTypeID( "setd" );

    var desc2 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    
    var ref1 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
            ref1.putProperty( idChnl, idfsel );
            desc2.putReference( idnull, ref1 );
        var idT = charIDToTypeID( "T   " );
   
    var desc3 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idPxl = charIDToTypeID( "#Pxl" );
            desc3.putUnitDouble( idHrzn, idPxl, pntX);////width point (X)
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idPxl = charIDToTypeID( "#Pxl" );
            desc3.putUnitDouble( idVrtc, idPxl, pntY);////height point (Y)
        var idPnt = charIDToTypeID( "Pnt " );
            desc2.putObject( idT, idPnt, desc3 );
        var idTlrn = charIDToTypeID( "Tlrn" );
            desc2.putInteger( idTlrn, tolR );
        var idAntA = charIDToTypeID( "AntA" );
            desc2.putBoolean( idAntA, true );

executeAction( idsetd, desc2, DialogModes.NO );

}//end function

function clearSamplePoints(){
   var idDlt = charIDToTypeID( "Dlt " );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idClSm = charIDToTypeID( "ClSm" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idAl = charIDToTypeID( "Al  " );
        ref1.putEnumerated( idClSm, idOrdn, idAl );
    desc3.putReference( idnull, ref1 );
executeAction( idDlt, desc3, DialogModes.NO );
}//end

// Restore original ruler unit setting
app.preferences.rulerUnits = originalUnit
