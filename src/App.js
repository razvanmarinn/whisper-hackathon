import MicRecorder from 'mic-recorder-to-mp3';
import React,{useState,useEffect} from 'react';




 const Mp3Recorder = new MicRecorder({ bitRate: 128 });





const App = ()=>{

  const [state,setState] = useState({
  isRecording: false,
  blobURL: '',
  isBlocked: false,
  })
  const [result,setResult] = useState('');
  useEffect(()=>{
navigator.getUserMedia({ audio: true },
  () => {
    console.log('Permission Granted');
    setState({ isBlocked: false, blobURL:'', isRecording:false });
  },
  () => {
    console.log('Permission Denied');
    setState({ isBlocked: true , blobURL:'', isRecording:false})
  },
);
  },state)

  const start = () => {
  if (state.isBlocked) {
    console.log('Permission Denied');
  } else {
    Mp3Recorder
      .start()
      .then(() => {
        setState({ isRecording: true,blobURL:'',isBlocked: false });
      }).catch((e) => console.error(e));
  }
};

const stop = () => {
  Mp3Recorder
    .stop()
    .getMp3()
    .then(([buffer, blob]) => {
      const blobURL = URL.createObjectURL(blob);
      setState({ blobURL, isRecording: false,isBlocked:false });
      const formatData = new FormData();
      formatData.append('audio-file',blob);
      return fetch('http://localhost:5000/whisper',{method:'POST',body: formatData}).then((res)=>{
        fetch('http://localhost:5000/getapi').then((res)=>res.json()).then(res=>{
          setResult(res);
    })})})}
    return( <>
<button onClick={()=>start()} disabled={state.isRecording}>
  Record
</button>
<button onClick={()=>stop()} disabled={!state.isRecording}>
  Stop
</button>
<audio src={state.blobURL} controls="controls" />
{result ? <p>{result.results[0].transcript}</p> : ''}

      
</>)


}
export default App;
