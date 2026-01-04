import React from "react";

function HeaderText({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );
}

export default HeaderText;
