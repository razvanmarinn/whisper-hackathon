import MicRecorder from 'mic-recorder-to-mp3';
import React,{useState,useEffect} from 'react';
import { useSpeechSynthesis } from "react-speech-kit";
import './App.css'
import { BiMicrophone } from "react-icons/bi";
import { BiMicrophoneOff } from "react-icons/bi";

 const Mp3Recorder = new MicRecorder({ bitRate: 128 });





const App = ()=>{
const { speak } = useSpeechSynthesis();
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
          speak({text: res.results[0].answer});
    })})})}
    return( <><div className='flex justify-center items-center h-screen w-screen flex-col'>
      <div className='space-x-[5rem] mb-[2rem]'>
<button onClick={()=>start()} disabled={state.isRecording} className='text-[2rem] active:text-red-800 focus:text-red-800 disable:text-black'>
 < BiMicrophone/>
</button>
<button onClick={()=>stop()} disabled={!state.isRecording} className='text-[2rem] active:text-red-800 focus:text-red-800 disable:text-black'>
  <BiMicrophoneOff/>
</button>
</div>
     

{result ? <><p className='text-[2rem] mb-[12px]'>{result.results[0].transcript}</p> <p className='text-[2rem]'>{result.results[0].answer}</p></> : '' }


      
</div></> )


}
export default App;
