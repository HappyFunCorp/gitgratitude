import { Dependency, Lockfile, Project, Release } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-expect-error
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useProject(id): [Project, Dispatch<SetStateAction<Project>>] {
  const [project, setProject] = useState();
  useEffect(() => {
    const url = new URL(`${window.location.origin}/api/projects`);
    url.searchParams.append("id", id);
    try {
      fetch(url.href)
        .then((res) => res.json())
        .then((projects) => setProject(projects));
    } catch (err) {
      console.log(err);
    }
    return () => {};
  }, [id]);

  return [project, setProject];
}

export function useReleases(
  project
): [Release[], Dispatch<SetStateAction<Release[]>>] {
  const [releases, setReleases] = useState();
  useEffect(() => {
    if (project) {
      console.log(`Looking up releases for ${project.id}`);
      const url = new URL(`${window.location.origin}/api/releases`);
      url.searchParams.append("project_id", project.id);
      try {
        fetch(url.href)
          .then((res) => res.json())
          .then((releases) => setReleases(releases));
      } catch (err) {
        console.log(err);
      }
    }
    return () => {};
  }, [project]);

  return [releases, setReleases];
}

export function useLockfile(
  id
): [Lockfile, Dispatch<SetStateAction<Lockfile>>] {
  const [lockfile, setLockfile] = useState();
  useEffect(() => {
    const url = new URL(`${window.location.origin}/api/lockfiles`);
    url.searchParams.append("id", id);
    try {
      fetch(url.href)
        .then((res) => res.json())
        .then((lockfile) => setLockfile(lockfile));
    } catch (err) {
      console.log(err);
    }
    return () => {};
  }, [id]);

  return [lockfile, setLockfile];
}

export function useLockfileList(): [
  Lockfile[],
  Dispatch<SetStateAction<Lockfile[]>>
] {
  const [lockfile, setLockfile] = useState();
  useEffect(() => {
    const url = new URL(`${window.location.origin}/api/lockfiles`);
    url.searchParams.append("count", "10");
    try {
      fetch(url.href)
        .then((res) => res.json())
        .then((lockfiles) => setLockfile(lockfiles));
    } catch (err) {
      console.log(err);
    }
    return () => {};
  }, []);

  return [lockfile, setLockfile];
}

export function useDependancies(
  lockfile_id
): [Dependency[], Dispatch<SetStateAction<Dependency[]>>] {
  const [releases, setReleases] = useState();
  useEffect(() => {
    const url = new URL(`${window.location.origin}/api/dependencies`);
    url.searchParams.append("lockfile_id", lockfile_id);
    try {
      fetch(url.href)
        .then((res) => res.json())
        .then((releases) => setReleases(releases));
    } catch (err) {
      console.log(err);
    }
    return () => {};
  }, [lockfile_id]);

  return [releases, setReleases];
}
