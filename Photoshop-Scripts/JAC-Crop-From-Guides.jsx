////////////////////////////////////////////////////////////////////////////
//Creator: Joseph Aaron Campbell
//http://josephaaroncampbell.com
//Photographer/Imaging Specialist

//This Script will locate four guides and use
//their coordinate data to crop the image.
/////////////////////////////////////////////////////////////////////////////

//assign a name to the current open document
var currentDoc = activeDocument;

//prevent dialogs that could appear
displayDialogs = DialogModes.NO; 

//store the ruler unit for later use
var originalUnit = preferences.rulerUnits;

//create random variable to store loop count number
var j = 0;

//change document ruler to pixels  
preferences.rulerUnits = Units.PIXELS;

//store the guides present in document
var guideOne = currentDoc.guides[0];
var guideTwo = currentDoc.guides[1];
var guideThree = currentDoc.guides[2];
var guideFour = currentDoc.guides[3];

//create array of guides to reference later
//the first item in an array is always 0
//so there number ids are (0,1,2,3)
var guideList = new Array(guideOne, guideTwo, guideThree, guideFour);

//create empty array of vertical guides
var verticalList = new Array();
//create empty array of horizontal guides
var horizontalList = new Array();

//determine which guides are vertical and add to veritcalList array
while (j<guideList.length){
     if (guideList[j].direction == "Direction.VERTICAL"){
        //if guide IS vertical 
        //add the guide to the vertical list
         verticalList.push(guideList[j]);
         }else{
          //if guide IS NOT vertical 
          //add the guide to the horizontal list
          horizontalList.push(guideList[j]);
    }
     //keep the while loop running 
     //by incrementing our counter
     j = j +1;
}

//determine which guide is which edge of the crop
//the top guide will have the smallest y value
//the bottom guide will have the largest y value
//the left guide will have the smallest x value
//the right guide will have the largest x value

// find right and left bounds by comparing the 
//two guides strored in the verticalList array
if (verticalList[0].coordinate > verticalList[1].coordinate){
    var rightGuide = verticalList[0].coordinate;
    var leftGuide = verticalList[1].coordinate;
    }else{
          var rightGuide = verticalList[1].coordinate;
          var leftGuide = verticalList[0].coordinate;
}

// find top and bottom by comparing the 
//two guides strored in the horizontalList array
if (horizontalList[0].coordinate > horizontalList[1].coordinate){
 var bottomGuide = horizontalList[0].coordinate;
    var topGuide = horizontalList[1].coordinate;
    }else{
          var bottomGuide = horizontalList[1].coordinate;
          var topGuide = horizontalList[0].coordinate;
}

//crop the image using the guide location data
//crop(new Array([left, top, right, bottom]),
currentDoc.crop(new Array(leftGuide, topGuide , rightGuide , bottomGuide));

//return the document ruler back to its original unit
preferences.rulerUnits = originalUnit;

//remove the following '//' characters to flatten any layers
//currentDoc.flatten();

//remove the following '//' characters to save the file when done
//currentDoc.save();

//remove the following '//'  characters to close the document when done
//currentDoc.close();


