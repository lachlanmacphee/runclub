import { Button } from "@/components/ui/button";
import { usePocket } from "@/contexts";
import { Trivia, User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getWeek } from "date-fns";
import Client, { ListResult } from "pocketbase";
import { useState } from "react";

const url = "https://the-trivia-api.com/v2/questions/?limit=1";

type Question = {
  category: string;
  id: string;
  tags: string;
  difficulty: string;
  regions?: string;
  isNiche: boolean;
  question: {
    text: string;
  };
  correctAnswer: string;
  incorrectAnswers: string[];
  answers: string[];
  type: string;
};

function getButtonStyle(
  answer: string,
  selectedAnswer: string | undefined,
  correctAnswer: string
) {
  if (!selectedAnswer) return "h-24 sm:h-48 whitespace-normal";
  if (answer === correctAnswer)
    return "bg-green-500 hover:bg-green-500 h-24 sm:h-48 whitespace-normal";
  if (answer === selectedAnswer)
    return "bg-red-500 hover:bg-red-500 h-24 sm:h-48 whitespace-normal";
  return "h-24 sm:h-48 whitespace-normal";
}

async function updateTriviaTable(
  pb: Client,
  user: User,
  answer: string,
  correctAnswer: string
) {
  const correct = answer == correctAnswer;

  const existingEntries: ListResult<Trivia> = await pb
    .collection("trivia")
    .getList(1, 1, {
      filter: pb.filter("user = {:user}", {
        user: user.id,
      }),
    });
  if (existingEntries?.items?.length > 0) {
    const userEntry = existingEntries.items[0];
    await pb.collection("trivia").update(userEntry.id, {
      correct: userEntry.correct + (correct ? 1 : 0),
      incorrect: userEntry.incorrect + (correct ? 0 : 1),
    });
  } else {
    await pb.collection("trivia").create({
      user: user?.id,
      correct: correct ? 1 : 0,
      incorrect: correct ? 0 : 1,
    });
  }
}

export const TriviaPage = () => {
  const { pb, user } = usePocket();

  const {
    isPending,
    isRefetching,
    error,
    data: question,
    refetch,
  } = useQuery({
    queryKey: ["triviaQuestions"],
    queryFn: () =>
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          const question = json[0];
          return {
            ...question,
            answers: [question.correctAnswer, ...question.incorrectAnswers]
              .map((value) => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value),
          } as Question;
        }),
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string>();

  function handleAnswer(
    pb: Client,
    user: User,
    answer: string,
    correctAnswer: string
  ) {
    setSelectedAnswer(answer);
    updateTriviaTable(pb, user, answer, correctAnswer);
    setTimeout(() => {
      setSelectedAnswer(undefined);
      refetch();
    }, 2000);
  }

  if (!user) {
    return <p>You must be logged in to view this page!</p>;
  }

  if (isPending || isRefetching)
    return (
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 grow max-w-3xl">
          <h1 className="text-5xl font-bold">Trivia</h1>
          <h2 className="italic">
            Week {getWeek(new Date(), { weekStartsOn: 1 })} of{" "}
            {new Date().getFullYear()}
          </h2>
          <p>Loading...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-2 animate-pulse">
            {[1, 2, 3, 4].map((answer) => (
              <Button className="h-24 sm:h-48" key={answer} disabled />
            ))}
          </div>
        </div>
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 grow max-w-3xl">
        <h1 className="text-5xl font-bold">Trivia</h1>
        <h2 className="italic">
          Week {getWeek(new Date(), { weekStartsOn: 1 })} of{" "}
          {new Date().getFullYear()}
        </h2>
        <p>{question.question.text}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-2">
          {question.answers.map((answer) => (
            <Button
              key={answer}
              className={getButtonStyle(
                answer,
                selectedAnswer,
                question.correctAnswer
              )}
              disabled={!!selectedAnswer}
              onClick={() =>
                handleAnswer(pb, user, answer, question.correctAnswer)
              }
            >
              {answer}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
