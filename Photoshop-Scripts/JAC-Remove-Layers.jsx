////////////////////////////////////////////////////////////////////////////
//Creator: Joseph Aaron Campbell
//http://josephaaroncampbell.com
//Photographer/Imaging Specialist
/////////////////////////////////////////////////////////////////////////////

//remove all layers above the background or bottom layer in the layers list
while (app.activeDocument.layers.length > 1){
    //return the layer name of the top layer in layers list
    var layerName = app.activeDocument.layers[0].name;
    //make top layer the selected layer
    selectLayer(layerName);  
   //delete the selected layer
    deleteLayer();
}

app.activeDocument.flatten();
app.activeDocument.save();


///////////////////FUNCTIONS////////////////////////////////////
function selectLayer(lyrNm){
    var idslct = charIDToTypeID( "slct" );
    var desc99 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref84 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref84.putName( idLyr, lyrNm);//layer name to delete
    desc99.putReference( idnull, ref84 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc99.putBoolean( idMkVs, false );
executeAction( idslct, desc99, DialogModes.NO );
}//end function

function deleteLayer(){
    var idDlt = charIDToTypeID( "Dlt " );
    var desc79 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref64 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref64.putEnumerated( idLyr, idOrdn, idTrgt );
    desc79.putReference( idnull, ref64 );
executeAction( idDlt, desc79, DialogModes.NO );
}//end function