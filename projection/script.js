d3.json("data/genealogy-data.json", function(data){
    var genData = data;
    // waiting for websocket call from client with side and personid
    var side = "left";
    var personId = 1;

    showData(side, personId);
    showData("right", 40);

    function showData(whichSide, whichPersonId){
        getPersonById(whichPersonId);

        console.log(whichSide);
        var myDiv;
        switch (whichSide) {
            case "left":
                myDiv = d3.select("#userLeft");
                break;
        
            default:
                myDiv = d3.select("#userRight");
                break;
        }

        var map = myDiv.append("div").attr("class", "map");
        var info = myDiv.append("div").attr("class", "info");
        var children = myDiv.append("div").attr("class", "children");

        var infoDiv = info.append("div").attr("class", "banner");
        infoDiv.append("h1").text(myPerson.name);
        infoDiv.append("p").text(getTimeString(myPerson));
        info.append("img").attr("src", "/img/"+myPerson.img+".png");
    }

    var myPerson;
    var myId;

    function getPersonById(myPersonId){
        myId = myPersonId;
        genData.forEach(person => {
            getPersonByIdRecursive(person);
        });
    }

    function getPersonByIdRecursive(person){
        if(person.id == myId){
            myPerson = person;
        }
        if(typeof person.marriages != "undefined"){
            person.marriages.forEach(marriage => {
                if(typeof marriage.spouse !== "undefined"){
                    if(marriage.spouse.id == myId){
                        myPerson = marriage.spouse;
                    }
                }

                if(typeof marriage.children !== "undefined"){
                    marriage.children.forEach(child => {
                        if(child.id == myId){
                            myPerson = child;
                        }else{
                            getPersonByIdRecursive(child);
                        }
                    });
                }
            });
        }
    }

    function getTimeString(myPerson){
        var timeString = "";
        
        if(myPerson.bornGuessed){
            timeString += "um ";
        }

        timeString += myPerson.born + " - ";

        if(myPerson.diedGuessed){
            timeString += " um ";
        }
        
        timeString += myPerson.died;

        return timeString;
    }
});




