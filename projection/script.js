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
      var personId = 1
      var transitionDuration = 3000
      /*
      socket.on('updateProjection', function (data) {
        console.log('data in')
        console.log(data)
        showData(data.device, data.data)
      })
      */
      showData(side, personId)
      showData('right', 1)

      function showData (whichSide, whichPersonId) {
        console.log('hallo')
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

        // remove everything which is in the divs
        myDiv.selectAll('*')
          .style('opacity', 1).transition().duration(transitionDuration).style('opacity', 0)
          .remove()
        myConnection.selectAll('*')
          .style('opacity', 1).transition().duration(transitionDuration).style('opacity', 0)
          .remove()

        switch (printedRelative.relation) {
          case 'father':
            if (printedRelative.side === whichSide) {
              // same side
              console.log('same side')
              switch (printedRelative.position) {
                case 1:
                  // Adalbert left
                  myPositions = printedPosFather[printedRelative.position - 1]

                  myConnection.append('img')
                    .attr('src', '/img/connection/left_child/left_child1.png')
                    .attr('class', 'liane')
                    .style('top', myPositions.y + 0 + 'px')
                    .style('left', myPositions.x + marginLeft - 245 + 'px')
                    .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                  break
                case 2:
                  // Richardis
                  myPositions = printedPosFather[printedRelative.position - 1]

                  myConnection.append('img')
                    .attr('src', '/img/connection/left_child/left_child2.png')
                    .attr('class', 'liane')
                    .style('top', myPositions.y - 10 + 'px')
                    .style('left', myPositions.x + marginLeft - 235 + 'px')
                    .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                  break
                case 3:
                  // Friedrich I.
                  myPositions = printedPosFather[printedRelative.position - 1]

                  myConnection.append('img')
                    .attr('src', '/img/connection/left_child/left_child3.png')
                    .attr('class', 'liane')
                    .style('top', myPositions.y - 120 + 'px')
                    .style('left', myPositions.x + marginLeft - 250 + 'px')
                    .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                  break
                case 4:
                  // Agnes
                  myPositions = printedPosFather[printedRelative.position - 1]

                  myConnection.append('img')
                    .attr('src', '/img/connection/left_child/left_child4.png')
                    .attr('class', 'liane')
                    .style('top', myPositions.y - 330 + 'px')
                    .style('left', myPositions.x + marginLeft - 245 + 'px')
                    .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                  break
              }
            } else {
              // other side
              console.log('other side')
              switch (printedRelative.position) {
                case 1:
                  // Adalbert
                  myPositions = printedPosFather[printedRelative.position - 1]
                  myConnection.append('img')
                    .attr('src', '/img/connection/right_child/right_child1.png')
                    .attr('class', 'liane')
                    .style('top', myPositions.y - 0 + 'px')
                    .style('left', myPositions.x + marginLeft - 60 + 'px')
                    .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                  break
                case 2:
                  // Richardis
                  myPositions = printedPosFather[printedRelative.position - 1]
                  myConnection.append('img')
                    .attr('src', '/img/connection/right_child/right_child2.png')
                    .attr('class', 'liane')
                    .style('top', myPositions.y - 10 + 'px')
                    .style('left', myPositions.x + marginLeft - 60 + 'px')
                    .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                  break
                case 3:
                  // Friedrich I.
                  myPositions = printedPosFather[printedRelative.position - 1]

                  myConnection.append('img')
                    .attr('src', '/img/connection/right_child/right_child3.png')
                    .attr('class', 'liane')
                    .style('top', myPositions.y - 113 + 'px')
                    .style('left', myPositions.x + marginLeft - 55 + 'px')
                    .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                  break
                case 4:
                  // Agnes
                  myPositions = printedPosFather[printedRelative.position - 1]

                  // TODO: open end left for horizontal medium & longer horizontal medium
                  myConnection.append('img')
                    .attr('src', '/img/connection/right_child/right_child4.png')
                    .attr('class', 'liane')
                    .style('top', myPositions.y - 326 + 'px')
                    .style('left', myPositions.x + marginLeft - 50 + 'px')
                    .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
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
                      // Leopold III. left
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left/left1.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y + 0 + 'px')
                        .style('left', myPositions.x + marginLeft - 61 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 2:
                      // Heinrich II.
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left/left2.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 10 + 'px')
                        .style('left', myPositions.x + marginLeft - 61 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 3:
                      // Leopold V
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      // TODO: open end for horizontal short
                      myConnection.append('img')
                        .attr('src', '/img/connection/left/left3.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 30 + 'px')
                        .style('left', myPositions.x + marginLeft - 61 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 4:
                      // Leopold VI.
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left/left4.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 250 + 'px')
                        .style('left', myPositions.x + marginLeft - 57 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 5:
                      // Friedrich II.
                      myPositions = printedPosLeft[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left/left5.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 450 + 'px')
                        .style('left', myPositions.x + marginLeft - 52 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                  }

                  break
                default:
                  console.log('show connection default')
                  switch (printedRelative.position) {
                    case 1:
                      // Agnes
                      myPositions = printedPosRight[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/right/right1.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y + 10 + 'px')
                        .style('left', myPositions.x + marginLeft - 83 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 2:
                      // Gertrud
                      myPositions = printedPosRight[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/right/right2.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y + 0 + 'px')
                        .style('left', myPositions.x + marginLeft - 83 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 3:
                      // Helena
                      myPositions = printedPosRight[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/right/right3.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 10 + 'px')
                        .style('left', myPositions.x + marginLeft - 78 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 4:
                      // Theodora
                      myPositions = printedPosRight[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/right/right4.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 240 + 'px')
                        .style('left', myPositions.x + marginLeft - 80 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 5:
                      // Eudokia
                      myPositions = printedPosRight[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/right/right5.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 440 + 'px')
                        .style('left', myPositions.x + marginLeft - 80 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
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
                      // Agnes
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left_opposite/left_opposite1.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 15 + 'px')
                        .style('left', myPositions.x + marginLeft - 380 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 2:
                      // Gertrud
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left_opposite/left_opposite2.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 20 + 'px')
                        .style('left', myPositions.x + marginLeft - 380 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 3:
                      // Helena
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left_opposite/left_opposite3.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 90 + 'px')
                        .style('left', myPositions.x + marginLeft - 380 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 4:
                      // Theodora
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left_opposite/left_opposite4.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 315 + 'px')
                        .style('left', myPositions.x + marginLeft - 380 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 5:
                      // Eudokia
                      myPositions = printedPosLeftOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/left_opposite/left_opposite5.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 366 + 'px')
                        .style('left', myPositions.x + marginLeft - 380 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                  }
                  break
                default:
                  console.log('show connection default')
                  switch (printedRelative.position) {
                    case 1:
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      // Leopold III
                      myConnection.append('img')
                        .attr('src', '/img/connection/right_opposite/right_opposite1.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 5 + 'px')
                        .style('left', myPositions.x + marginLeft - 2 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 2:
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      // Heinrich II.
                      myConnection.append('img')
                        .attr('src', '/img/connection/right_opposite/right_opposite2.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 5 + 'px')
                        .style('left', myPositions.x + marginLeft + 0 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 3:
                      // Leopold V.
                      myPositions = printedPosRightOther[printedRelative.position - 1]
                      myConnection.append('img')
                        .attr('src', '/img/connection/right_opposite/right_opposite3.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 60 + 'px')
                        .style('left', myPositions.x + marginLeft + 0 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 4:
                    // Leopold VI.
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/right_opposite/right_opposite4.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 295 + 'px')
                        .style('left', myPositions.x + marginLeft + 10 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                      break
                    case 5:
                      // Friedrich II.
                      myPositions = printedPosRightOther[printedRelative.position - 1]

                      myConnection.append('img')
                        .attr('src', '/img/connection/right_opposite/right_opposite5.png')
                        .attr('class', 'liane')
                        .style('top', myPositions.y - 350 + 'px')
                        .style('left', myPositions.x + marginLeft + 0 + 'px')
                        .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
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

        var infoDiv = info.append('div')

        infoDiv.attr('class', 'banner')
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

        infoDiv.append('h1').text(myPerson.name)
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

        var bornDiv = infoDiv.append('div')
        bornDiv.append('img').attr('src', 'img/icon/star.svg').attr('class', 'born')
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
        bornDiv.append('p').text(getTimeString(myPerson, 'born'))
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

        var diedDiv = infoDiv.append('div')
        diedDiv.append('img').attr('src', 'img/icon/cross.svg').attr('class', 'died')
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
        diedDiv.append('p').text(getTimeString(myPerson, 'died'))
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

        info.append('img').attr('src', '/img/' + myPerson.img + '.png')
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
        info.append('img')
          .attr('src', '/img/connection/circle-flower-p.png')
          .attr('class', 'circle')
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

        // if death until 1156 than map1156, if death > 1156 than map1246
        // side left or right
        var mapToShow
        if (myPerson.died <= 1156) {
          mapToShow = 'map1156'
        } else {
          mapToShow = 'map1246'
        }

        map.append('h1').text('Politischer Machtbereich der Babenberger | Political power of the Babenberg')
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
        map.append('img')
          .attr('src', '/img/maps/' + mapToShow + whichSide + '.png') // todo add side
          .attr('class', 'mapimg')
          .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

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
          if (myPerson.bornGuessed) {
            timeString += ' ?'
          }
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
            var divRelation = div.append('div')
            divRelation.attr('class', 'relation relation' + (index + 1))
              .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

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
                .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
            } else {
              divSpouse.append('img')
                .attr('src', '/img/connection/marriage.png')
                .attr('class', 'marriage')
                .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
            }

            divSpouse.append('img')
              .attr('src', function () {
                return 'img/' + spouseImg + '.png'
              })
              .attr('class', 'spouse spouse' + (index + 1))
              .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
            divSpouse.append('img')
              .attr('src', '/img/connection/circle-1.png')
              .attr('class', 'circle')
              .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
            divSpouse.append('h2')
              .text(spouseName)
              .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

            if (typeof spouse.children !== 'undefined') {
              var childappend = divRelation
              if (childItem.template === 8 || childItem.template === 7 || childItem.template === 6 || childItem.template === 5) {
                childappend = divRelation.append('div')
                childappend.attr('class', 'children' + childItem.template)
                  .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
              }

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

                var divChild = childappend.append('div').attr('class', 'child')
                divChild.append('img')
                  .attr('src', function () {
                    return 'img/' + childImg + '.png'
                  })
                  .attr('class', 'child child' + (index + 1))
                  .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)

                divChild.append('img')
                  .attr('src', '/img/connection/circle-2.png')
                  .attr('class', 'circle')
                  .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
                divChild.append('h2')
                  .text(childName)
                  .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
              })
            } else {
              divSpouse.append('p')
                .text('keine Kinder | no children')
                .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
            }
          })
        } else {
          div.append('p')
            .text('nicht verheiratet, keine Kinder | not married, no children')
            .style('opacity', 0).transition().duration(transitionDuration).style('opacity', 1)
        }
      }
    })
  })
})
