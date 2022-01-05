import { Lockfile } from "@prisma/client";
import { useState } from "react";
import Progress from "./progress";
import useInterval from "./use_interval";

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
  };

  useInterval(() => {
    if (refreshing) {
      setProgress(progress + 1);
      if (progress >= depCount) {
        setRefreshing(false);
      }
    }
  }, 50);

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
