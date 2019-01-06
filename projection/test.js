switch (printedRelative.relation) {
                case "father":
                    if(printedRelative.side == whichSide){
                        // same side

                    }else{
                        // other side

                        
                    }

                    break;
            
                default:
                    if(printedRelative.side == whichSide){
                        // same side
                        switch (whichSide){
                            case "left":
                                myPositions = printedPosLeft[printedRelative.position-1];
                                break;
                            default:
                                myPositions = printedPosRight[printedRelative.position-1];
                                break
                        }
                        console.log(myPositions);
                    }else{
                        // other side


                    }
                    
            }  

            myConnection.append("img")
                .attr("src", "/img/connection/corner.png")
                .attr("class", "corner")
                .style('top', myPositions.y+"px")
                .style('left', myPositions.x+marginLeft-44+"px");
            myConnection.append("img")
                .attr("src", "/img/connection/vertical.png")
                .attr("class", "vertical")
                .style('top', myPositions.y+"px")
                .style('left', myPositions.x+marginLeft-60+"px");