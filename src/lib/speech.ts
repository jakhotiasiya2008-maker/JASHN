/**
 * Jashn Voice Input Helper (Web Speech API)
 * Gracefully handles unsupported browsers, permissions, and speech recognition events.
 */

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
  };
}

interface SpeechRecognitionEvent {
  results?: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface IWindow extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as IWindow;
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function startSpeechRecognition(
  onTranscript: (text: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
): { stop: () => void } | null {
  if (typeof window === 'undefined') return null;
  const win = window as IWindow;
  const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        onError('Microphone access was denied. Please check your browser permissions.');
      } else if (event.error === 'no-speech') {
        onError('No speech was detected. Please try again.');
      } else {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (_err) {
    onError('Failed to initialize speech recognition.');
    return null;
  }
}
