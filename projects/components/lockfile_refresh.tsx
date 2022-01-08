import { Lockfile } from "@prisma/client";
import useInterval from "lib/hooks";
import { useState } from "react";
import Progress from "./progress";

type Props = {
  lockfile: Lockfile;
};

export default function LockfileRefresh({ lockfile }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [depCount, setDepCount] = useState(57);
  const [progress, setProgress] = useState(0);

  const onClick = () => {
    setProgress(0);
    setRefreshing(true);
    fetch(`/api/parse_lockfile?id=${lockfile.id}`).then((response) => {
      console.log(response);
      setRefreshing(false);
    });
  };

  useInterval(() => {
    if (refreshing) {
      // console.log("Calling status");
      fetch(`/api/lockfile_status?id=${lockfile.id}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setDepCount(data.count);
          setProgress(data.processed);
        });
    }
  }, 500);

  if (!refreshing) {
    return (
      <div>
        <button onClick={onClick} className="btn-primary">
          Refresh
        </button>
      </div>
    );
  }

  return <Progress percentage={progress / depCount} />;
}
