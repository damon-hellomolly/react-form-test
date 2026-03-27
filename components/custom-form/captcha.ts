export interface CaptchaChallenge {
  left: number;
  right: number;
  operator: "+" | "-";
  question: string;
  answer: number;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createCaptchaChallenge(): CaptchaChallenge {
  const operator: CaptchaChallenge["operator"] = Math.random() > 0.5 ? "+" : "-";
  const left = getRandomInt(1, 20);
  const right = getRandomInt(1, 20);

  if (operator === "+") {
    return {
      left,
      right,
      operator,
      question: `${left} + ${right} = ?`,
      answer: left + right,
    };
  }

  const larger = Math.max(left, right);
  const smaller = Math.min(left, right);

  return {
    left: larger,
    right: smaller,
    operator,
    question: `${larger} - ${smaller} = ?`,
    answer: larger - smaller,
  };
}

export function validateCaptchaInput(
  captchaInput: string,
  expectedAnswer: number,
): string | null {
  const normalized = captchaInput.trim();

  if (!normalized) {
    return "CAPTCHA is required.";
  }

  if (!/^-?\d+$/.test(normalized)) {
    return "CAPTCHA must be a number.";
  }

  if (Number(normalized) !== expectedAnswer) {
    return "CAPTCHA is incorrect.";
  }

  return null;
}
