"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModel'
import { FanIcon, Loader2, LoaderCircle } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { db } from '@/utils/db'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'
// import { useRouter } from 'next/navigation'


function AddNewInterview() {
    const [openDailog, setOpenDailog] = useState(false)
    const [JobPosition, setJobPosition] = useState();
    const [JobDesc, setJobDesc] = useState();
    const [JobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setjsonResponse] = useState([]);
    const { user } = useUser();
    const router=useRouter();
    const onSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        console.log(JobPosition, JobDesc, JobExperience)

        const InputPrompt = "Job position: " + JobPosition + ", Job Description:" + JobDesc + ", Years of Experience: " + JobExperience + ", Depends on Job Position, JobDescription & Years of Experience give us " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " Interview question along with Answer in JSON format, Give us question and answer field on JSON"

        const result = await chatSession.sendMessage(InputPrompt);

        const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
        console.log(JSON.parse(MockJsonResp));
        setjsonResponse(MockJsonResp);
        if (MockJsonResp) {
            const resp = await db.insert(MockInterview)
                .values({
                    mockId: uuidv4(),
                    jsonMockResp: MockJsonResp,
                    jobPosition: JobPosition,
                    jobDesc: JobDesc,
                    jobExperience: JobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-YYYY')
                }).returning({ mockId: MockInterview.mockId })

            console.log("Inserted ID:", resp)
            if(resp){
                setOpenDailog(false);
                router.push('/interview/'+resp[0]?.mockId)
            }
        }
        else {
            console.log("ERROR");
        }
        setLoading(false)
    }
    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setOpenDailog(true)}>
                <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDailog}>

                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Tell us more about your job Interviewing</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>

                                    <h2>Add Details about your job position/role, job description and years of experiences</h2>
                                    <div className='mt-7 my-3'>
                                        <label>Job role/Job position</label>
                                        <Input placeholder="Ex.Full stack developer" required onChange={(event) => setJobPosition(event.target.value)} />
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Description/ Tech Stack (In Short)</label>
                                        <Textarea placeholder="Ex.AI&ML,Blockchain,App Developer" required onChange={(event) => setJobDesc(event.target.value)} />
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Experiences</label>
                                        <Input placeholder="Ex.5 years" type="number" max="50" required onChange={(event) => setJobExperience(event.target.value)} />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type="button" variant='ghost' onClick={() => setOpenDailog(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ?
                                            <>
                                                <LoaderCircle className='animate-spin' />'Genrating from AI'
                                            </> : 'Start Interview'
                                        }
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddNewInterview