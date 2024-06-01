import { renderHook, act } from '@testing-library/react-hooks';
import { useNextjsAudioToTextRecognition } from './useNextjsAudioToTextRecognition';

describe('useNextjsAudioToTextRecognition', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'SpeechRecognition', {
      value: class SpeechRecognitionMock {
        onresult: any;
        onerror: any;
        onend: any;
        start: any;
        stop: any;
        interimResults: boolean;
        lang: string;
        continuous: boolean;
        grammars: null;
        
        constructor() {
          this.onresult = jest.fn();
          this.onerror = jest.fn();
          this.onend = jest.fn();
          this.start = jest.fn();
          this.stop = jest.fn();
          this.interimResults = true;
          this.lang = 'en-US';
          this.continuous = false;
          this.grammars = null;
        }
      },
    });
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() =>
      useNextjsAudioToTextRecognition({ interimResults: true })
    );

    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe('');
    expect(result.current.startListening).toBeDefined();
    expect(result.current.stopListening).toBeDefined();
  });

  it('should start listening and update state', async () => {
    const { result } = renderHook(
      () => useNextjsAudioToTextRecognition({ interimResults: true }),
      { wrapper: TestWrapper } // Assuming TestWrapper is a component that provides a mock SpeechRecognition instance
    );

    await act(async () => {
      result.current.startListening();
    });

    expect(result.current.isListening).toBe(true);
    expect(result.current.recognition.start).toHaveBeenCalled();
  });

  it('should stop listening and reset state', async () => {
    const { result } = renderHook(
      () => useNextjsAudioToTextRecognition({ interimResults: true }),
      { wrapper: TestWrapper } // Assuming TestWrapper is a component that provides a mock SpeechRecognition instance
    );

    await act(async () => {
      result.current.startListening();
    });

    await act(async () => {
      result.current.stopListening();
    });

    expect(result.current.isListening).toBe(false);
    expect(result.current.recognition.stop).toHaveBeenCalled();
  });

  it('should handle interim results', async () => {
    const mockTranscript = 'Hello world';
    const { result } = renderHook(
      () => useNextjsAudioToTextRecognition({ interimResults: true }),
      { wrapper: TestWrapper } // Assuming TestWrapper is a component that provides a mock SpeechRecognition instance
    );

    await act(async () => {
      result.current.startListening();
    });

    // Simulate receiving an interim result
    result.current.recognition.onresult.mock.calls[0][0].results[0][0].transcript = mockTranscript;

    expect(result.current.transcript).toBe(mockTranscript);
  });

  it('should handle errors', async () => {
    const { result } = renderHook(
      () => useNextjsAudioToTextRecognition({ interimResults: true }),
      { wrapper: TestWrapper } // Assuming TestWrapper is a component that provides a mock SpeechRecognition instance
    );

    await act(async () => {
      result.current.startListening();
    });

    // Simulate an error occurring
    result.current.recognition.onerror.mock.calls[0][0].error = 'aborted';

    expect(result.current.isListening).toBe(false);
    expect(result.current.recognition.stop).toHaveBeenCalled();
  });
});
function beforeEach(arg0: () => void) {
  throw new Error('Function not implemented.');
}

