////////////////////////////////////////////////////////////////////////////
//Creator: Joseph Aaron Campbell
//http://josephaaroncampbell.com
//Photographer/Imaging Specialist
/////////////////////////////////////////////////////////////////////////////

//assign a name to the original open document
var currentDoc = activeDocument;

//remove dialogs
displayDialogs = DialogModes.NO; 

 //store the ruler unit for later use
var originalUnit = preferences.rulerUnits;
//change document ruler to pixels  
preferences.rulerUnits = Units.PIXELS;

//set the foreground color to black
app.foregroundColor.rgb.red = 0;
app.foregroundColor.rgb.green = 0;
app.foregroundColor.rgb.blue = 0;
//set the background color to white
app.backgroundColor.rgb.red = 255;
app.backgroundColor.rgb.green = 255;
app.backgroundColor.rgb.blue = 255;

//convert document to RGB or histogram will not work
currentDoc.changeMode(ChangeMode.RGB)

// get histogram and calculate the mean value
var histo = app.activeDocument.histogram;
var mean = 0;  
var total = 0;  
var maxValue = 0;
var minValue = 0;
var meanArray = new Array();
var minArray = new Array();
var mCount = 0;
var zCount = 0;

//list histogram values
    for (var n = 0; n < histo.length; n++) {  
        total = total + histo[n];  
    };  

// find max value in histogram
    for (var m = 0; m < histo.length; m++) {  
        
        var thisValue = histo[m];  

            mean = mean + (m * thisValue / total);  

               if (thisValue > 5) {
                    maxValue = m;
               }
            
        meanArray.push(maxValue);
    };  

//get max value from array of max values
 maxValue = Math.max.apply( Math, meanArray);  

//find min value in histogram
    for (var m = 0; m < histo.length; m++) {  
        
        var thisValue = histo[m];  
        var thisV2 = histo[m+1];
        var thisV3 = histo[m+2];
        var thisV4 = histo[m+3];
        var thisV5 = histo[m+4];
        var thisV6 = histo[m+5];
        var thisV7 = histo[m+6];
        var thisV8 = histo[m+7];
        var thisV9 = histo[m+8];


             if (thisValue < thisV2 && thisV2 < thisV3 && thisV3 < thisV4) {
                    minValue = m; 
                    minArray.push(minValue);
                    mCount = mCount + 1;
                        if(mCount >= 3){
                            break;
                        }
                }
    };  
//get max value from array of max values
 minValue = Math.min.apply( Math, minArray);  
 
//alert("max = " + maxValue);
//alert("min min= " + minArray[0]);
//alert("min middle= " + minArray[1]);
//alert ("min = " + minValue);     

//pick default threshold value // this determines the selection and crop
var thresholdValue = minValue; 

//save tolerance value of selection with magic wand, default is zero
//it is passed to the function 'selectSelect'
var tolR = 0;

//variable to store the dpi of the current doc for later use
var curRes = 0;

//variable that stores one eighth of dpi
var dpiFrac = 0;

//store angle for crop
var cropAngle = 0;

//variable to change cropAngle from positive to negative
var negPos = 1;
                                 
                                     //return the dpi of the current document
                                     curRes = currentDoc.resolution;
                                     
                                     //save the width of the currentDoc
                                     var currentWidth = currentDoc.width;
                                     //save the height of the currentDoc
                                     var currentHeight = currentDoc.height;
                                     
                                     //divide the resolution by eight
                                     dpiFrac = (curRes/10);
                                     //alert( "dpiFrac= " + dpiFrac)
                                     
                                     //apply threshold to current image using function
                                     applyThreshold (thresholdValue);
                                     
                                     //create selection using magic wand
                                     selectSelect (currentWidth/2, currentHeight/2);
                                     
                                     //smooth selection
                                     currentDoc.selection.smooth(2);
                                    
                                    //store bounds of selection
                                     var boundsLeft = activeDocument.selection.bounds[0] ;
                                     var boundsTop = activeDocument.selection.bounds[1] ;
                                     var boundsRight= activeDocument.selection.bounds[2] ;
                                     var boundsBottom= activeDocument.selection.bounds[3] ;

                                    // find smallest distance from bounds to image edge
                                       var bLDist = boundsLeft;
                                       var bTDist = boundsTop;
                                       var bRDist = currentWidth - boundsRight;
                                       var bBDist = currentHeight - boundsBottom;
                                    
                                    //add bounds distance values to an array
                                    var distArray = new Array(bLDist, bTDist, bRDist, bBDist);

                                    //loop through bounds and count how many are less than or equal to zero
                                    for(var k = 0; k < distArray.length; k++){
                                           if( distArray[k] <= 0){
                                                  zCount = zCount + 1;
                                               }
                                               
                                        }   
                                    
                                    //sort array smallest to largest
                                    distArray.sort(function(a,b){ //Array now becomes [0, 1, 4, 5]
                                                return a - b
                                                })
                                    
                                    
                                    //return smallest value of distance between bounds and image edge
                                    var bDist = Math.min.apply( Math, distArray);         
                                    
                                    //compare if smallest bound distance from edge is larger than dipFrac
                                    if(bDist <= dpiFrac){
                                        dpiFrac = bDist;
                                    }
                                    // dpi Fraction cannot be negative. so if less than zero make zero.
                                    if(dpiFrac < 0){
                                        dpiFrac = 0;
                                    }
                                    //alert( "dpiFrac= " + dpiFrac)                    
                    
                                    // Turn the selection into a work path and give it reference
                                    currentDoc.selection.makeWorkPath();
                                    var wPath = currentDoc.pathItems['Work Path'];
                                    
                                   //set up variables and store x and y anchor values
                                   //path length
                                   var pathLength = wPath.subPathItems[0].pathPoints.length;
                                   //this is the first item in the list of anchor points
                                   var origAnchor =  wPath.subPathItems[0].pathPoints[0].anchor; 
                                   //alert(origAnchor + 'origAnchor')
                                 
                                   var testX = 0;
                                   var testY = 0;
                                   
                                   //starting point is originalAnchor
                                   var smallX = 0;
                                   var smallY = 0;
                                                                      
                                   var largeX =  0;
                                   var largeY =  0;
                                   
                                   //return the smallest X value
                                   smallX = findSmallestX(pathLength, origAnchor);
                                     //alert(smallX + '_sX')
                                   //return the smallest Y value
                                   smallY = findSmallestY(pathLength, origAnchor);
                                     //alert(smallY + '_sY')
                                   //return the largest X value
                                   largeX = findLargestX(pathLength, origAnchor);
                                    // alert(largeX + '_LX')

                                   //what side of the document is anchor[0] on and 
                                   //find the angle to adjust the crop to straighten
                                   if (smallY[0] > (currentWidth/2)){
                                     //rightAnchor (smallX, smallY)
                                     cropAngle =  rightAnchor (smallX, smallY);
                                      //alert(cropAngle + "right");
                                       
                                       }else if( smallY[0] < (currentWidth/2)){
                                           //leftAnchor (largeX, smallY)
                                           cropAngle = leftAnchor (largeX, smallY); 
                                           cropAngle = cropAngle * -1; 
                                             //alert(cropAngle + "left");
                                           negPos = (-1*negPos);
                                           }//else if
                                       
                                    //return to original history sate
                                    revertHistory();
                                    
                                   //crop image based on earlier selection bounds
                                   if(negPos*cropAngle > -5 && negPos*cropAngle < 5 && dpiFrac > 0){ 

                                       //rotate the canvas
                                       currentDoc.rotateCanvas(cropAngle);
                                       
                                       // find the difference in the canvas height from before and after the rotation
                                       newDocHeight = currentDoc.height;
                                        var heightDiff = (newDocHeight - currentHeight);
                                        
                                        // find the difference in the canvas height from before and after the rotation                                     
                                        newDocWidth = currentDoc.width;
                                        var widthDiff = (newDocWidth - currentWidth);  

                                        //remove any extra pixels created by the rotation
                                        reduceCanvas(widthDiff,heightDiff);
                                        
                                        //crop the image

                                         currentDoc.crop(new Array(boundsLeft - dpiFrac + widthDiff, boundsTop - dpiFrac + heightDiff, boundsRight + dpiFrac - widthDiff, boundsBottom + dpiFrac - heightDiff), undefined, undefined, undefined);
                                  
                                    }else{
                                      
                                      if(zCount <= 2){
                                          
                                             if(dpiFrac > 0){
                                                 currentDoc.crop(new Array(boundsLeft - dpiFrac, boundsTop  - dpiFrac, boundsRight  + dpiFrac, boundsBottom  + dpiFrac), undefined, undefined, undefined);
                                             }
                                      
                                                 if(dpiFrac <= 0 && boundsLeft == 0 && boundsRight < currentWidth){ 
                                                   dpiFrac = distArray[1];
                                                   //alert( "dpiFracL= " + dpiFrac);   
                                                   currentDoc.crop(new Array(boundsLeft, boundsTop  - dpiFrac, boundsRight  + dpiFrac, boundsBottom  + dpiFrac), undefined, undefined, undefined);
                                                 }
                                          
                                                 if(dpiFrac <= 0 && boundsTop == 0 && boundsBottom < currentHeight){ 
                                                   dpiFrac = distArray[1];
                                                   //alert( "dpiFracT= " + dpiFrac);   
                                                   currentDoc.crop(new Array(boundsLeft - dpiFrac, boundsTop, boundsRight  + dpiFrac, boundsBottom  + dpiFrac), undefined, undefined, undefined);
                                                 }
                                             
                                                 if(dpiFrac <= 0 && boundsRight == currentWidth && boundsLeft > 0){ 
                                                   dpiFrac = distArray[1];
                                                  // alert( "dpiFracR= " + dpiFrac);   
                                                   currentDoc.crop(new Array(boundsLeft - dpiFrac, boundsTop  - dpiFrac, boundsRight, boundsBottom  + dpiFrac), undefined, undefined, undefined);
                                                 }
                                          
                                                if(dpiFrac <= 0 && boundsBottom == currentHeight && boundsTop > 0){ 
                                                   dpiFrac = distArray[1];
                                                   //alert( "dpiFracB= " + dpiFrac);   
                                                   currentDoc.crop(new Array(boundsLeft - dpiFrac , boundsTop  - dpiFrac, boundsRight  + dpiFrac, boundsBottom), undefined, undefined, undefined);
                                                 }
                                      
                                                      if(dpiFrac <= 0 && boundsLeft == 0 && boundsRight >= currentWidth){ 
                                                       dpiFrac = curRes/10;
                                                       //alert( "dpiFracLR= " + dpiFrac);   
                                                       currentDoc.crop(new Array(boundsLeft, boundsTop  - dpiFrac, boundsRight, boundsBottom  + dpiFrac), undefined, undefined, undefined);
                                                     }
                                                      if(dpiFrac <= 0 && boundsTop == 0 && boundsBottom >= currentHeight){ 
                                                       dpiFrac = curRes/10;
                                                       //alert( "dpiFracTB= " + dpiFrac);   
                                                       currentDoc.crop(new Array(boundsLeft  - dpiFrac, boundsTop, boundsRight  + dpiFrac, boundsBottom), undefined, undefined, undefined);
                                                     }
                                             }
                                    }

                                    //reset negPos multiplier
                                    negPos = 1;
                
                                     
                                     
                                     
 /////////////////////////FUNCTIONS/////////////////////////////////////////////////////
//include the function in the script file
function applyThreshold(value)
{             
    var idThrs = charIDToTypeID( "Thrs" );
    var desc2 = new ActionDescriptor();
    var idLvl = charIDToTypeID( "Lvl " );
    desc2.putInteger( idLvl, value );
    executeAction( idThrs, desc2, DialogModes.NO );
}//end applyThreshold----------------------------------------------
     
//if selection anchor[0] is on left side of document
function leftAnchor(largeX, smallY){
    var opSide = largeX[1] - smallY[1];//length of 
    var adSide = largeX[0] - smallY[0];
    var hySide = Math.sqrt((opSide*opSide) + (adSide*adSide));
    var invSin = Math.asin(opSide/hySide);
    var angle = invSin * (180/Math.PI);
    //alert(angle);
    return angle;
}//end function-------------------------------------------------------

//if selection is on right side of document
function rightAnchor(smallX, smallY){
    var opSide = smallX[1] - smallY[1];//length of oppisite side
    //alert(opSide + " OP side");
    var adSide = smallY[0]- smallX[0];//length of adjacent side
    //alert(adSide + "AD side");
    var hySide = Math.sqrt((opSide*opSide) + (adSide*adSide));
    var invSin = Math.asin(opSide/hySide);
    var angle = invSin * (180/Math.PI);
    //alert(angle);
    return angle;
}//end function------------------------------------------------------

//find the smallest x anchor in selection path
function findSmallestX(pathLength, smallXF){
      for (var i=0; i<pathLength; i++) {
       //store the X coordinate for current anchor in loop
       var xTemp = wPath.subPathItems[0].pathPoints[i].anchor; 
       //only if y value is in top half of document
                 //find the smallest X coordinate anchor
                 if(smallXF[0] >= xTemp[0]){
                     smallXF = xTemp;
                 }//if x small                 
         }//for y small 
   return smallXF;
}//end function------------------------------------------------------
     
//find the smallest y anchor in selection path
function findSmallestY(pathLength, smallYF){
      for (var h=0; h<pathLength; h++) {
       //store the X coordinate for current anchor in loop
       var yTemp = wPath.subPathItems[0].pathPoints[h].anchor; 
                 //find the smallest Y coordinate anchor
                 if(smallYF[1] >= yTemp[1]){
                     smallYF = yTemp;
                 }//if x small 
         }//for y small 
   return smallYF;
}//end function------------------------------------------------------

//find the largest x anchor in selection path
function findLargestX(pathLength, largeXF){
      for (var m=0; m<pathLength; m++) {
       //store the X coordinate for current anchor in loop
       var xTemp = wPath.subPathItems[0].pathPoints[m].anchor; 
           //find the smallest X coordinate anchor
                 if(largeXF[0] <= xTemp[0]){
                     largeXF = xTemp;
                 }//if x small 
         }//for y small 
   return largeXF;
}//end function------------------------------------------------------

//find the largest y anchor in selection path
function findLargestY(pathLength, largeYF){
      for (var n=0; n<pathLength; n++) {
       //store the X coordinate for current anchor in loop
       var yTemp = wPath.subPathItems[0].pathPoints[n].anchor; 
       //find the smallest X coordinate anchor
             if(largeYF[1] <= yTemp[1]){
                 largeYF = yTemp;
             }//if x small                        
         }//for y small 
   return largeYF;
}//end function------------------------------------------------------

function selectSelect(pntX, pntY)
{
var idsetd = charIDToTypeID( "setd" );
    var desc19 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref11 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref11.putProperty( idChnl, idfsel );
    desc19.putReference( idnull, ref11 );
    var idT = charIDToTypeID( "T   " );
        var desc20 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc20.putUnitDouble( idHrzn, idPxl, pntX); /// the x value
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc20.putUnitDouble( idVrtc, idPxl, pntY ); // the y value
    var idPnt = charIDToTypeID( "Pnt " );
    desc19.putObject( idT, idPnt, desc20 );
    var idTlrn = charIDToTypeID( "Tlrn" );
    desc19.putInteger( idTlrn, 0 );
    var idAntA = charIDToTypeID( "AntA" );
    desc19.putBoolean( idAntA, true );
executeAction( idsetd, desc19, DialogModes.NO );
}//end function-------------------------------------------------------      

function reduceCanvas(wAmount, hAmount){
    var idCnvS = charIDToTypeID( "CnvS" );
    var desc620 = new ActionDescriptor();
    var idRltv = charIDToTypeID( "Rltv" );
    desc620.putBoolean( idRltv, true );
    var idWdth = charIDToTypeID( "Wdth" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc620.putUnitDouble( idWdth, idPxl, - wAmount );//width
    var idHght = charIDToTypeID( "Hght" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc620.putUnitDouble( idHght, idPxl, - hAmount );//height
    var idHrzn = charIDToTypeID( "Hrzn" );
    var idHrzL = charIDToTypeID( "HrzL" );
    var idCntr = charIDToTypeID( "Cntr" );
    desc620.putEnumerated( idHrzn, idHrzL, idCntr );
    var idVrtc = charIDToTypeID( "Vrtc" );
    var idVrtL = charIDToTypeID( "VrtL" );
    var idCntr = charIDToTypeID( "Cntr" );
    desc620.putEnumerated( idVrtc, idVrtL, idCntr );
executeAction( idCnvS, desc620, DialogModes.NO );
    }//end function-------------------------------------------------------   

//restore image to original 
function revertHistory(){
    executeAction( charIDToTypeID( "Rvrt" ), undefined, DialogModes.NO );
}// end function------------------------------------------------------