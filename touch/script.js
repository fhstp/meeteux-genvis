d3.json("/data/genealogy-data.json", function(data) {
    
    var persons = data;
    var events = [{startYear: "900", endYear: "910", name: "some war"}, {startYear: "920", endYear: "920", name: "some 2nd war"}];

    var dataArray = [];
    dataArray[0] = [{x:5, y:5}, {x:10, y:5}, {x:15, y:10}, {x:50, y:10}]; // first: birth, second & third: calculation for mariage, forth: dead
    dataArray[1] = [{x:10, y:25}, {x:15, y:20}, {x:60, y:20}];
    dataArray[2] = [{x:30, y:45}, {x:100, y:45}];

    var interpolateTypes = [d3.curveLinear, d3.curveNatural, d3.curveStep, d3.curveBasis, d3.curveBundle, d3.curveCardinal];
    var stringDates = ['1000', '1300'];
    var parseDate = d3.timeParse("%Y");

    //var minDate = d3.min(data, function(d){ return d.month; });
    //var maxDate = d3.max(data, function(d){ return d.month; });

    //var j = d3.scaleTime().domain(d3.extent(stringDates, function(d){ return parseDate(d); })).range([0,chartWidth]);

    var svgHeight = 2000;
    var svgWidth = 2000;
    // Determines how far the scroll bar should be from the top
    var scrollOffset = 0;

    var x = d3.scaleTime()
    .domain(d3.extent(stringDates, function(d){return parseDate(d)}))
    .range([0, svgWidth]);


    // get the x-coordinates depending on year
    var whichX = d3.scaleLinear()
        .domain([1000, 1300]) // min and max year of data set
        .range([0, svgWidth]); // min and max of svg

    var personArray = [];
    var personInfoArray = [];
    var itterator = 0;
    var startY = 20;
    var marriageXDiff = 5;
    var marriageYDiff = 10;
    var yDiff = 50;
    var marriageCount = 1;

    var childArray = [];
    var showChildArray = [];
    var isChild = false;
    var isFather = false;
    var fatherArray = [];

    persons.forEach(person => {
        //console.log(person);
        //console.log(person.name + " " + person.born + " " + whichX(person.born));
        isMarried(person);
    });

    function isMarried(person){
        if(typeof person.marriages != "undefined"){
            console.log("ist verheiratet");
            console.log(person.name);
            if(typeof person.marriages[0].children !== "undefined"){
                isFather = true;
                console.log("Father");
            }

            marriageCount = 1;
            pushInArray(person, "married");
            
            person.marriages.forEach(marriage => {
                console.log("verheiratet mit");
                console.log(marriage.spouse.name);

                pushInArray(marriage.spouse, "spouse");

                if(typeof marriage.children !== "undefined"){
                    console.log("hat Kinder");
                    childArray.push(marriage);
                }else{
                    console.log("keine Kinder");
                }
            });
            
            childArray.forEach(spouse => {
                childArray = [];
                console.log("childArray is cleared");

                spouse.children.forEach(child => {
                    isChild = true;
                    console.log("Kind");
                    console.log(child.name + " " + child.born + " " + whichX(child.born));
                    isMarried(child);
                });
            });
        }else{
            console.log("nicht verheiratet");
            pushInArray(person, "child");
        }
    }

    function pushInArray(person, type){
        console.log("pushinarray");
        console.log(person);
        // x1 - x-Child  y1 - middle of Father/Mother y3
        // x2 - x-Child  y2 - y1 child
        if(isChild){
            console.log("ist Kind");
            isChild = false;
            getFatherById(person.father);
            var fatherY = getFatherY(father);
            showChildArray.push([{x: whichX(person.born), y: fatherY + 15}, 
                {x: whichX(person.born), y: startY}]);
        }

        switch (type) {
            case "child":
                console.log("child");
                personArray[itterator] = [
                    {x: whichX(person.born), y: startY, gender: person.gender}, 
                    {x: whichX(person.died), y: startY},
                ];
                personInfoArray[itterator] = {name: person.name, gender: person.gender, x: whichX(person.born), y: startY};

                console.log("in nicht verheiratet");
                console.log(person.name);
                startY += yDiff;
                itterator++;
                break;
            
            case "spouse":
                console.log("spouse");
                
                var marriageX1 = whichX(person.marriage) - marriageXDiff;
                var marriageX2 = whichX(person.marriage) + marriageXDiff;
                var marriageY = startY - marriageYDiff - yDiff*(marriageCount-1);
                
                personArray[itterator] = [
                    {x: whichX(person.born), y: startY, gender: person.gender}, // born
                    {x: marriageX1, y: startY}, // marriage 1
                    {x: marriageX2, y: marriageY}, // marriage 2
                    {x: whichX(person.died), y: marriageY}
                ];
                personInfoArray[itterator] = {name: person.name, gender: person.gender, x: whichX(person.born), y: startY};
                
                startY += yDiff;
                itterator++;
                marriageCount++;
                break;
        
            default:
                console.log("default");
                var marriageX1 = whichX(person.marriages[marriageCount-1].spouse.marriage) - marriageXDiff;
                var marriageX2 = whichX(person.marriages[marriageCount-1].spouse.marriage) + marriageXDiff;
                var marriageY = startY + marriageYDiff;

                fatherArray.push({y: marriageY, id: person.id});

                personArray[itterator] = [
                    {x: whichX(person.born), y: startY, gender: person.gender}, 
                    {x: marriageX1, y: startY}, // marriage 1
                    {x: marriageX2, y: marriageY}, // marriage 2
                    {x: whichX(person.died), y: marriageY},
                ];
                personInfoArray[itterator] = {name: person.name, gender: person.gender, x: whichX(person.born), y: startY};
                startY += yDiff;
                itterator++;
                break;
        }
    }
    var father;
    var myId;

    function getFatherById(myIdF){
        myId = myIdF;
        console.log("search " + myId);
        persons.forEach(person => {
            getFatherByIdRecursive(person);
        });
    }

    function getFatherByIdRecursive(person){
        if(person.id == myId){
            console.log("id found");
            console.log(person);
            father = person;
        }
        if(typeof person.marriages != "undefined"){
            person.marriages.forEach(marriage => {
                if(typeof marriage.children !== "undefined"){
                    marriage.children.forEach(child => {
                        if(child.id == myId){
                            console.log("id found");
                            console.log(child);
                            father = child;
                        }else{
                            getFatherByIdRecursive(child);
                        }
                    });
                }
            });
        }
    }

    function getFatherY(fatherSample){
        console.log(fatherSample);
        var fatherY = "";
        fatherArray.forEach(father => {
            if(father.id == fatherSample.id){
                fatherY = father.y;
            }
        });
        return fatherY;
    }

    var xAxis = d3.axisBottom(x);

    var svg = d3.select("#chart").append("svg")
        .attr("height", svgHeight + 'px')
        .attr("width", svgWidth + 'px');

    var line = d3.line()
        .x(function(d, i){ return d.x; })
        .y(function(d, i){ return d.y; })
        .curve(d3.curveLinear); // generates a path element which is a line

    var chartGroup = svg.append("g")
        .attr("class", "group")
        .attr("transform", "translate(0,0)");

    var firstGroups = chartGroup.selectAll("g")
        .data(personArray)
        .enter().append("g")
            .attr("class", function(d,i){ return "firstLevelGroup"+i;});

    var secondGroups = firstGroups.append("path")
        .attr("fill", "none")
        .attr("stroke", function(d) {
            if(d[0].gender == "man"){
                return "blue";
            }else{
                return "red";
            }
        })
        .attr("stroke-width", "25")
        .attr("d", function(d){ return line(d); });
    
    var thirdGroup = chartGroup.selectAll("g.third")
        .data(showChildArray)
        .enter().append("g")
            .attr("class", "third");
    var fourthGroup = thirdGroup.append("path")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", "1")
        .attr("stroke-dasharray", "10,10")
        .attr("d", function(d){ return line(d); });

    // Adds names to 
        chartGroup.selectAll("text")
            .data(personInfoArray)
            .enter()
            .append("text")
                .text(function(d) { return d.name; })
                .attr("x", function(d) {return d.x;})
                .attr("y", function(d) {return d.y;})
                .attr("fill", "white");

    /*
    for(var i=0; i < personArray.length; i++){
        firstGroups.selectAll("circle.grp")
            .data(personArray[i])
            .enter()
            .append("circle")
                .attr("class", function(d, j){ return "grp"+j; })
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
                .attr("r", "5")
                .attr("fill", "yellow");
    }*/


    var axisGroup = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

    // This is just to show you that the parseDate funciton returns a very long stirng. What firefox and chrome took was only the last 3 digits which resolve to :00
    console.log('stringdates: ', parseDate(stringDates[0]), d3.extent(stringDates, function (d) { return parseDate(d) }));

    /**
     * This is where the transition of the axis takes place. You can take various ease funcitons to make it smoother.
     * https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
     * Or try play around with duration and delay.
     */
    var elementToScroll = document.getElementById("chart");

    elementToScroll.addEventListener('scroll', function(event) {
        // First covers all browsers and tablets except ones with IE. Second is fallback option for IE.
        const scrollPos = elementToScroll.scrollY || elementToScroll.scrollTop;

        // If we are not at the top of the screen we add the offset
        if (scrollPos > 5) {
            axisGroup
            .transition()
            .ease(d3.easeElastic)
            .attr('transform', `translate(0, ${scrollPos + scrollOffset})`);
        } else { // Otherwise we need no offset
            axisGroup
            .transition()
            .ease(d3.easeElastic)
            .attr('transform', `translate(0, ${scrollPos})`);
        }
    });

//id="chart"





});
