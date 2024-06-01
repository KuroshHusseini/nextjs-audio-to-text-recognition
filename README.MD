# nextjs-audio-to-text-recognition

Nextjs-audio-to-text-recognition is a React hook designed to facilitate real-time audio-to-text conversion using the Web Speech API's webkitSpeechRecognition. This hook listens to user voice input and converts it into text, making it easy to integrate speech recognition functionalities into your React applications.

### Installation

`npm i nextjs-audio-to-text-recognition` or `yarn add nextjs-audio-to-text-recognition`

### Usage

```
function MyComponent() {
const {
isListening,
transcript,
setTranscript,
startListening,
stopListening,
} = useNextjsAudioToTextRecognition({ lang: 'en-US', continuous: true });

return (

<div>
<button onClick={startListening}>Start Listening</button>
<button onClick={stopListening}>Stop Listening</button>
<p>{transcript}</p>
</div>
);
}

```

# Options

The hook accepts an `Options` object with the following properties:

- `interimResults`: Boolean (optional) - Whether to return interim results. Defaults to `true`.
- `lang`: String (optional) - Language code for speech recognition. Defaults to `'en-US'`.
- `continuous`: Boolean (optional) - Whether to continuously recognize speech until stopped. Defaults to `false`.

## License

MIT

