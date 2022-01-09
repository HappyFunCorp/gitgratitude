import { EcosystemName } from "@prisma/client";
import { Ecosystem } from "lib/ecosystem";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ProjectLink from "./project_link";

type Props = {
  ecosystem?: Ecosystem;
};

export default function ProjectLookup({ ecosystem }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [working, setWorking] = useState(false);
  const [status, setStatus] = useState("");
  const [project, setProject] = useState();

  const onSubmit = async (data) => {
    if (data.name.length == 0) {
      setStatus("Please enter a project name");
    } else {
      setStatus(`Looking up ${data.name}`);
      setWorking(true);

      const response = await fetch(
        `${window.location.origin}/api/project_lookup`,
        {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );

      setWorking(false);
      if (!response.ok) {
        if (response.headers["content-type"] == "application/json") {
          const json = await response.json();
          setStatus(json.message);
        } else {
          setStatus(`Bad server response: ${response.statusText}`);
        }
      } else {
        setStatus("Got a response");
        const data = await response.json();
        if (data.name) {
          setStatus("Project found");
          setProject(data);
        } else {
          setStatus(data.message);
          setProject(null);
        }
      }

      console.log(response);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="py-4">
        {ecosystem ? (
          <input
            type="hidden"
            name="ecosystem"
            value={ecosystem.name}
            {...register("ecosystem")}
          />
        ) : (
          <select
            {...register("ecosystem")}
            className="px-2 py-1 border-solid border-2 border-blue-600 dark:bg-slate-900 rounded"
            name="ecosystem"
          >
            <option value="rubygems">Ruby</option>
            <option value="npm">Node</option>
          </select>
        )}
        <input
          {...register("name")}
          className="mx-2 px-2 py-1 dark:text-slate-900"
          type="text"
          placeholder="Project Name"
        />

        <button type="submit" className="btn-primary">
          {working ? "Searching..." : "Search"}
        </button>
      </form>
      {status ? <p>{status}</p> : <></>}
      {project && (
        <dl>
          <dt>Name</dt>
          <dd>
            <ProjectLink
              name={
                // @ts-expect-error
                project.name
              }
              project={project}
            />
          </dd>
          <dt>Description</dt>
          <dd>
            {
              // @ts-ignore
              project.description
            }
          </dd>
          <dt>Homepage</dt>
          <dd>
            <a
              href={
                // @ts-ignore
                project.homepage
              }
            >
              {
                //@ts-ignore
                project.homepage
              }
            </a>
          </dd>
        </dl>
      )}
    </>
  );
}
