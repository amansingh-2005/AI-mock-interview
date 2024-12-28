import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionSection({ mockInterviewQuestion,activeQuestionIndex }) {
  const textToSpeach=(text)=>{
    if('speechSynthesis' in window){
      const speech=new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert("your browser does't not  support text to speech")
    }
  }
  return mockInterviewQuestion&&(
    <div className="p-5 border rounded-lg my-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* Check if mockInterviewQuestion is an array */}
        {Array.isArray(mockInterviewQuestion) && mockInterviewQuestion.length > 0 &&
          mockInterviewQuestion.map((question, index) => (
            <div key={index} className="text-center">
              {/* Button-like styling for question */}
              <h2 className={`p-3 bg-gray-200 rounded-full text-xs md:text-sm hover:bg-gray-300 cursor-pointer ${activeQuestionIndex==index&&'bg-primary text-white'}`}>
                Question #{index + 1}
              </h2>
            </div>
          ))
        }
      </div>
      <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
      <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
      <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex gap-2 items-center '>
          <Lightbulb/>
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_INFORMATIONS}</h2>
      </div>
    </div>
  );
}

export default QuestionSection;
