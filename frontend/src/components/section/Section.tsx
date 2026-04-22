import React from "react";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  sectionTitle?: string;
};

const Section: React.FC<Props> = ({ sectionTitle, ...rest }) => {
  return (
    <div {...rest} className={`section-card ${rest.className || ""}`.trim()}>
      {sectionTitle && <h3 className="section-title">{sectionTitle}</h3>}
      <div>{rest.children}</div>
    </div>
  );
};

export default Section;
