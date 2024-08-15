import React from "react";

export const Highlight = ({ top, left, height, width }) => {
  return (
    <div
      className="text-hightlight"
      style={{
        zIndex: 5,
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute",
        backgroundColor: "yellow",
        opacity: 0.4,
      }}
    ></div>
  );
};

const Highlights = (props) => {
  const { highlights } = props;

  return (
    <div className="text-highlights-layer">
      {highlights.map(({ pageIndex, ...rest }, index) => {
        if (pageIndex === props.pageIndex) {
          return <Highlight key={index} {...rest} />;
        }
        return null;
      })}
    </div>
  );
};

export default Highlights;
