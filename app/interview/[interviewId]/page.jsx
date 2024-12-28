'use client';

import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useParams } from 'next/navigation'; // Import useParams for handling params

function Interview() {
  const params = useParams(); // Get params dynamically
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    if (params?.interviewId) {
      console.log(params.interviewId);
      GetInterviewDetails(params.interviewId);
    }
  }, [params?.interviewId]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      setInterviewData(result[0]);
    } catch (error) {
      console.error('Failed to fetch interview details:', error);
    }
  };

  return (
    <div className="my-10 px-5 md:px-20">
      <h2 className="font-bold text-2xl text-center mb-10">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left Section */}
        <div className="flex flex-col gap-5">
          <div className="p-5 rounded-lg border gap-5 bg-white shadow-md">
            <h2 className="text-lg">
              <strong>Job Role/Job Position:</strong> {interviewData?.jobPosition || 'Loading...'}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack:</strong> {interviewData?.jobDesc || 'Loading...'}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience:</strong> {interviewData?.jobExperience || 'Loading...'}
            </h2>
          </div>
          <div className="p-5 rounded-lg border border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <p className="mt-3 text-yellow-500">
              Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. It has 5 questions which you
              can answer, and at the last, you will get the report based on your answer. <br />
              <br />
              <strong>NOTE:</strong> We never record your video. Webcam access can be disabled at any time.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center gap-5">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
                borderRadius: '8px',
                border: '1px solid #ddd',
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-60 w-60 bg-gray-200 rounded-lg border" />
              <Button
                variant="ghost"
                onClick={() => setWebCamEnabled(true)}
                className="bg-indigo-600 text-white"
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Link href={`/interview/${params?.interviewId}/start`}>
          <Button className="bg-indigo-600 text-white">Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
