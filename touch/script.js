'use strict'

var d3, io

var socket = io('http://192.168.178.28:8100/')
var whichside = 'left' // 'right'

socket.emit('connectTouch', { device: whichside })

socket.on('connectTouchResult', function (data) {
  console.log(data)

  // Load Genealogy Data
  d3.json('/data/genealogy-data.json', function (data) {
    var persons = data

    // load Coat of Arms Data
    d3.json('/data/coat-of-arms.json', function (data) {
      var coatOfArms = data

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
      var svgHeight = 2800
      var svgWidth = 2000
      // Determines how far the scroll bar should be from the top
      var scrollOffset = 0

      var x = d3.scaleTime()
        .domain(d3.extent(stringDates, function (d) { return parseDate(d) }))
        .range([0, svgWidth])

      // get the x-coordinates depending on year
      var whichX = d3.scaleLinear()
        .domain([1060, 1280]) // min and max year of data set
        .range([0, svgWidth]) // min and max of svg

      var personArray = []
      var personInfoArray = []
      var itterator = 0
      var marriageCount = 1

      var strokeWidth = 40
      var startY = strokeWidth
      var marriageXDiff = strokeWidth / 2
      var marriageYDiff = strokeWidth / 3
      var yDiff = 2 * strokeWidth

      var childArray = []
      var showChildArray = []
      var isChild = false
      // var isFather
      var fatherArray = []

      persons.forEach((person) => {
        // console.log(person);
        // console.log(person.name + ' ' + person.born + ' ' + whichX(person.born));
        isMarried(person)
      })

      function isMarried (person) {
        if (typeof person.marriages !== 'undefined') {
          // console.log('ist verheiratet');
          // console.log(person.name);
          if (typeof person.marriages[0].children !== 'undefined') {
            // isFather = true
            // console.log('Father');
          }

          marriageCount = 1
          pushInArray(person, 'married')

          person.marriages.forEach((marriage) => {
            // console.log('verheiratet mit');
            // console.log(marriage.spouse.name);

            pushInArray(marriage.spouse, 'spouse')

            if (typeof marriage.children !== 'undefined') {
              // console.log('hat Kinder')
              childArray.push(marriage)
            } else {
              // console.log('keine Kinder')
            }
          })

          childArray.forEach(spouse => {
            childArray = []
            // console.log('childArray is cleared')

            spouse.children.forEach(child => {
              isChild = true
              // console.log('Kind')
              // console.log(child.name + ' ' + child.born + ' ' + whichX(child.born))
              isMarried(child)
            })
          })
        } else {
          // console.log('nicht verheiratet')
          pushInArray(person, 'child')
        }
      }

      function pushInArray (person, type) {
        // console.log('pushinarray')
        // console.log(person)
        // x1 - x-Child  y1 - middle of Father/Mother y3
        // x2 - x-Child  y2 - y1 child
        if (isChild) {
          // console.log('ist Kind')
          isChild = false
          getFatherById(person.father)
          var fatherY = getFatherY(father)
          showChildArray.push([{ x: whichX(person.born), y: fatherY + 26 },
            { x: whichX(person.born), y: startY }])
        }

        switch (type) {
          case 'child':
            // console.log('child')
            personArray[itterator] = [
              { x: whichX(person.born), y: startY, gender: person.gender, id: person.id, bornGuessed: person.bornGuessed },
              { x: whichX(person.died), y: startY, diedGuessed: person.diedGuessed }
            ]
            setPersonInfoArray(itterator, person, startY)

            // console.log('in nicht verheiratet')
            // console.log(person.name)
            startY += yDiff
            itterator++
            break

          case 'spouse':
            // console.log('spouse')

            var marriageX1 = whichX(person.marriage) - marriageXDiff
            var marriageX2 = whichX(person.marriage) + marriageXDiff
            var marriageY = startY - marriageYDiff - yDiff * (marriageCount - 1)

            personArray[itterator] = [
              { x: whichX(person.born), y: startY, gender: person.gender, id: person.id, bornGuessed: person.bornGuessed }, // born
              { x: marriageX1, y: startY, marriageGuessed: person.marriageGuessed }, // marriage 1
              { x: marriageX2, y: marriageY }, // marriage 2
              { x: whichX(person.died), y: marriageY, diedGuessed: person.diedGuessed }
            ]

            setPersonInfoArray(itterator, person, startY)

            startY += yDiff
            itterator++
            marriageCount++
            break

          default:
            // console.log('default')
            marriageX1 = whichX(person.marriages[marriageCount - 1].spouse.marriage) - marriageXDiff
            marriageX2 = whichX(person.marriages[marriageCount - 1].spouse.marriage) + marriageXDiff
            marriageY = startY + marriageYDiff

            fatherArray.push({ y: marriageY, id: person.id })

            personArray[itterator] = [
              { x: whichX(person.born), y: startY, gender: person.gender, id: person.id, bornGuessed: person.bornGuessed },
              { x: marriageX1, y: startY, marriageGuessed: person.marriageGuessed }, // marriage 1
              { x: marriageX2, y: marriageY }, // marriage 2
              { x: whichX(person.died), y: marriageY, diedGuessed: person.diedGuessed }
            ]

            setPersonInfoArray(itterator, person, startY)
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
          // console.log('id found')
          // console.log(person)
          father = person
        }
        if (typeof person.marriages !== 'undefined') {
          person.marriages.forEach(marriage => {
            if (typeof marriage.children !== 'undefined') {
              marriage.children.forEach(child => {
                if (child.id === myId) {
                  // console.log('id found')
                  // console.log(child)
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
        // console.log(fatherSample)
        var fatherY = ''
        fatherArray.forEach(father => {
          if (father.id === fatherSample.id) {
            fatherY = father.y
          }
        })
        return fatherY
      }

      function setPersonInfoArray (itterartor, person, startY) {
        personInfoArray[itterator] = {
          name: person.name,
          gender: person.gender,
          desc: person.desc,
          img: person.img,
          id: person.id,
          x: whichX(person.born),
          y: startY,
          coa: person.coa,
          title: person.title
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

      var line = d3.line()
        .x(function (d, i) {
          return d.x
        })
        .y(function (d, i) { return d.y })
        .curve(d3.curveLinear) // generates a path element which is a line

      var chartGroup = svg.append('g')
        .attr('class', 'group')
        .attr('transform', 'translate(0,0)')

      // prepare personArray for drawing
      // go through personArray and split path information
      var personArrayToDraw = []
      var guessedDiff = 20

      personArray.forEach((personItem) => {
        var myPersonToDraw = []
        var isMarried = false
        if (personItem.length === 4) {
          isMarried = true
        }

        myPersonToDraw.push({
          id: personItem[0].id,
          gender: personItem[0].gender
        })
        personItem.forEach((item, index) => {
          // console.log(item)
          var myPathToDraw = []

          if (isMarried && index === 1) {
            myPersonToDraw[0].marriageGuessed = item.marriageGuessed
            myPathToDraw.push({
              x: personItem[index - 1].x,
              y: personItem[index - 1].y
            })
            myPathToDraw.push({
              x: item.x,
              y: item.y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []

            myPathToDraw.push({
              x: item.x - 10,
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
              x: personItem[index + 1].x + 10,
              y: personItem[index + 1].y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []
          } else if (isMarried && index === 2) {
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
          } else if (item.diedGuessed === true) {
            myPathToDraw.push({
              x: personItem[index - 1].x,
              y: personItem[index - 1].y
            })
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
            myPathToDraw.push({
              x: personItem[index - 1].x,
              y: personItem[index - 1].y
            })
            myPathToDraw.push({
              x: item.x,
              y: item.y
            })
            myPersonToDraw.push(myPathToDraw)
            myPathToDraw = []
          }
        })
        console.log(myPersonToDraw)
        personArrayToDraw.push(myPersonToDraw)
      })

      personArrayToDraw.forEach((personPath, index) => {
        var firstGroups = chartGroup.append('g')
          .attr('class', function (d, i) { return 'firstLevelGroup' + i })
          .attr('id', function (d, i) { return 'person' + personPath[0].id })
          .on('click', touchend) // comment when running on touch display
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

      var thirdGroup = chartGroup.selectAll('g.third')
        .data(showChildArray)
        .enter().append('g')
        .attr('class', 'third')

      thirdGroup.append('circle')
        .attr('cx', function (d) { return d[0].x })
        .attr('cy', function (d) { return d[0].y })
        .attr('r', 5)

      thirdGroup.append('path')
        .attr('fill', 'none')
        .attr('stroke-width', '1')
        .attr('stroke-dasharray', '10,10')
        .attr('d', function (d) {
          // console.log(d)
          return line(d)
        })

      // Adds names to
      chartGroup.selectAll('text')
        .data(personInfoArray)
        .enter()
        .append('text')
        .text(function (d) { return d.name })
        .attr('x', function (d) { return d.x })
        .attr('y', function (d) { return d.y })
        .attr('fill', 'white')
        .on('click', touchend) // comment when running on touch display
        .on('touchstart', touchstart)
        .on('touchend', touchend)

      var axisGroup = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y')))

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

      function touchstart (d, i) {
        try {
          d3.select('#person' + d.id).classed('selected', true)
          d3.select('#person' + d.id).classed('sel', false)
        } catch (error) {
          d3.select(this).classed('selected', true)
          d3.select(this).classed('sel', false)
        }
      }

      function touchend (d, i, myInfo) {
        var touchedElement = d3.select(this)
        var idTouched

        try {
          idTouched = touchedElement.attr('id')
          var res = idTouched.split('person')
          idTouched = parseInt(res[1])
        } catch (error) {
          if (myInfo === 1) {
            idTouched = 1
          } else {
            idTouched = d.id
          }
        }

        personInfoArray.forEach(person => {
          if (person.id === idTouched) {
            d3.selectAll('g').classed('sel', false)

            d3.select('#person' + person.id).classed('selected', false)
            d3.select('#person' + person.id).classed('sel', true)

            showInformation(person)
          }
        })
      }

      var infoImage = d3.select('#image')
      var infoDesc = d3.select('#description')
      var infoCoat = d3.select('#codeofarms')

      function showInformation (person) {
        console.log('showInformation')
        console.log(person)

        // send person to projection
        socket.emit('sendDataToProjection', { data: person.id })

        // shows text information
        infoDesc.select('h1').remove()
        infoDesc.select('h2').remove()
        infoDesc.select('p').remove()
        infoDesc.append('h1').text(person.name)
        infoDesc.append('h2').text(person.title)
        infoDesc.append('p').text(person.desc)

        // Shows cirular image
        infoImage.select('img').remove()
        infoImage.append('img').attr('src', 'img/' + person.img + '.png')

        // Shows coat of arms
        infoCoat.selectAll('div.coa').remove()
        person.coa.forEach(coaItem => {
          var coatOfArmsItem
          coatOfArms.forEach(coa => {
            if (coa.id === coaItem) {
              coatOfArmsItem = coa
            }
          })

          var div = infoCoat.append('div')
          div.append('img').attr('src', 'img/coatofarms/' + coatOfArmsItem.img + '.png')
          div.append('h2').text(coatOfArmsItem.name)

          switch (person.coa.length) {
            case 1:
              div.attr('class', 'coa single')
              break
            case 2:
              div.attr('class', 'coa double')
              break
            default:
              div.attr('class', 'coa triple')
              break
          }
        })
      }

      // first time setup
      // show Leopold
      touchend(persons[0], 0, 1)
    })
  })
})