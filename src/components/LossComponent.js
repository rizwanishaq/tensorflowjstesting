import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import Container from "react-bootstrap/Container";

const LossComponent = ({ data, text }) => {
  const ref = useRef();

  const layout = {
    width: 800,
    height: 100,
  };
  useEffect(() => {
    // setting up the svg
    const svgElement = d3.select(ref.current);
    svgElement.selectAll("*").remove();
    // setting the scaling
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, layout.width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([layout.height, 0]);

    const generateScaledLine = d3
      .line()
      .x((d, i) => xScale(i))
      .y(yScale)
      .curve(d3.curveCardinal);

    svgElement
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", (d) => generateScaledLine(d))
      .attr("fill", "none")
      .attr("stroke", "black");

    // setting the axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((i) => i);

    const yAxis = d3.axisLeft(yScale).ticks(5);

    svgElement
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${layout.height})`);
    svgElement.append("g").call(yAxis);

    svgElement
      .append("g")
      .attr(
        "transform",
        "translate(" + -25 + ", " + `${layout.height / 2}` + ")"
      )
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text(`${text}`);

    svgElement
      .append("g")
      .attr(
        "transform",
        "translate(" +
          `${layout.width / 2}` +
          ", " +
          `${layout.height + 20}` +
          ")"
      )
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(0)")
      .text("Epochs");
  }, [data, layout, text]);
  return (
    <Container>
      <svg
        ref={ref}
        style={{
          border: "1px solid #dad8d2",
          marginTop: 50,
          marginBottom: 50,
          background: "white",
          overflow: "visible",
        }}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        preserveAspectRatio="none"
      />
    </Container>
  );
};

export default LossComponent;
