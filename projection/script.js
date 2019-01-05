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

        info.append("h1").text(myPerson.name);
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
});




