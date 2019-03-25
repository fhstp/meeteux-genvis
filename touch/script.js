'use strict'

var d3, io, localStorage, interactionTimeout, overlayTimeout

var isLocalUser = false
var isGodUser = false
// var socket = io('http://192.168.178.28:8100/')
var socket = io('http://localhost:8181/')
var whichside = 'left' // 'right'
var clickTrue = true
var setTimerTime = 30 // 30 seconds after each touch interaction
var setTimeEnd = 15 // 15 seconds for last call
var isStartOn = true

d3.selection.prototype.dblTap = function (callback) {
  var last = 0
  return this.each(function () {
    d3.select(this).on('touchstart', function (e) {
      if ((d3.event.timeStamp - last) < 500) {
        return callback(e)
      }
      last = d3.event.timeStamp
    })
  })
}

socket.emit('connectTouch', { device: whichside })

socket.on('connectTouchResult', function (data) {
  console.log('connection: ' + data)
  // Load Genealogy Datass
  d3.json('/data/genealogy-data.json', function (data1) {
    var persons = data1

    // load Coat of Arms Data
    d3.json('/data/coat-of-arms.json', function (data2) {
      var coatOfArms = data2

      // var interpolateTypes = [d3.curveLinear, d3.curveNatural, d3.curveStep, d3.curveBasis, d3.curveBundle, d3.curveCardinal];
      var stringDates = ['1060', '1280']
      var parseDate = d3.timeParse('%Y')

      // set dynamic height of divs
      var screenHeight = window.screen.height
      var div1Height = screenHeight / 100 * 32
      var div2Height = screenHeight - div1Height

      d3.select('#info').attr('style', 'height: ' + div1Height + 'px')
      d3.select('#chart').attr('style', 'height: ' + div2Height + 'px')

      // set svg size
      var svgHeight = 3100
      var svgWidth = 8000
      // Determines how far the scroll bar should be from the top
      var scrollOffset = 0

      var x = d3.scaleTime()
        .domain(d3.extent(stringDates, function (d) { return parseDate(d) }))
        .range([0, svgWidth])

      // get the x-coordinates depending on year
      var whichX = d3.scaleLinear()
        .domain([1060, 1280]) // min and max year of data set
        .range([0, svgWidth]) // min and max of svg

      var whichLanguage = localStorage.getItem('language')

      var personArray = []
      var personInfoArray = []
      var itterator = 0
      var marriageCount = 1

      var strokeWidth = 40
      var startY = strokeWidth + 40
      var marriageXDiff = strokeWidth
      var marriageYDiff = strokeWidth / 3
      var yDiff = 2.2 * strokeWidth

      var childArray = []
      var showChildArray = []
      var isChild = false
      // var isFather
      var fatherArray = []

      persons.forEach((person) => {
        isMarried(person)
      })

      function isMarried (person) {
        if (typeof person.marriages !== 'undefined') {
          if (typeof person.marriages[0].children !== 'undefined') {
            // console.log('Father');
          }

          marriageCount = 1
          pushInArray(person, 'married')

          person.marriages.forEach((marriage) => {
            pushInArray(marriage.spouse, 'spouse')

            if (typeof marriage.children !== 'undefined') {
              childArray.push(marriage)
            } else {
              // console.log('keine Kinder')
            }
          })

          childArray.forEach(spouse => {
            childArray = []

            spouse.children.forEach(child => {
              isChild = true
              isMarried(child)
            })
          })
        } else {
          // console.log('nicht verheiratet')
          pushInArray(person, 'child')
        }
      }

      function pushInArray (person, type) {
        // x1 - x-Child  y1 - middle of Father/Mother y3
        // x2 - x-Child  y2 - y1 child
        if (isChild) {
          // console.log('ist Kind')
          isChild = false
          getFatherById(person.father)
          var fatherY = getFatherY(father)
          showChildArray.push([{ x: whichX(person.born), y: fatherY + 50, gender: person.gender, id: person.id },
            { x: whichX(person.born), y: startY - strokeWidth + 10 }])
        }

        switch (type) {
          case 'child':
            personArray[itterator] = [
              { x: whichX(person.born), y: startY, gender: person.gender, id: person.id, bornGuessed: person.bornGuessed },
              { x: whichX(person.died), y: startY, diedGuessed: person.diedGuessed }
            ]
            setPersonInfoArray(itterator, person, startY)

            startY += yDiff
            itterator++
            break

          case 'spouse':
            var marriageX1 = whichX(person.marriage) - marriageXDiff
            var marriageX2 = whichX(person.marriage)
            var marriageY = startY - marriageYDiff - yDiff * (marriageCount - 1)

            personArray[itterator] = [
              { x: whichX(person.born), y: startY, gender: person.gender, id: person.id, bornGuessed: person.bornGuessed }, // born
              { x: marriageX1, y: startY, marriageGuessed: person.marriageGuessed }, // marriage 1
              { x: marriageX2, y: marriageY } // marriage 2
            ]

            if (typeof person.divorce !== 'undefined') {
              var divorceX1 = whichX(person.divorce)
              var divorceX2 = whichX(person.divorce) + marriageXDiff
              var divorceY = startY + marriageYDiff + strokeWidth

              personArray[itterator].push({ x: divorceX1, y: marriageY, divorceGuessed: person.divorceGuessed })
              personArray[itterator].push({ x: divorceX2, y: divorceY })
              personArray[itterator].push({ x: whichX(person.died), y: divorceY, diedGuessed: person.diedGuessed })
            } else {
              personArray[itterator].push({ x: whichX(person.died), y: marriageY, diedGuessed: person.diedGuessed })
            }

            setPersonInfoArray(itterator, person, startY, marriageY)

            startY += yDiff
            itterator++
            marriageCount++
            break

          default:
            // console.log('default')
            marriageX1 = whichX(person.marriages[marriageCount - 1].spouse.marriage) - marriageXDiff
            marriageX2 = whichX(person.marriages[marriageCount - 1].spouse.marriage)
            marriageY = startY + marriageYDiff

            fatherArray.push({ y: marriageY, id: person.id })

            personArray[itterator] = [
              { x: whichX(person.born), y: startY, gender: person.gender, id: person.id, bornGuessed: person.bornGuessed },
              { x: marriageX1, y: startY, marriageGuessed: person.marriageGuessed }, // marriage 1
              { x: marriageX2, y: marriageY }, // marriage 2
              { x: whichX(person.died), y: marriageY, diedGuessed: person.diedGuessed }
            ]

            setPersonInfoArray(itterator, person, startY, marriageY)
            startY += yDiff
            itterator++
            break
        }
      }
      var father
      var myId

      function getFatherById (myIdF) {
        myId = myIdF
        // console.log('search ' + myId)
        persons.forEach(person => {
          getFatherByIdRecursive(person)
        })
      }

      function getFatherByIdRecursive (person) {
        if (person.id === myId) {
          father = person
        }
        if (typeof person.marriages !== 'undefined') {
          person.marriages.forEach(marriage => {
            if (typeof marriage.children !== 'undefined') {
              marriage.children.forEach(child => {
                if (child.id === myId) {
                  father = child
                } else {
                  getFatherByIdRecursive(child)
                }
              })
            }
          })
        }
      }

      function getFatherY (fatherSample) {
        var fatherY = ''
        fatherArray.forEach(father => {
          if (father.id === fatherSample.id) {
            fatherY = father.y
          }
        })
        return fatherY
      }

      function setPersonInfoArray (itterartor, person, startY, endY) {
        personInfoArray[itterator] = {
          name: person.name,
          gender: person.gender,
          desc: person.desc,
          descen: person.descen,
          img: person.img,
          id: person.id,
          coa: person.coa,
          title: person.title,
          bornx: whichX(person.born),
          diedx: whichX(person.died),
          y: startY,
          marriagex: whichX(person.marriage),
          marriagey: endY
        }
      }

      var svg = d3.select('#chart').append('svg')
        .attr('height', svgHeight + 'px')
        .attr('width', svgWidth + 'px')

      // Define linear gradients for guessed data
      var svgDefs = svg.append('defs')

      var bornGuessedGradient = svgDefs.append('linearGradient')
        .attr('id', 'bornGuessed')
      bornGuessedGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')
      bornGuessedGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '0.8')
      var bornGuessedHighlightGradient = svgDefs.append('linearGradient')
        .attr('id', 'bornGuessedHighlight')
      bornGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')
      bornGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '0.8')

      var bornGuessedWomanGradient = svgDefs.append('linearGradient')
        .attr('id', 'bornGuessedWoman')
      bornGuessedWomanGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')
      bornGuessedWomanGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '0.8')
      var bornGuessedWomanHighlightGradient = svgDefs.append('linearGradient')
        .attr('id', 'bornGuessedWomanHighlight')
      bornGuessedWomanHighlightGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')
      bornGuessedWomanHighlightGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '0.8')

      var diedGuessedGradient = svgDefs.append('linearGradient')
        .attr('id', 'diedGuessed')
      diedGuessedGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')
      diedGuessedGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1')

      var diedGuessedHighlightGradient = svgDefs.append('linearGradient')
        .attr('id', 'diedGuessedHighlight')
      diedGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')
      diedGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1')

      var diedGuessedWomanGradient = svgDefs.append('linearGradient')
        .attr('id', 'diedGuessedWoman')
      diedGuessedWomanGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')
      diedGuessedWomanGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1')

      var diedGuessedWomanHighlightGradient = svgDefs.append('linearGradient')
        .attr('id', 'diedGuessedWomanHighlight')
      diedGuessedWomanHighlightGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')
      diedGuessedWomanHighlightGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1')

      var marriageGuessedGradient = svgDefs.append('linearGradient')
        .attr('id', 'marriageGuessed')
      marriageGuessedGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0.15')
      marriageGuessedGradient.append('stop')
        .attr('class', 'stop-middle')
        .attr('offset', '0.5')
      marriageGuessedGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '0.85')

      var marriageGuessedHighlightGradient = svgDefs.append('linearGradient')
        .attr('id', 'marriageHighlightGuessed')
      marriageGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0.15')
      marriageGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-middle')
        .attr('offset', '0.5')
      marriageGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '0.85')

      var marriageWomanGuessedGradient = svgDefs.append('linearGradient')
        .attr('id', 'marriageWomanGuessed')
      marriageWomanGuessedGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0.15')
      marriageWomanGuessedGradient.append('stop')
        .attr('class', 'stop-middle')
        .attr('offset', '0.5')
      marriageWomanGuessedGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '0.85')

      var marriageWomanGuessedHighlightGradient = svgDefs.append('linearGradient')
        .attr('id', 'marriageWomanHighlightGuessed')
      marriageWomanGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0.15')
      marriageWomanGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-middle')
        .attr('offset', '0.5')
      marriageWomanGuessedHighlightGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '0.85')
      var axisGradient = svgDefs.append('linearGradient')
        .attr('id', 'axisGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
      axisGradient.append('stop')
        .attr('offset', '0%')
        .attr('style', 'stop-color:rgb(255,255,255); stop-opacity:1')
        axisGradient.append('stop')
        .attr('offset', '50%')
        .attr('style', 'stop-color:rgb(255,255,255); stop-opacity:1')
      axisGradient.append('stop')
        .attr('offset', '100%')
        .attr('style', 'stop-color:rgb(255,255,255); stop-opacity:0')
        

      var line = d3.line()
        .x(function (d, i) {
          return d.x
        })
        .y(function (d, i) { return d.y })
        .curve(d3.curveBasis) // generates a path element which is a line

      var chartGroup = svg.append('g')
        .attr('class', 'group')
        .attr('transform', 'translate(0,0)')

      // draw children connections
      var childrenConnectionGroup = chartGroup.selectAll('g.childconnector')
        .data(showChildArray)
        .enter().append('g')
        .attr('class', function (d) {
          return 'childconnector childconnector' + d[0].id + ' ' + d[0].gender
        })

      childrenConnectionGroup.append('path')
        .attr('d', function (d) {
          return line(d)
        })

      // prepare personArray for drawing
      // go through personArray and split path information
      var personArrayToDraw = []
      var guessedDiff = 20

      personArray.forEach((personItem) => {
        var myPersonToDraw = []
        var isMarried = false
        var isDivorce = false
        if (personItem.length === 4) {
          isMarried = true
        }
        if (personItem.length === 6) {
          isDivorce = true
        }

        myPersonToDraw.push({
          id: personItem[0].id,
          gender: personItem[0].gender
        })
        personItem.forEach((item, index) => {
          var myPathToDraw = []
          if ((isMarried && index === 1) || (isDivorce && index === 1)) {
            myPersonToDraw[0].marriageGuessed = item.marriageGuessed
            myPathToDraw.push({
              x: personItem[index - 1].x,
              y: personItem[index - 1].y
            })
            myPathToDraw.push({
              x: item.x - 20,
              y: item.y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []

            myPathToDraw.push({
              x: item.x - 22,
              y: item.y,
              marriageGuessed: item.marriageGuessed
            })
            myPathToDraw.push({
              x: item.x,
              y: item.y
            })
            myPathToDraw.push({
              x: personItem[index + 1].x,
              y: personItem[index + 1].y
            })
            myPathToDraw.push({
              x: personItem[index + 1].x + 22,
              y: personItem[index + 1].y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []
          } else if ((isMarried && index === 2) || (isDivorce && index === 2)) {
            // do nothing
          } else if (item.bornGuessed === true) {
            myPathToDraw.push({
              x: item.x - guessedDiff,
              y: item.y + 0.001,
              bornGuessed: true
            })
            myPathToDraw.push({
              x: item.x + 1,
              y: item.y
            })
            myPersonToDraw.push(myPathToDraw)
            myPersonToDraw[0].bornGuessed = true
            myPathToDraw = []
          } else if (item.bornGuessed === false) {
            // do nothing
          } else if (item.divorceGuessed === true) {
            myPersonToDraw[0].divorceGuessed = item.divorceGuessed
            myPathToDraw.push({
              x: personItem[index - 1].x + 20,
              y: personItem[index - 1].y
            })
            myPathToDraw.push({
              x: item.x - 20,
              y: item.y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []

            myPathToDraw.push({
              x: item.x - 22,
              y: item.y,
              marriageGuessed: item.divorceGuessed
            })
            myPathToDraw.push({
              x: item.x,
              y: item.y
            })
            myPathToDraw.push({
              x: personItem[index + 1].x,
              y: personItem[index + 1].y
            })
            myPathToDraw.push({
              x: personItem[index + 1].x + 22,
              y: personItem[index + 1].y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []
          } else if (isDivorce && index === 4) {
            // do nothing
          } else if (item.diedGuessed === true) {
            if (isMarried || isDivorce) {
              myPathToDraw.push({
                x: personItem[index - 1].x + 20,
                y: personItem[index - 1].y
              })
            } else {
              myPathToDraw.push({
                x: personItem[index - 1].x,
                y: personItem[index - 1].y
              })
            }
            myPathToDraw.push({
              x: item.x,
              y: item.y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []

            myPathToDraw.push({
              x: item.x - 1,
              y: item.y,
              diedGuessed: true
            })
            myPathToDraw.push({
              x: item.x + guessedDiff,
              y: item.y + 0.001
            })
            myPersonToDraw.push(myPathToDraw)
            myPersonToDraw[0].diedGuessed = true
            myPathToDraw = []
          } else {
            if (isMarried) {
              myPathToDraw.push({
                x: personItem[index - 1].x + 20,
                y: personItem[index - 1].y
              })
            } else {
              myPathToDraw.push({
                x: personItem[index - 1].x,
                y: personItem[index - 1].y
              })
            }
            myPathToDraw.push({
              x: item.x,
              y: item.y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []
          }
        })
        personArrayToDraw.push(myPersonToDraw)
      })

      // draw person pathes
      personArrayToDraw.forEach((personPath, index) => {
        var firstGroups = chartGroup.append('g')
          .attr('class', function (d, i) { return 'firstLevelGroup' + i })
          .attr('id', function (d, i) { return 'person' + personPath[0].id })
          .on('click', function (d, i) {
            if (clickTrue) {
              const context = this
              touchend(context)
            }
          }) // comment when running on touch display
          .on('touchstart', touchstart)
          .on('touchend', touchend)

        for (let index = 1; index < personPath.length; index++) {
          const path = personPath[index]
          firstGroups.append('path')
            .attr('fill', 'none')
            .attr('class', function () {
              var myClass
              switch (personPath[0].gender) {
                case 'man':
                  myClass = 'person' + personPath[0].id + ' man'
                  if (path[0].bornGuessed) {
                    myClass += ' bornGuessGradient'
                  }
                  if (path[0].diedGuessed) {
                    myClass += ' diedGuessGradient'
                  }
                  if (path[0].marriageGuessed) {
                    myClass += ' marriageGuessGradient'
                  }
                  break

                default:
                  myClass = 'person' + personPath[0].id + ' woman'
                  if (path[0].bornGuessed) {
                    myClass += ' bornGuessWomanGradient'
                  }
                  if (path[0].diedGuessed) {
                    myClass += ' diedGuessWomanGradient'
                  }
                  if (path[0].marriageGuessed) {
                    myClass += ' marriageGuessWomanGradient'
                  }
                  break
              }
              return myClass
            })
            // .attr('id', function () { return 'person' + personPath[0].id })
            .attr('stroke-width', strokeWidth)
            .attr('d', function () {
              return line(path)
            })
        }
      })

      // // draw names on person pathes
      chartGroup.selectAll('text')
        .data(personInfoArray)
        .enter()
        .append('text')
        .text(function (d) { return d.name })
        .attr('x', function (d) { return d.bornx + 10 })
        .attr('y', function (d) { return d.y + 5 })
        .attr('fill', 'white')
        .on('click', function (d, i) { if (clickTrue) touchend(d, i) }) // comment when running on touch display
        .on('touchstart', touchstart)
        .on('touchend', touchend)

      personInfoArray.forEach((person, index) => {
        if (person.bornx) {
          chartGroup.append('image')
            .attr('xlink:href', 'img/icon/star.svg')
            .attr('width', 15)
            .attr('height', 15)
            .attr('x', person.bornx - 7)
            .attr('y', person.y - strokeWidth + 3)
        }
        if (person.diedx) {
          chartGroup.append('image')
            .attr('xlink:href', 'img/icon/cross.svg')
            .attr('width', 10)
            .attr('height', 10)
            .attr('x', person.diedx - 5)
            .attr('y', function () {
              if (person.id === 24) { // 1. spouse of Friedrich II. > divorce
                return person.marriagey + strokeWidth - 7
              } else if (person.marriagey) {
                return person.marriagey - strokeWidth + 5
              } else {
                return person.y - strokeWidth + 5
              }
            })
        }

        if (person.marriagex) {
          chartGroup.append('image')
            .attr('xlink:href', 'img/icon/marriage.svg')
            .attr('width', 15)
            .attr('height', 15)
            .attr('x', person.marriagex - 7)
            .attr('y', person.marriagey - strokeWidth + 2)
        }
      })

      var childrenIconsGroup = chartGroup.selectAll('g.childIcons')
        .data(showChildArray)
        .enter().append('g')
        .attr('class', 'childIcons')

      childrenIconsGroup.append('image')
        .attr('xlink:href', function (d) {
          if (d[0].gender === 'woman') {
            return 'img/icon/pacifier-female.svg'
          } else {
            return 'img/icon/pacifier-male.svg'
          }
        })
        .attr('class', function (d) { return 'childId' + d[0].id + ' child' + d[0].gender })
        .attr('width', 38)
        .attr('height', 38)
        .attr('x', function (d) { return d[0].x - 18 })
        .attr('y', function (d) { return d[0].y - 8 })
        .on('click', function (d, i) { if (clickTrue) childTouched(d, i, this) }) // comment when running on touch display
        .on('touchend', function (d, i) {
          childTouched(d, i, this)
        })
        .on('dblclick', function (d) { if (clickTrue) scrollToPerson(d) })
        .dblTap(function (d) {
          scrollToPerson(d)
        })

      function childTouched (d, i, context) {
        resetHighlighting()
        sendLocalUserToGod()

        var myContext
        if (context !== 0) {
          myContext = context
        } else {
          myContext = this
        }

        d3.select(myContext).attr('xlink:href', function (d) {
          if (d[0].gender === 'woman') {
            return 'img/icon/pacifier-female-highlight.svg'
          } else {
            return 'img/icon/pacifier-male-highlight.svg'
          }
        })

        // reset highlight of childconnectors
        d3.selectAll('.childconnector').classed('selected', false)

        // highlight connection
        var connectorClass = 'childconnector' + d[0].id
        d3.select('.' + connectorClass).classed('selected', true)

        // select person
        getPersonToShow(d[0].id)
      }

      function resetHighlighting () {
        // reset highlight of childconnectors
        d3.selectAll('.childconnector').classed('selected', false)

        // reset highlight of child-buttons
        d3.selectAll('.childman')
          .attr('xlink:href', 'img/icon/pacifier-male.svg')
        d3.selectAll('.childwoman')
          .attr('xlink:href', 'img/icon/pacifier-female.svg')
      }

      var axisGroup = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,0)')
      
      axisGroup.append('rect')
        .attr('class', 'back')
        .attr('fill', 'url(#axisGradient)')
        .attr('width', svgWidth)
        .attr('height', '60px')
      
      axisGroup.call(d3.axisBottom(x)
          .ticks(100)
          .tickFormat(d3.timeFormat('%Y'))
          .tickSize(0)
        )
      
      d3.selectAll("g.x.axis g.tick line")
        .attr("y2", function(d){
        if ( d.getFullYear() % 10 === 0) // if it's an even multiple of 10% Vielfaches von 10
            return 13;
        else
            return 10;
      });
      d3.selectAll("g.x.axis g.tick text")
        .attr("y", 18);

      // This is just to show you that the parseDate funciton returns a very long stirng. What firefox and chrome took was only the last 3 digits which resolve to :00
      // console.log('stringdates: ', parseDate(stringDates[0]), d3.extent(stringDates, function (d) { return parseDate(d) }))

      /**
       * This is where the transition of the axis takes place. You can take various ease funcitons to make it smoother.
       * https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe
       * Or try play around with duration and delay.
       */
      var elementToScroll = document.getElementById('chart')

      elementToScroll.addEventListener('scroll', function (event) {
        // First covers all browsers and tablets except ones with IE. Second is fallback option for IE.
        const scrollPos = elementToScroll.scrollY || elementToScroll.scrollTop

        // If we are not at the top of the screen we add the offset
        if (scrollPos > 5) {
          axisGroup
            .transition()
            .ease(d3.easeElastic)
            .attr('transform', `translate(0, ${scrollPos + scrollOffset})`)
        } else { // Otherwise we need no offset
          axisGroup
            .transition()
            .ease(d3.easeElastic)
            .attr('transform', `translate(0, ${scrollPos})`)
        }
      })

      // scroll to selected child via child-button
      var divToScroll = d3.select('#chart')
      function scrollToPerson (d) {
        var scrollheight = d[1].y - 20
        divToScroll.transition().duration(3000)
          .tween('uniquetweenname', scrollTopTween(scrollheight))
      }

      function scrollTopTween (scrollTop) {
        return function () {
          var i = d3.interpolateNumber(elementToScroll.scrollTop, scrollTop)
          return function (t) { elementToScroll.scrollTop = i(t) }
        }
      }

      function touchstart (d, i) {
        try {
          d3.select('#person' + d.id).classed('selected', true)
          d3.select('#person' + d.id).classed('sel', false)
        } catch (error) {
          d3.select(this).classed('selected', true)
          d3.select(this).classed('sel', false)
        }
      }

      function touchend (d, i) {
        resetHighlighting()
        sendLocalUserToGod()

        var context
        try {
          if (!d.hasOwnProperty('name')) context = d
        } catch (error) {
          context = this
        }

        var touchedElement = d3.select(context)
        var idTouched

        try {
          idTouched = touchedElement.attr('id')
          var res = idTouched.split('person')
          idTouched = parseInt(res[1])
        } catch (error) {
          idTouched = d.id
        }

        getPersonToShow(idTouched)
      }

      function getPersonToShow (idTouched) {
        personInfoArray.forEach(person => {
          if (person.id === idTouched) {
            d3.selectAll('g').classed('sel', false)

            d3.select('#person' + person.id).classed('selected', false)
            d3.select('#person' + person.id).classed('sel', true)

            localStorage.setItem('person', JSON.stringify(person))
            showInformation(person)
          }
        })
      }

      var infoImage = d3.select('#image')
      var infoDesc = d3.select('#description')
      var infoCoat = d3.select('#coatofarms')

      function showInformation (person) {
        console.log('showInformation')
        console.log(person)

        // send person to projection
        socket.emit('sendDataToProjection', { data: person.id })

        // Check if id == 23 > unlock coa special item
        if (person.id === 23 && isGodUser) {
          socket.emit('unlockCoaMantle', { 'device': whichside })
        }

        // shows text information
        infoDesc.select('h1').remove()
        infoDesc.select('h2').remove()
        infoDesc.select('p').remove()
        infoDesc.append('h1').text(person.name)
        infoDesc.append('h2').text(person.title)

        var desc

        switch (whichLanguage) {
          case 'DE':
            desc = person.desc
            break

          default:
            desc = person.descen
            break
        }
        infoDesc.append('p').text(desc)

        // Shows cirular image
        infoImage.selectAll('*').remove()
        infoImage.append('img').attr('src', 'img/' + person.img + '.png')
        infoImage.append('img')
          .attr('class', 'circle')
          .attr('src', 'img/connection/circle-flower-p.png')

        // Shows coat of arms
        infoCoat.selectAll('div.coa').remove()
        if (person.coa.length > 0) {
          person.coa.forEach((coaItem, index) => {
            var coatOfArmsItem
            coatOfArms.forEach(coa => {
              if (coa.id === coaItem) {
                coatOfArmsItem = coa
              }
            })

            var div = infoCoat.append('div')
            div.append('img')
              .attr('src', 'img/coatofarms/' + coatOfArmsItem.img + '.png')
              .attr('class', 'coa' + coatOfArmsItem.id)
              .on('click', function (d) { if (clickTrue) coaTouched(d, this) }) // comment when running on touch display
              .on('touchstart', coaTouchedStart)
              .on('touchend', coaTouched)

            div.attr('class', 'coa')
            // div.append('h2').text(coatOfArmsItem.name)

            // add empty divs to get 4 divs
            if (person.coa.length === 1 && index === 0) {
              infoCoat.append('div').attr('class', 'coa')
              infoCoat.append('div').attr('class', 'coa')
              infoCoat.append('div').attr('class', 'coa')
            }

            if (person.coa.length === 2 && index === 1) {
              infoCoat.append('div').attr('class', 'coa')
              infoCoat.append('div').attr('class', 'coa')
            }

            if (person.coa.length === 3 && index === 2) {
              infoCoat.append('div').attr('class', 'coa')
            }
          })
        }
      }

      var coaOverlay = d3.select('#coaOverlay')
        .on('click', function () { if (clickTrue) hideCoa() }) // comment when running on touch display
        .on('touchend', hideCoa)

      function coaTouched (d, context) {
        sendLocalUserToGod()
        coaOverlay.style('display', 'block')

        var myContext, coatOfArmsItem
        if (context !== 0) {
          myContext = context
        } else {
          myContext = this
        }

        var myElement = d3.select(myContext).style('opacity', 1)

        var idTouched = myElement.attr('class')
        var res = idTouched.split('coa')
        idTouched = parseInt(res[1])

        // get coa item
        coatOfArms.forEach(coa => {
          if (coa.id === idTouched) {
            coatOfArmsItem = coa
          }
        })

        coaOverlay.selectAll('*').remove()
        var coaOverlayInfo = coaOverlay.append('div').attr('class', 'coa-overlay-info')
        var coaTable = coaOverlayInfo.append('div').attr('class', 'coa-table')
        var coaImg = coaTable.append('div').attr('class', 'coa-col1')
        coaImg.append('img').attr('src', function () {
          return 'img/coatofarms/' + coatOfArmsItem.img + '.png'
        })
        var coaTitle = coaTable.append('div').attr('class', 'coa-title coa-col1')

        var whichName, whichDesc
        if (whichLanguage === 'DE') {
          whichName = coatOfArmsItem.name
          whichDesc = coatOfArmsItem.desc
        } else {
          whichName = coatOfArmsItem.nameen
          whichDesc = coatOfArmsItem.descen
        }
        // if 3 names than 3rd is an empty one
        // if 6 check 2nd are two names
        // if 32 check 4rd are two names
        // if 17 and 3
        whichName.forEach((coaName, index) => {
          if (whichName.length === 3 && index === 2 && coatOfArmsItem.id !== 17) {
            coaTitle.append('p').attr('class', 'coa-col2')
          }
          coaTitle.append('p').attr('class', 'coa-col2').text(coaName)
        })

        coaOverlayInfo.append('p').text(whichDesc)
      }

      function coaTouchedStart (d) {
        d3.select(this).style('opacity', 0.5)
      }

      function hideCoa () {
        coaOverlay.style('display', 'none')
      }

      // switch language
      var languagediv = d3.select('#language')
        .on('click', function () { if (clickTrue) languageToggle() }) // comment when running on touch display
        .on('touchstart', languageToggleStart)
        .on('touchend', languageToggle)

      function languageToggle () {
        sendLocalUserToGod()
        languagediv.style('opacity', 1)
        switch (whichLanguage) {
          case 'DE':
            whichLanguage = 'EN'
            break

          default:
            whichLanguage = 'DE'
            break
        }

        setLanguage(whichLanguage)
      }

      function languageToggleStart () {
        // highlight languagediv
        languagediv.style('opacity', 0.5)
      }

      function setLanguage (language) {
        localStorage.setItem('language', language)
        whichLanguage = language

        var welcome = d3.select('#welcome')
        welcome.selectAll('*').remove()
        var coaTitle = d3.select('#coatofarmstitle')
        coaTitle.selectAll('*').remove()
        var coaDesc = d3.select('#coatofarmsdesc')
        coaDesc.selectAll('*').remove()
        var languageDiv = d3.select('#language')
        languageDiv.selectAll('*').remove()
        var yesButton = d3.select('#logout-yes')
        yesButton.selectAll('*').remove()
        var noButton = d3.select('#logout-no')
        noButton.selectAll('*').remove()

        switch (language) {
          case 'DE':
            welcome.text('Willkommen')
            coaTitle.text('Wappen am Babenberger-Stammbaum')
            coaDesc.text('Am Babenberger-Stammbaum sind den Familienmitgliedern Wappen zugeordnet, die Herkunft, Status und/oder den Anspruch auf Gebiete repräsentieren.')
            languageDiv.append('p').text('DE')
            d3.selectAll('p.de').style('display', 'block')
            d3.selectAll('p.en').style('display', 'none')
            d3.selectAll('h1.de').style('display', 'block')
            d3.selectAll('h1.en').style('display', 'none')
            yesButton.text('Ja')
            noButton.text('Nein')
            break

          default:
            welcome.text('Welcome')
            coaTitle.text('Coats of arms on the Babenberg family tree')
            coaDesc.text('The coats of arms depicted on the Babenberg family tree represent the origin and status of the family members and/or claims of certain territories.')
            languageDiv.append('p').text('EN')
            d3.selectAll('p.en').style('display', 'block')
            d3.selectAll('p.de').style('display', 'none')
            d3.selectAll('h1.en').style('display', 'block')
            d3.selectAll('h1.de').style('display', 'none')
            yesButton.text('Yes')
            noButton.text('No')
            break
        }

        // reload Person
        var personToShow = JSON.parse(localStorage.getItem('person'))
        showInformation(personToShow)
      }

      // resetView
      var resetButton = d3.select('#reset')
        .on('click', function () { if (clickTrue) resetView() }) // comment when running on touch display
        .on('touchstart', resetViewStart)
        .on('touchend', resetView)

      function resetView () {
        resetHighlighting()
        hideCoa()
        resetButton.style('opacity', 1)
        getPersonToShow(1)

        // set div#chart to top 0, left 0
        elementToScroll.scrollTo(0, 0)
      }

      function resetViewStart () {
        resetButton.style('opacity', 0.5)
      }

      var isHelpOn = false
      // helpOverlay
      var helpOverlay = d3.select('#helpOverlay')
        .on('click', function () { if (clickTrue) toggleHelp() }) // comment when running on touch display
        .on('touchend', toggleHelp)
      var helpButton = d3.select('#help')
        .on('click', function () { if (clickTrue) toggleHelp() }) // comment when running on touch display
        .on('touchstart', toggleHelpStart)
        .on('touchend', toggleHelp)

      function toggleHelp () {
        helpButton.style('opacity', 1)

        if (isHelpOn) {
          helpOverlay.style('display', 'none')
          isHelpOn = false
        } else {
          helpOverlay.style('display', 'block')
          isHelpOn = true
        }
      }

      function toggleHelpStart () {
        helpButton.style('opacity', 0.5)
      }

      var startOverlay = d3.select('#startOverlay')
      d3.select('#start-de')
        .on('click', function () { if (clickTrue) toggleStart('DE') })
        .on('touchend', function () { toggleStart('DE') })
      d3.select('#start-en')
        .on('click', function () { if (clickTrue) toggleStart('EN') })
        .on('touchend', function () { toggleStart('EN') })

      function toggleStart (language) {
        if (isStartOn) {
          startOverlay.style('display', 'none')
          isStartOn = false
          setLanguage(language)
          sendLocalUserToGod()
        } else {
          startOverlay.style('display', 'block')
          isStartOn = true
        }
      }

      function setupFirstTime () {
        // reset view to Leopold (id = 1)
        resetView()
        // set language to German
        whichLanguage = 'DE'
        localStorage.setItem('language', whichLanguage)
        // socket.emit('userTimedOut', { device: whichside })
      }

      socket.on('userJoined', function (user) {
        isGodUser = true
        console.log('god user joined')

        var myUser = { 'name': user.name,
          'language': '' }

        switch (user.contentLanguageId) {
          case 2:
            myUser.language = 'DE'
            break
          default:
            myUser.language = 'EN'
            break
        }

        toggleStart()
        setupUser(myUser)
        setTimer()
      })

      d3.select('#username')
        .on('click', function () { if (clickTrue) logoutStart() })
        .on('touchend', logoutStart)

      var logoutOverlay = d3.select('#logoutOverlay')
      d3.select('#logout-yes').on('click', function () { if (clickTrue) logout(true) })
        .on('touchend', function () { logout(true) })
      d3.select('#logout-no').on('click', function () { if (clickTrue) logout(false) })
        .on('touchend', function () { logout(false) })

      function logoutStart () {
        logoutOverlay.style('display', 'block')
      } 

      function logout (proceedLogout) {
        if (proceedLogout) {
          clearUser(2)
        }

        // hide logoutOverlay
        logoutOverlay.style('display', 'none')
      } 

      socket.on('userLeft', function () {
        console.log('god user left called')
        clearUser(1)
      })

      function sendLocalUserToGod () {
        if (!isGodUser && !isLocalUser) {
          console.log('local user join')
          socket.emit('localUserJoined', { device: whichside })
          isLocalUser = true
          var myUser = { 'name': '',
            'language': '' }

          switch (whichLanguage) {
            case 'DE':
              myUser.name = 'Gast'
              myUser.language = 'DE'
              break

            default:
              myUser.name = 'Guest'
              myUser.language = 'EN'
              break
          }
          setupUser(myUser)
        }
        setTimer()
      }

      function setTimer () {
        console.log('setTimer')
        clearInterval(interactionTimeout)
        clearTimeout(overlayTimeout)
        interactionTimeout = window.setTimeout(showTimerEndDialog, setTimerTime * 1000)
      }

      var timerOverlay = d3.select('#timerOverlay')
        .on('click', function () { if (clickTrue) timerOverlayOff() }) // comment when running on touch display
        .on('touchend', timerOverlayOff)

      function timerOverlayOff () {
        sendLocalUserToGod()
        timerOverlay.style('display', 'none')
        setTimer()
      }

      function showTimerEndDialog () {
        d3.select('#progressBar').attr('value', 0)
        timerOverlay.style('display', 'block')

        var timeleft = 15

        var timeOutTimer = setInterval(function () {
          d3.select('#progressBar').attr('value', setTimeEnd - timeleft)
          timeleft -= 1
          if (timeleft <= 0) {
            clearInterval(timeOutTimer)
          }
        }, 1000) // update progress bar every second

        overlayTimeout = window.setTimeout(clearUserTimeout, setTimeEnd * 1000)
      }

      function clearUserTimeout () {
        clearUser(0)
      }

      function clearUser (who) {
        switch (who) {
          case 1: // info from god
            if (isGodUser) {
              console.log('god user left')
              isGodUser = false
              clearInterval(interactionTimeout)
              clearTimeout(overlayTimeout)
            }
            break

          default: // timer
            if (isLocalUser) {
              console.log('local user kicked out & send to god')
              socket.emit('localUserLeft', { device: whichside })
              isLocalUser = false
            }

            if (isGodUser) {
              console.log('god user kicked & send to god')
              socket.emit('userTimedOut', { device: whichside })
              isGodUser = false
            }
            break
        }

        var myUser = { 'name': '?',
          'language': '' }

        switch (whichLanguage) {
          case 'DE':
            myUser.language = 'DE'
            break

          default:
            myUser.language = 'EN'
            break
        }
        setupUser(myUser)

        timerOverlay.style('display', 'none')
        startOverlay.style('display', 'block')
        isStartOn = true
        resetView()
      }

      function setupUser (user) {
        d3.select('#username').text(user.name)
        setLanguage(user.language)
      }

      // first time setup
      setupFirstTime()

      d3.select('body').on('touchstart', setTimer)
    })
  })
})
