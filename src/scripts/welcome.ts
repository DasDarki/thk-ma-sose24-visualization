import data from "@/data/test.json"; // import a JSON file
import * as d3 from "d3"; // import the d3 library

export function getMessage(): string { // some function that returns a string
    return data.message;
}

export function drawSmiley() {
    const svg = d3.select("#smiley"); // select the SVG element

    svg.append("circle") // draws the outer circle for the face itself
        .attr("cx", 50)
        .attr("cy", 50)
        .attr("r", 40)
        .attr("fill", "yellow");

    svg.append("circle") // draws the left eye at (30, 30)
        .attr("cx", 30)
        .attr("cy", 30)
        .attr("r", 5)
        .attr("fill", "black");

    svg.append("circle") // draws the right eye at (70, 30)
        .attr("cx", 70)
        .attr("cy", 30)
        .attr("r", 5)
        .attr("fill", "black");

    svg.append("path") // draws the mouth
        .attr("d", "M 30 60 Q 50 80 70 60") // d sets the path's data, M (move to) 30 60 selects the starting point, Q (quadratic beziercurve) 50 80 70 60 sets the control point and end point
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none");
}