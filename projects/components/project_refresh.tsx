import { Project } from "@prisma/client";
import { useState } from "react";

type Props = {
  project: Project;
};

export default function ProjectRefresh({ project }: Props) {
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
    window.location.href = window.location.href;
  };
  return (
    <button className="btn-primary" onClick={onClick}>
      {active ? "Refreshing..." : "Refresh"}
    </button>
  );
}
