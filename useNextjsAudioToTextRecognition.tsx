import { useEffect, useState } from "react";

/**
 * useNextjsAudioToTextRecognition
 * Handles stopping and starting internal sensor to listen to users
 * voice and add it to the input
 *
 * Uses @webkitSpeechRecognition
 */

interface Options {
  interimResults?: boolean;
  lang?: string;
  continuous?: boolean;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  setTranscript: (text: string) => void;
  startListening: () => void;
  stopListening: () => void;
}

const useNextjsAudioToTextRecognition = (
  options: Options
): UseSpeechToTextReturn => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [recognition] = useState<SpeechRecognition | undefined>(() => {
    // Check webkitSpeechRecognition exists in window object
    if (
      typeof window === "undefined" ||
      !("webkitSpeechRecognition" in window)
    ) {
      return;
    }

    // Initialize webkitSpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.interimResults = options?.interimResults ?? true;
    recognition.lang = options.lang ?? "en-US";
    recognition.continuous = options.continuous ?? false;

    const grammar =
      "#JSGF V1.0; grammer punctuation; public <punc> =. |, |? | | ; | : ;";
    const speechRecognitionList = new window.webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    return recognition;
  });

  useEffect(() => {
    if (!recognition) {
      throw new Error("ERROR: recognition does not exist!");
    }

    const handleResult = (event: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      console.log("Error occurred:", event.error);
      console.log("Detailed error message:", event.message);
      if (event.error === "aborted") {
        throw new Error("ERROR: speech recognition was aborted.");
      }
      setIsListening(false);
    };

    const handleEnd = () => {
      setIsListening(false);
      setTranscript("");
    };

    recognition.addEventListener("result", handleResult);
    recognition.addEventListener("error", handleError);
    recognition.addEventListener("end", handleEnd);

    return () => {
      recognition.removeEventListener("result", handleResult);
      recognition.removeEventListener("error", handleError);
      recognition.removeEventListener("end", handleEnd);
    };
  }, [options.lang, options.continuous, recognition]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    setTranscript,
    startListening,
    stopListening,
  };
};

module.exports = useNextjsAudioToTextRecognition;
