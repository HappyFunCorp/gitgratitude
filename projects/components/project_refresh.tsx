import { Project } from "@prisma/client";
import { useState } from "react";

export default function ProjectRefresh({ project, setProject }) {
  const [active, setActive] = useState(false);

  const onClick = async () => {
    setActive(true);

    const result = await fetch(`${window.location.origin}/api/project_lookup`, {
      body: JSON.stringify({
        ecosystem: project.ecosystem,
        name: project.name,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    setActive(false);
    const json = await result.json();
    console.log(json);
    setProject(json);
  };

  return (
    <button className="btn-primary" onClick={onClick}>
      {active ? "Refreshing..." : "Refresh"}
    </button>
  );
}
