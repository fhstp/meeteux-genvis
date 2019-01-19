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

var printedPosRightOther = [
  { 'x': 518, 'y': 198 },
  { 'x': 518, 'y': 410 },
  { 'x': 518, 'y': 622 },
  { 'x': 518, 'y': 835 },
  { 'x': 518, 'y': 883 }
]

var printedPosFather = [
  { 'x': 566, 'y': 216 },
  { 'x': 566, 'y': 425 },
  { 'x': 566, 'y': 643 },
  { 'x': 566, 'y': 856 }
]

var marginLeft = 314

d3.json('data/genealogy-data.json', function (data) {
  var genData = data

  d3.json('data/printed-persons.json', function (data2) {
    var printedPersons = data2

    // waiting for websocket call from client with side and personid
    var side = 'left'
    var personId = 27

    showData(side, personId)
    showData('right', 27)

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
          console.log('right')
          myDiv = d3.select('#userRight')
          myConnection = d3.select('#relativeRight')
          break
      }

      switch (printedRelative.relation) {
        case 'father':
          if (printedRelative.side === whichSide) {
            // same side
            console.log('same side')
            switch (printedRelative.position) {
              case 1:
                myPositions = printedPosFather[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/horizontal.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 200 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 'px')
                  .style('left', myPositions.x + marginLeft - 170 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y + 0 + 'px')
                  .style('left', myPositions.x + marginLeft - 185 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 260 + 'px')
                  .style('left', myPositions.x + marginLeft - 205 + 'px')
                break
              case 2:
                myPositions = printedPosFather[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/horizontal.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 200 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 'px')
                  .style('left', myPositions.x + marginLeft - 170 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y + 0 + 'px')
                  .style('left', myPositions.x + marginLeft - 185 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 50 + 'px')
                  .style('left', myPositions.x + marginLeft - 205 + 'px')
                break
              case 3:
                myPositions = printedPosFather[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/horizontal.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 200 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y - 32 + 'px')
                  .style('left', myPositions.x + marginLeft - 170 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 150 + 'px')
                  .style('left', myPositions.x + marginLeft - 185 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y - 120 + 'px')
                  .style('left', myPositions.x + marginLeft - 205 + 'px')
                break
              case 4:
                myPositions = printedPosFather[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/horizontal.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 200 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y - 32 + 'px')
                  .style('left', myPositions.x + marginLeft - 170 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 350 + 'px')
                  .style('left', myPositions.x + marginLeft - 185 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y - 340 + 'px')
                  .style('left', myPositions.x + marginLeft - 205 + 'px')
                break
            }
          } else {
            // other side
            console.log('other side')
            switch (printedRelative.position) {
              case 1:
                myPositions = printedPosFather[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/horizontal.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 100 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 'px')
                  .style('left', myPositions.x + marginLeft + 275 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y + 0 + 'px')
                  .style('left', myPositions.x + marginLeft + 295 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 260 + 'px')
                  .style('left', myPositions.x + marginLeft + 310 + 'px')
                break
              case 2:
                myPositions = printedPosFather[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/horizontal.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 100 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 'px')
                  .style('left', myPositions.x + marginLeft + 275 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y + 0 + 'px')
                  .style('left', myPositions.x + marginLeft + 295 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y + 50 + 'px')
                  .style('left', myPositions.x + marginLeft + 310 + 'px')
                break
              case 3:
                myPositions = printedPosFather[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/horizontal.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 100 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y - 37 + 'px')
                  .style('left', myPositions.x + marginLeft + 275 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 150 + 'px')
                  .style('left', myPositions.x + marginLeft + 295 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y - 120 + 'px')
                  .style('left', myPositions.x + marginLeft + 310 + 'px')
                break
              case 4:
                myPositions = printedPosFather[printedRelative.position - 1]

                myConnection.append('img')
                  .attr('src', '/img/connection/horizontal.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 20 + 'px')
                  .style('left', myPositions.x + marginLeft - 100 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-rb.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y - 37 + 'px')
                  .style('left', myPositions.x + marginLeft + 275 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/vertical.png')
                  .attr('class', 'vertical')
                  .style('top', myPositions.y - 350 + 'px')
                  .style('left', myPositions.x + marginLeft + 295 + 'px')
                myConnection.append('img')
                  .attr('src', '/img/connection/corner-lt.png')
                  .attr('class', 'corner')
                  .style('top', myPositions.y - 340 + 'px')
                  .style('left', myPositions.x + marginLeft + 310 + 'px')
                break
            }
          }

          break

        default:
          if (printedRelative.side === whichSide) {
            // same side
            console.log('same side')
            switch (whichSide) {
              case 'left':
                console.log('show connection on left side')
                switch (printedRelative.position) {
                  case 1:
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
                  case 2:
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
                      .style('top', myPositions.y + 150 + 'px')
                      .style('left', myPositions.x + marginLeft - 81 + 'px')
                    break
                  case 3:
                    myPositions = printedPosLeft[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 20 + 'px')
                      .style('left', myPositions.x + marginLeft - 100 + 'px')
                    break
                  case 4:
                    myPositions = printedPosLeft[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 30 + 'px')
                      .style('left', myPositions.x + marginLeft - 48 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 250 + 'px')
                      .style('left', myPositions.x + marginLeft - 63 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 240 + 'px')
                      .style('left', myPositions.x + marginLeft - 81 + 'px')
                    break
                  case 5:
                    myPositions = printedPosLeft[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 30 + 'px')
                      .style('left', myPositions.x + marginLeft - 48 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 400 + 'px')
                      .style('left', myPositions.x + marginLeft - 63 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 440 + 'px')
                      .style('left', myPositions.x + marginLeft - 81 + 'px')
                    break
                }

                break
              default:
                console.log('show connection default')
                switch (printedRelative.position) {
                  case 1:
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
                  case 2:
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
                      .style('top', myPositions.y + 150 + 'px')
                      .style('left', myPositions.x + marginLeft + 35 + 'px')
                    break
                  case 3:
                    myPositions = printedPosRight[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 20 + 'px')
                      .style('left', myPositions.x + marginLeft - 20 + 'px')
                    break
                  case 4:
                    myPositions = printedPosRight[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 40 + 'px')
                      .style('left', myPositions.x + marginLeft - 5 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 250 + 'px')
                      .style('left', myPositions.x + marginLeft + 14 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 240 + 'px')
                      .style('left', myPositions.x + marginLeft + 31 + 'px')
                    break
                  case 5:
                    myPositions = printedPosRight[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 40 + 'px')
                      .style('left', myPositions.x + marginLeft - 5 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 420 + 'px')
                      .style('left', myPositions.x + marginLeft + 14 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 440 + 'px')
                      .style('left', myPositions.x + marginLeft + 31 + 'px')
                    break
                }
                break
            }
          } else {
            // other side
            console.log('other side')
            switch (whichSide) {
              case 'left':
                console.log('show connection on left side')
                switch (printedRelative.position) {
                  case 1:
                    myPositions = printedPosLeftOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 5 + 'px')
                      .style('left', myPositions.x + marginLeft - 40 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y + 13 + 'px')
                      .style('left', myPositions.x + marginLeft - 430 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y + 32 + 'px')
                      .style('left', myPositions.x + marginLeft - 370 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y + 40 + 'px')
                      .style('left', myPositions.x + marginLeft - 386 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y + 280 + 'px')
                      .style('left', myPositions.x + marginLeft - 403 + 'px')
                    break
                  case 2:
                    myPositions = printedPosLeftOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 5 + 'px')
                      .style('left', myPositions.x + marginLeft - 40 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y + 13 + 'px')
                      .style('left', myPositions.x + marginLeft - 430 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y + 32 + 'px')
                      .style('left', myPositions.x + marginLeft - 370 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y + 40 + 'px')
                      .style('left', myPositions.x + marginLeft - 386 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y + 70 + 'px')
                      .style('left', myPositions.x + marginLeft - 403 + 'px')
                    break
                  case 3:
                    myPositions = printedPosLeftOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 9 + 'px')
                      .style('left', myPositions.x + marginLeft - 40 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y + 9 + 'px')
                      .style('left', myPositions.x + marginLeft - 430 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 3 + 'px')
                      .style('left', myPositions.x + marginLeft - 370 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 100 + 'px')
                      .style('left', myPositions.x + marginLeft - 386 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 100 + 'px')
                      .style('left', myPositions.x + marginLeft - 403 + 'px')
                    break
                  case 4:
                    myPositions = printedPosLeftOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 9 + 'px')
                      .style('left', myPositions.x + marginLeft - 40 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y + 9 + 'px')
                      .style('left', myPositions.x + marginLeft - 430 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 3 + 'px')
                      .style('left', myPositions.x + marginLeft - 370 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 320 + 'px')
                      .style('left', myPositions.x + marginLeft - 386 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 320 + 'px')
                      .style('left', myPositions.x + marginLeft - 403 + 'px')
                    break
                  case 5:
                    myPositions = printedPosLeftOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 15 + 'px')
                      .style('left', myPositions.x + marginLeft - 40 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 33 + 'px')
                      .style('left', myPositions.x + marginLeft - 430 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 45 + 'px')
                      .style('left', myPositions.x + marginLeft - 370 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 420 + 'px')
                      .style('left', myPositions.x + marginLeft - 386 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 360 + 'px')
                      .style('left', myPositions.x + marginLeft - 403 + 'px')
                    break
                }
                break
              default:
                console.log('show connection default')
                switch (printedRelative.position) {
                  case 1:
                    myPositions = printedPosRightOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 25 + 'px')
                      .style('left', myPositions.x + marginLeft + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 12 + 'px')
                      .style('left', myPositions.x + marginLeft - 0 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y + 6 + 'px')
                      .style('left', myPositions.x + marginLeft + 330 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y + 20 + 'px')
                      .style('left', myPositions.x + marginLeft + 348 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y + 280 + 'px')
                      .style('left', myPositions.x + marginLeft + 364 + 'px')
                    break
                  case 2:
                    myPositions = printedPosRightOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 25 + 'px')
                      .style('left', myPositions.x + marginLeft + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 12 + 'px')
                      .style('left', myPositions.x + marginLeft - 0 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y + 6 + 'px')
                      .style('left', myPositions.x + marginLeft + 330 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y + 20 + 'px')
                      .style('left', myPositions.x + marginLeft + 348 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y + 70 + 'px')
                      .style('left', myPositions.x + marginLeft + 364 + 'px')
                    break
                  case 3:
                    myPositions = printedPosRightOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 25 + 'px')
                      .style('left', myPositions.x + marginLeft + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 12 + 'px')
                      .style('left', myPositions.x + marginLeft - 0 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 30 + 'px')
                      .style('left', myPositions.x + marginLeft + 330 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 100 + 'px')
                      .style('left', myPositions.x + marginLeft + 348 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 100 + 'px')
                      .style('left', myPositions.x + marginLeft + 364 + 'px')
                    break
                  case 4:
                    myPositions = printedPosRightOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 25 + 'px')
                      .style('left', myPositions.x + marginLeft + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 12 + 'px')
                      .style('left', myPositions.x + marginLeft - 0 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 30 + 'px')
                      .style('left', myPositions.x + marginLeft + 330 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 320 + 'px')
                      .style('left', myPositions.x + marginLeft + 348 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 320 + 'px')
                      .style('left', myPositions.x + marginLeft + 364 + 'px')
                    break
                  case 5:
                    myPositions = printedPosRightOther[printedRelative.position - 1]

                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 40 + 'px')
                      .style('left', myPositions.x + marginLeft + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/horizontal.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 59 + 'px')
                      .style('left', myPositions.x + marginLeft - 0 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-rb.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 76 + 'px')
                      .style('left', myPositions.x + marginLeft + 330 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/vertical.png')
                      .attr('class', 'vertical')
                      .style('top', myPositions.y - 380 + 'px')
                      .style('left', myPositions.x + marginLeft + 348 + 'px')
                    myConnection.append('img')
                      .attr('src', '/img/connection/corner-lt.png')
                      .attr('class', 'corner')
                      .style('top', myPositions.y - 360 + 'px')
                      .style('left', myPositions.x + marginLeft + 364 + 'px')
                    break
                }
                break
            }
          }
          break
      }
      console.log(myPositions)

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
