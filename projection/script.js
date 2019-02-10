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

    d3.json('data/child-projection-data.json', function (data3) {
      var childData = data3

      // waiting for websocket call from client with side and personid
      var side = 'left'
      var personId = 37

      showData(side, personId)
      showData('right', 37)

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

        myDiv.selectAll('*').remove()

        switch (printedRelative.relation) {
          case 'father':
            if (printedRelative.side === whichSide) {
              // same side
              console.log('same side')
              switch (printedRelative.position) {
                case 1:
                  myPositions = printedPosFather[printedRelative.position - 1]

                  // TODO: open end right for horizontal shorts
                  myConnection.append('img')
                    .attr('src', '/img/connection/horizontal-short.png')
                    .attr('class', 'horizontal')
                    .style('top', myPositions.y - 20 + 'px')
                    .style('left', myPositions.x + marginLeft - 165 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-tl.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y + 'px')
                    .style('left', myPositions.x + marginLeft - 170 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/vertical-medium.png')
                    .attr('class', 'vertical')
                    .style('top', myPositions.y + 20 + 'px')
                    .style('left', myPositions.x + marginLeft - 189 + 'px')
                    .style('width', '49px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-br.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y + 260 + 'px')
                    .style('left', myPositions.x + marginLeft - 205.5 + 'px')
                  break
                case 2:
                  myPositions = printedPosFather[printedRelative.position - 1]

                  // TODO: open end right for horizontal short
                  myConnection.append('img')
                    .attr('src', '/img/connection/horizontal-short.png')
                    .attr('class', 'horizontal')
                    .style('top', myPositions.y - 20 + 'px')
                    .style('left', myPositions.x + marginLeft - 160 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-tl.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y + 'px')
                    .style('left', myPositions.x + marginLeft - 171 + 'px')
                  // TODO: shorter vertical short
                  myConnection.append('img')
                    .attr('src', '/img/connection/vertical-short.png')
                    .attr('class', 'vertical')
                    .style('top', myPositions.y + 8 + 'px')
                    .style('left', myPositions.x + marginLeft - 190 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-br.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y + 50 + 'px')
                    .style('left', myPositions.x + marginLeft - 205 + 'px')
                  break
                case 3:
                  myPositions = printedPosFather[printedRelative.position - 1]

                  // TODO: open end right for horizontal short
                  myConnection.append('img')
                    .attr('src', '/img/connection/horizontal-short.png')
                    .attr('class', 'horizontal')
                    .style('top', myPositions.y - 20 + 'px')
                    .style('left', myPositions.x + marginLeft - 155 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-bl.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y - 36 + 'px')
                    .style('left', myPositions.x + marginLeft - 170 + 'px')
                  // TODO: shorter vertical short
                  myConnection.append('img')
                    .attr('src', '/img/connection/vertical-short.png')
                    .attr('class', 'vertical')
                    .style('top', myPositions.y - 118 + 'px')
                    .style('left', myPositions.x + marginLeft - 189 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-tr.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y - 120 + 'px')
                    .style('left', myPositions.x + marginLeft - 205 + 'px')
                  break
                case 4:
                  myPositions = printedPosFather[printedRelative.position - 1]

                  // TODO: open end right for horizontal short
                  myConnection.append('img')
                    .attr('src', '/img/connection/horizontal-short.png')
                    .attr('class', 'horizontal')
                    .style('top', myPositions.y - 20 + 'px')
                    .style('left', myPositions.x + marginLeft - 150 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-bl.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y - 36 + 'px')
                    .style('left', myPositions.x + marginLeft - 170 + 'px')
                  // TODO: longer vertical medium
                  myConnection.append('img')
                    .attr('src', '/img/connection/vertical-medium.png')
                    .attr('class', 'vertical')
                    .style('top', myPositions.y - 320 + 'px')
                    .style('left', myPositions.x + marginLeft - 190 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-tr.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y - 340 + 'px')
                    .style('left', myPositions.x + marginLeft - 206 + 'px')
                  break
              }
            } else {
              // other side
              console.log('other side')
              switch (printedRelative.position) {
                case 1:
                  myPositions = printedPosFather[printedRelative.position - 1]
                  // TODO: open end left for horizontal medium
                  myConnection.append('img')
                    .attr('src', '/img/connection/horizontal-medium.png')
                    .attr('class', 'horizontal')
                    .style('top', myPositions.y - 20 + 'px')
                    .style('left', myPositions.x + marginLeft + 35 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-tr.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y + 'px')
                    .style('left', myPositions.x + marginLeft + 275 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/vertical-medium.png')
                    .attr('class', 'vertical')
                    .style('top', myPositions.y + 15 + 'px')
                    .style('left', myPositions.x + marginLeft + 291 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-bl.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y + 260 + 'px')
                    .style('left', myPositions.x + marginLeft + 311 + 'px')
                  break
                case 2:
                  myPositions = printedPosFather[printedRelative.position - 1]

                  // TODO: open end left for horizontal medium & longer horizontal medium
                  myConnection.append('img')
                    .attr('src', '/img/connection/horizontal-medium.png')
                    .attr('class', 'horizontal')
                    .style('top', myPositions.y - 20 + 'px')
                    .style('left', myPositions.x + marginLeft + 20 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-tr.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y - 0 + 'px')
                    .style('left', myPositions.x + marginLeft + 275 + 'px')
                  // TODO: shorter vertical short
                  myConnection.append('img')
                    .attr('src', '/img/connection/vertical-short.png')
                    .attr('class', 'vertical')
                    .style('top', myPositions.y + 0 + 'px')
                    .style('left', myPositions.x + marginLeft + 290 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-bl.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y + 50 + 'px')
                    .style('left', myPositions.x + marginLeft + 310 + 'px')
                  break
                case 3:
                  myPositions = printedPosFather[printedRelative.position - 1]

                  // TODO open end left for horizontal medium, longer horizontal medium
                  myConnection.append('img')
                    .attr('src', '/img/connection/horizontal-medium.png')
                    .attr('class', 'horizontal')
                    .style('top', myPositions.y - 20 + 'px')
                    .style('left', myPositions.x + marginLeft + 60 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-br.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y - 35 + 'px')
                    .style('left', myPositions.x + marginLeft + 275 + 'px')
                  // shorter vertical short
                  myConnection.append('img')
                    .attr('src', '/img/connection/vertical-short.png')
                    .attr('class', 'vertical')
                    .style('top', myPositions.y - 130 + 'px')
                    .style('left', myPositions.x + marginLeft + 291 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-tl.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y - 120 + 'px')
                    .style('left', myPositions.x + marginLeft + 310 + 'px')
                  break
                case 4:
                  myPositions = printedPosFather[printedRelative.position - 1]

                  // TODO: open end left for horizontal medium & longer horizontal medium
                  myConnection.append('img')
                    .attr('src', '/img/connection/horizontal-medium.png')
                    .attr('class', 'horizontal')
                    .style('top', myPositions.y - 20 + 'px')
                    .style('left', myPositions.x + marginLeft + 50 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-br.png')
                    .attr('class', 'corner')
                    .style('top', myPositions.y - 35 + 'px')
                    .style('left', myPositions.x + marginLeft + 275 + 'px')
                  // TODO: longer vertical medium
                  myConnection.append('img')
                    .attr('src', '/img/connection/vertical-medium.png')
                    .attr('class', 'vertical')
                    .style('top', myPositions.y - 360 + 'px')
                    .style('left', myPositions.x + marginLeft + 290 + 'px')
                  myConnection.append('img')
                    .attr('src', '/img/connection/corner-tl.png')
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
                        .attr('src', '/img/connection/vertical-long.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 20 + 'px')
                        .style('left', myPositions.x + marginLeft - 61 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 'px')
                        .style('left', myPositions.x + marginLeft - 45 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 365 + 'px')
                        .style('left', myPositions.x + marginLeft - 79 + 'px')
                      break
                    case 2:
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-short.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 32 + 'px')
                        .style('left', myPositions.x + marginLeft - 66 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 'px')
                        .style('left', myPositions.x + marginLeft - 47 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 150 + 'px')
                        .style('left', myPositions.x + marginLeft - 82 + 'px')
                      break
                    case 3:
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      // TODO: open end for horizontal short
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-short.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y - 20 + 'px')
                        .style('left', myPositions.x + marginLeft - 125 + 'px')
                      break
                    case 4:
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 30 + 'px')
                        .style('left', myPositions.x + marginLeft - 48 + 'px')

                      // TODO: longer vertical short
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-short.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 250 + 'px')
                        .style('left', myPositions.x + marginLeft - 67 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 240 + 'px')
                        .style('left', myPositions.x + marginLeft - 83 + 'px')
                      break
                    case 5:
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 30 + 'px')
                        .style('left', myPositions.x + marginLeft - 46 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-long.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 402 + 'px')
                        .style('left', myPositions.x + marginLeft - 62 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
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
                        .attr('src', '/img/connection/vertical-long.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 20 + 'px')
                        .style('left', myPositions.x + marginLeft + 17 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 'px')
                        .style('left', myPositions.x + marginLeft - 2 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 365 + 'px')
                        .style('left', myPositions.x + marginLeft + 33 + 'px')
                      break
                    case 2:
                      myPositions = printedPosRight[printedRelative.position - 1]

                      // TODO: longer vertical short
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-short.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 15 + 'px')
                        .style('left', myPositions.x + marginLeft + 11 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 20 + 'px')
                        .style('left', myPositions.x + marginLeft - 5 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 150 + 'px')
                        .style('left', myPositions.x + marginLeft + 30 + 'px')
                      break
                    case 3:
                      myPositions = printedPosRight[printedRelative.position - 1]

                      // TODO: open end left for horizontal short
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-short.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y - 25 + 'px')
                        .style('left', myPositions.x + marginLeft - 10 + 'px')
                      break
                    case 4:
                      myPositions = printedPosRight[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 40 + 'px')
                        .style('left', myPositions.x + marginLeft - 5 + 'px')

                      // TODO: longer vertical short
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-short.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 250 + 'px')
                        .style('left', myPositions.x + marginLeft + 11 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 240 + 'px')
                        .style('left', myPositions.x + marginLeft + 30 + 'px')
                      break
                    case 5:
                      myPositions = printedPosRight[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 40 + 'px')
                        .style('left', myPositions.x + marginLeft - 8 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-long.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 412 + 'px')
                        .style('left', myPositions.x + marginLeft + 11 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 440 + 'px')
                        .style('left', myPositions.x + marginLeft + 27 + 'px')
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
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 5 + 'px')
                        .style('left', myPositions.x + marginLeft - 40 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-long.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 13 + 'px')
                        .style('left', myPositions.x + marginLeft - 430 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 32 + 'px')
                        .style('left', myPositions.x + marginLeft - 370 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-long.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 40 + 'px')
                        .style('left', myPositions.x + marginLeft - 386 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 280 + 'px')
                        .style('left', myPositions.x + marginLeft - 403 + 'px')
                      break
                    case 2:
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      // TODO: longer corner-br on top
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 5 + 'px')
                        .style('left', myPositions.x + marginLeft - 40 + 'px')
                      // TODO: longer horizontal-medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-medium.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y + 10 + 'px')
                        .style('left', myPositions.x + marginLeft - 350 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 29 + 'px')
                        .style('left', myPositions.x + marginLeft - 370 + 'px')
                      /* myConnection.append('img')
                        .attr('src', '/img/connection/vertical-long.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 40 + 'px')
                        .style('left', myPositions.x + marginLeft - 386 + 'px') */
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 70 + 'px')
                        .style('left', myPositions.x + marginLeft - 405 + 'px')
                      break
                    case 3:
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      // TODO: longer corner-br on top
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 9 + 'px')
                        .style('left', myPositions.x + marginLeft - 40 + 'px')
                      // TODO: longer horizontal-medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-medium.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y + 6 + 'px')
                        .style('left', myPositions.x + marginLeft - 330 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 10 + 'px')
                        .style('left', myPositions.x + marginLeft - 370 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-short.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 98 + 'px')
                        .style('left', myPositions.x + marginLeft - 389 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 100 + 'px')
                        .style('left', myPositions.x + marginLeft - 405 + 'px')
                      break
                    case 4:
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 9 + 'px')
                        .style('left', myPositions.x + marginLeft - 40 + 'px')
                      // TODO: longer horizontal medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-medium.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y + 6 + 'px')
                        .style('left', myPositions.x + marginLeft - 430 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 10 + 'px')
                        .style('left', myPositions.x + marginLeft - 370 + 'px')
                      // TODO: longer vertical medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-medium.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 320 + 'px')
                        .style('left', myPositions.x + marginLeft - 389 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 320 + 'px')
                        .style('left', myPositions.x + marginLeft - 405 + 'px')
                      break
                    case 5:
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      // TODO: shorter corner-tr bottom
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 15 + 'px')
                        .style('left', myPositions.x + marginLeft - 40 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-medium.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y - 35 + 'px')
                        .style('left', myPositions.x + marginLeft - 380 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 51 + 'px')
                        .style('left', myPositions.x + marginLeft - 370 + 'px')
                      // TODO: longer vertical medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-medium.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 325 + 'px')
                        .style('left', myPositions.x + marginLeft - 390 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 360 + 'px')
                        .style('left', myPositions.x + marginLeft - 406 + 'px')
                      break
                  }
                  break
                default:
                  console.log('show connection default')
                  switch (printedRelative.position) {
                    case 1:
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 25 + 'px')
                        .style('left', myPositions.x + marginLeft + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-long.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 12 + 'px')
                        .style('left', myPositions.x + marginLeft - 0 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 6 + 'px')
                        .style('left', myPositions.x + marginLeft + 330 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/verticalv.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 20 + 'px')
                        .style('left', myPositions.x + marginLeft + 348 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 280 + 'px')
                        .style('left', myPositions.x + marginLeft + 364 + 'px')
                      break
                    case 2:
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      // TODO: shorten top of corner-bl 
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 25 + 'px')
                        .style('left', myPositions.x + marginLeft + 'px')
                      // TODO: longer medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-medium.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y - 9 + 'px')
                        .style('left', myPositions.x + marginLeft + 80 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tr.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 11 + 'px')
                        .style('left', myPositions.x + marginLeft + 330 + 'px')
                      // TODO: shorter short
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-short.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y + 0 + 'px')
                        .style('left', myPositions.x + marginLeft + 346 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y + 70 + 'px')
                        .style('left', myPositions.x + marginLeft + 365 + 'px')
                      break
                    case 3:
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      // TODO: shorter corner-bl on top
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 25 + 'px')
                        .style('left', myPositions.x + marginLeft + 'px')
                      // TODO: longer horizontal medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-medium.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y - 9 + 'px')
                        .style('left', myPositions.x + marginLeft + 100 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 24 + 'px')
                        .style('left', myPositions.x + marginLeft + 330 + 'px')

                      // TODO: shorter vertical short
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-short.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 90 + 'px')
                        .style('left', myPositions.x + marginLeft + 346 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 100 + 'px')
                        .style('left', myPositions.x + marginLeft + 365 + 'px')
                      break
                    case 4:
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      // TODO: shorter corner-bl on top
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-bl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 25 + 'px')
                        .style('left', myPositions.x + marginLeft + 'px')
                      // TODO: longer horizontal medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-medium.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y - 9 + 'px')
                        .style('left', myPositions.x + marginLeft + 90 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 24 + 'px')
                        .style('left', myPositions.x + marginLeft + 330 + 'px')
                      // TODO: longer vertical medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-medium.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 310 + 'px')
                        .style('left', myPositions.x + marginLeft + 345 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 320 + 'px')
                        .style('left', myPositions.x + marginLeft + 364 + 'px')
                      break
                    case 5:
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 40 + 'px')
                        .style('left', myPositions.x + marginLeft + 'px')
                      // TODO: longer horizontal medium
                      myConnection.append('img')
                        .attr('src', '/img/connection/horizontal-medium.png')
                        .attr('class', 'horizontal')
                        .style('top', myPositions.y - 59 + 'px')
                        .style('left', myPositions.x + marginLeft + 80 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-br.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 74 + 'px')
                        .style('left', myPositions.x + marginLeft + 330 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/vertical-medium.png')
                        .attr('class', 'vertical')
                        .style('top', myPositions.y - 320 + 'px')
                        .style('left', myPositions.x + marginLeft + 346 + 'px')
                      myConnection.append('img')
                        .attr('src', '/img/connection/corner-tl.png')
                        .attr('class', 'corner')
                        .style('top', myPositions.y - 360 + 'px')
                        .style('left', myPositions.x + marginLeft + 366 + 'px')
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

        var bornDiv = infoDiv.append('div')
        bornDiv.append('img').attr('src', 'img/icon/star.svg').attr('class', 'born')
        bornDiv.append('p').text(getTimeString(myPerson, 'born'))

        var diedDiv = infoDiv.append('div')
        diedDiv.append('img').attr('src', 'img/icon/cross.svg').attr('class', 'died')
        diedDiv.append('p').text(getTimeString(myPerson, 'died'))

        info.append('img').attr('src', '/img/' + myPerson.img + '.png')
        info.append('img')
          .attr('src', '/img/connection/circle-flower-p.png')
          .attr('class', 'circle')

        showRelations(children, myPerson, whichSide)
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

      function getTimeString (myPerson, type) {
        var timeString = ''

        if (type === 'born') {
          if (myPerson.bornGuessed) {
            timeString += '~ '
          }
          timeString += myPerson.born
        } else {
          if (myPerson.diedGuessed) {
            timeString += '~ '
          }
          timeString += myPerson.died
        }
        return timeString
      }

      function showRelations (children, person, whichSide) {
        var childItem
        childData.some(item => {
          if (item.id === person.id) {
            childItem = item
          }
        })

        var div = children.append('div').attr('class', 'template' + childItem.template)
        if (typeof childItem.spouse !== 'undefined') {
          childItem.spouse.forEach((spouse, index) => {
            var divRelation = div.append('div').attr('class', 'relation relation' + (index + 1))

            var spouseImg, spouseName
            if (spouse.id === 0) {
              spouseImg = spouse.img
              spouseName = spouse.name
            } else {
              getPersonById(spouse.id)
              spouseImg = myPerson.img
              spouseName = myPerson.name
            }
            var divSpouse = divRelation.append('div').attr('class', 'spouse')

            if (whichSide === 'left') {
              divSpouse.append('img')
                .attr('src', '/img/connection/marriage-left.png')
                .attr('class', 'marriage')
            } else {
              divSpouse.append('img')
                .attr('src', '/img/connection/marriage.png')
                .attr('class', 'marriage')
            }

            divSpouse.append('img')
              .attr('src', function () {
                return 'img/' + spouseImg + '.png'
              })
              .attr('class', 'spouse spouse' + (index + 1))
            divSpouse.append('img')
              .attr('src', '/img/connection/circle-1.png')
              .attr('class', 'circle')
            divSpouse.append('h2')
              .text(spouseName)

            if (typeof spouse.children !== 'undefined') {
              spouse.children.forEach((child, index) => {
                var childImg
                var childName
                if (child.id === 0) {
                  childImg = child.img
                  childName = child.name
                } else {
                  getPersonById(child.id)
                  childImg = myPerson.img
                  childName = myPerson.name
                }

                var divChild = divRelation.append('div').attr('class', 'child')
                divChild.append('img')
                  .attr('src', function () {
                    return 'img/' + childImg + '.png'
                  })
                  .attr('class', 'child child' + (index + 1))
                divChild.append('img')
                  .attr('src', '/img/connection/circle-2.png')
                  .attr('class', 'circle')
                divChild.append('h2')
                  .text(childName)
              })
            } else {
              divSpouse.append('p')
                .text('keine Kinder | no children')
            }
          })
        } else {
          div.append('p')
            .text('nicht verheiratet, keine Kinder | not married, no children')
        }
      }
    })
  })
})
