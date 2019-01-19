'use strict'

var d3

var printedPosLeft = [
  { 'x': 443, 'y': 114 },
  { 'x': 443, 'y': 330 },
  { 'x': 443, 'y': 540 },
  { 'x': 443, 'y': 755 },
  { 'x': 443, 'y': 960 }
]

var printedPosRight = [
  { 'x': 844, 'y': 114 },
  { 'x': 844, 'y': 330 },
  { 'x': 844, 'y': 540 },
  { 'x': 844, 'y': 755 },
  { 'x': 844, 'y': 960 }
]

var printedPosLeftOther = [
  { 'x': 765, 'y': 198 },
  { 'x': 765, 'y': 410 },
  { 'x': 765, 'y': 622 },
  { 'x': 765, 'y': 835 },
  { 'x': 765, 'y': 883 }
]

var printedPosRightxx = [
  { 'x': 518, 'y': 198 },
  { 'x': 518, 'y': 410 },
  { 'x': 518, 'y': 622 },
  { 'x': 518, 'y': 835 },
  { 'x': 518, 'y': 883 }
]

var printedPosFather = [
  { 'fatherX': 566, 'fatherY': 216 },
  { 'fatherX': 566, 'fatherY': 425 },
  { 'fatherX': 566, 'fatherY': 643 },
  { 'fatherX': 566, 'fatherY': 856 }
]

var marginLeft = 314

d3.json('data/genealogy-data.json', function (data) {
  var genData = data

  d3.json('data/printed-persons.json', function (data2) {
    var printedPersons = data2

    // waiting for websocket call from client with side and personid
    var side = 'left'
    var personId = 1

    showData(side, personId)
    showData('right', 6)

    function showData (whichSide, whichPersonId) {
      getPersonById(whichPersonId)

      var printedRelative

      printedPersons.some(person => {
        // check if father in printedPerson
        if (person.id === myPerson.father) {
          printedRelative = person
          printedRelative.relation = 'father'
          console.log('father found')
        }

        // check if husband in printedPerson
        if (person.id === myPerson.husband) {
          printedRelative = person
          console.log('husband found')
          printedRelative.relation = 'husband'
        }

        // check if same person
        if (person.id === myPerson.id) {
          printedRelative = person
          console.log('same person')
          printedRelative.relation = 'same'
        }
      })

      var myDiv
      var myConnection
      var myPositions

      switch (whichSide) {
        case 'left':
          console.log('left')
          myDiv = d3.select('#userLeft')
          myConnection = d3.select('#relativeLeft')
          break
        default:
          myDiv = d3.select('#userRight')
          myConnection = d3.select('#relativeRight')
          break
      }

      switch (printedRelative.relation) {
        case 'father':
          if (printedRelative.side === whichSide) {
            // same side

          } else {
            // other side

          }

          break

        default:
          if (printedRelative.side === whichSide) {
            // same side
            switch (whichSide) {
              case 'left':
                myPositions = printedPosLeft[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y + 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 63 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 'px')
                  .style('left', myPositions.x + marginLeft - 48 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 365 + 'px')
                  .style('left', myPositions.x + marginLeft - 81 + 'px')
                break
              default:
                myPositions = printedPosRight[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y + 20 + 'px')
                  .style('left', myPositions.x + marginLeft + 19 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 'px')
                  .style('left', myPositions.x + marginLeft + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 365 + 'px')
                  .style('left', myPositions.x + marginLeft + 35 + 'px')

                break
            }
            console.log(myPositions)
          } else {
            // other side

          }
          break
      }

      var map = myDiv.append('div').attr('class', 'map')
      var info = myDiv.append('div').attr('class', 'info ' + whichSide)
      var children = myDiv.append('div').attr('class', 'children')

      var infoDiv = info.append('div').attr('class', 'banner')
      infoDiv.append('h1').text(myPerson.name)
      infoDiv.append('p').text(getTimeString(myPerson))

      info.append('img').attr('src', '/img/' + myPerson.img + '.png')
    }

    var myPerson
    var myId

    function getPersonById (myPersonId) {
      myId = myPersonId
      genData.forEach(person => {
        getPersonByIdRecursive(person)
      })
    }

    function getPersonByIdRecursive (person) {
      if (person.id === myId) {
        myPerson = person
      }
      if (typeof person.marriages !== 'undefined') {
        person.marriages.forEach(marriage => {
          if (typeof marriage.spouse !== 'undefined') {
            if (marriage.spouse.id === myId) {
              myPerson = marriage.spouse
            }
          }

          if (typeof marriage.children !== 'undefined') {
            marriage.children.forEach(child => {
              if (child.id === myId) {
                myPerson = child
              } else {
                getPersonByIdRecursive(child)
              }
            })
          }
        })
      }
    }

    function getTimeString (myPerson) {
      var timeString = ''

      if (myPerson.bornGuessed) {
        timeString += 'um '
      }

      timeString += myPerson.born + ' - '

      if (myPerson.diedGuessed) {
        timeString += ' um '
      }

      timeString += myPerson.died

      return timeString
    }
  })
})
