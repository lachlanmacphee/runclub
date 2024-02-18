import { toast } from "@/components/ui/use-toast";
import { usePocket } from "@/contexts";
import { Participant } from "@/lib/types";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RunTable } from "@/components/runs/runTable";
import { Loader2 } from "lucide-react";

export function MemberStats() {
  const { pb, user } = usePocket();
  const [isLoading, setIsLoading] = useState(true);
  const { waiverId: pathWaiverId } = useParams();

  const [memberResults, setMemberResults] = useState<Participant[] | null>(
    null
  );

  const fetchUserStats = useCallback(async () => {
    let userId: string | undefined;
    let waiverId: string | undefined;

    if (!pathWaiverId) {
      userId = user?.id;
      if (!userId) {
        toast({
          title: "User ID Not Found",
          variant: "destructive",
          duration: 5000,
          description:
            "Are you sure you're logged in? Try logging out and logging back in.",
        });
        setIsLoading(false);
        return;
      }
      const { id } = await pb
        .collection("waivers")
        .getFirstListItem(pb.filter("user_id = {:userId}", { userId }));

      if (!id) {
        toast({
          title: "Waiver ID Not Found",
          variant: "destructive",
          duration: 5000,
          description:
            "Waiver ID not found. You might need to get the committee to link your user and waiver.",
        });
        setIsLoading(false);
        return;
      }

      waiverId = id;
    }

    if (pathWaiverId) {
      waiverId = pathWaiverId;
    }

    const resResults = (await pb.collection("participant_runs").getFullList({
      filter: pb.filter("waiver_id = {:waiverId}", { waiverId }),
    })) as Participant[];

    setMemberResults(resResults);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!memberResults || memberResults?.length == 0) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="font-bold text-3xl">No Results Found</h1>
        <p className="max-w-3xl">
          Couldn't find results for this member. If you're trying to access your
          own stats, have you asked a commitee member to link your account and
          waiver form yet?
        </p>
      </div>
    );
  }

  const fiveKmResults = memberResults.filter((result) => result.distance == 5);
  const threeKmResults = memberResults.filter(
    (result) => result.distance == 3.5
  );

  const fiveKmGraphData = fiveKmResults.map((result) => ({
    date: new Date(result.created as string).toLocaleDateString(),
    time: result.time_seconds ?? 0,
  }));

  const threeKmGraphData = threeKmResults.map((result) => ({
    date: new Date(result.created as string).toLocaleDateString(),
    time: result.time_seconds ?? 0,
  }));

  return (
    <div className="space-y-8">
      <h1 className="font-bold text-5xl">
        {pathWaiverId ? "Member Results" : "Your Results"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Total Run Count</CardTitle>
              <CardDescription>
                This is the total number of times you have run at Gunnies across
                all distances.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow justify-center items-center">
              <p className="font-bold text-5xl m-auto">
                {memberResults.length}
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>5km Run Count</CardTitle>
              <CardDescription>
                This is the number of times you have run a 5km at Gunnies.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow justify-center items-center">
              <p className="font-bold text-5xl m-auto">
                {fiveKmResults.length}
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>3.5km Run Count</CardTitle>
              <CardDescription>
                This is the number of times you have run a 3.5km at Gunnies.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow justify-center items-center">
              <p className="font-bold text-5xl m-auto">
                {threeKmResults.length}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>5km Time History</CardTitle>
            <CardDescription>
              This is the time you took for each of your 5km runs. Lower is
              better.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" aspect={1.5}>
              <LineChart
                data={fiveKmGraphData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>3.5km Time History</CardTitle>
            <CardDescription>
              This is the time you took for each of your 3.5km runs. Lower is
              better.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" aspect={1.5}>
              <LineChart
                data={threeKmGraphData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h2 className="font-bold text-2xl">Your 5km Results</h2>
          <RunTable columnsType="stats" participants={fiveKmResults} />
        </div>
        <div>
          <h2 className="font-bold text-2xl">Your 3.5km Results</h2>
          <RunTable columnsType="stats" participants={threeKmResults} />
        </div>
      </div>
    </div>
  );
}
