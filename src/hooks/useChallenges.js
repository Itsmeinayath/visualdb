import { useState, useEffect } from "react";

/**
 * Manages a list of challenge questions for a module.
 * Tracks which challenges pass/fail, navigation between them.
 *
 * @param {Array<{id: string, question: string|JSX.Element, validate: (resultSetData, parsedAST) => boolean}>} challenges
 */
export function useChallenges(challenges) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [statuses, setStatuses] = useState(
    () => challenges.map(() => "idle") // "idle" | "pass" | "fail"
  );

  const total = challenges.length;
  const current = challenges[currentIdx];
  const currentStatus = statuses[currentIdx];
  const allPassed = statuses.every((s) => s === "pass");

  const checkAnswer = (resultSetData, parsedAST) => {
    const passed = current.validate(resultSetData, parsedAST);
    setStatuses((prev) => {
      const next = [...prev];
      next[currentIdx] = passed ? "pass" : "fail";
      return next;
    });
    return passed;
  };

  const resetChallenge = () => {
    setStatuses((prev) => {
      const next = [...prev];
      next[currentIdx] = "idle";
      return next;
    });
  };

  const goTo = (idx) => {
    if (idx >= 0 && idx < total) setCurrentIdx(idx);
  };

  const goNext = () => goTo(currentIdx + 1);
  const goPrev = () => goTo(currentIdx - 1);

  return {
    currentIdx,
    total,
    current,
    currentStatus,
    allPassed,
    statuses,
    checkAnswer,
    resetChallenge,
    goTo,
    goNext,
    goPrev,
  };
}
