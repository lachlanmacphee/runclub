import { useState } from "react";
import { Participant } from "@/types";

// Components
import { RunSetup } from "@/components/newRun/runSetup";
import { RunTiming } from "@/components/newRun/runTiming";

export function NewRun() {
  const [step, setStep] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);

  switch (step) {
    case 0:
      return <RunSetup setStep={setStep} setParticipants={setParticipants} />;
    case 1:
      return <RunTiming participants={participants} />;
  }
}
