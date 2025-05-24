"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea"
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/button';

type FormValues = {
  email: string;
  subject: string;
  inquiry: string;
  isRead: boolean;
};

const Contact = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const body = {
      email: data.email,
      subject: data.subject,
      inquiry: data.inquiry,
      isRead: false,
    }

    try {
      const response = await axios.post('/api/enquiry', body);
      console.log('Enquiry submitted:', response.data);
      toast.success('Enquiry submitted successfully!');
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Submission error:', error.response?.data);
        toast.error(error.response?.data.message || 'Failed to submit enquiry. Please try again.');
      } else {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className='w-11/12 mx-auto pt-4 pb-14 font-unbounded text-black min-h-[100vh]'>
      <h3 className=' font-semibold text-[2rem] text-center mb-6'>CONTACT US</h3>
      <div className=' w-full flex flex-col-reverse md:flex-row gap-4'>

        {/* left side  */}
        <div className=' w-full md:w-3/12 shadow-4-side p-4 flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-xl  font-normal bg-white'>

          {/* location section  */}
          <div className='flex flex-col justify-center items-center text-center md:-mt-5 mt-0'>
            <div className='w-[50px] h-[50px]'>
              <Image src={"/images/location.png"} width={50} height={50} alt='location' className='object-contain w-full h-full' />
            </div>
            <p>
              <Link href="https://www.google.com/maps/search/?api=1&query=201+SE+2nd+Ave,+Miami,+FL+33131,+USA" className=' hover:underline' target="_blank" rel="noopener noreferrer" > 201 SE 2nd Ave, <br /> Miami, FL 33131, USA
              </Link>
            </p>
          </div>

          <hr className=' border border-gray-200 w-full' />

          {/* inbox section  */}
          <div className='flex flex-col justify-center items-center text-center'> <div className='w-[50px] h-[50px]'>
            <Image src={"/images/mail.png"} width={50} height={50} alt='email' className='object-contain w-full h-full' />
          </div>
            <div className='flex flex-col'>
              <Link href="mailto:info@itips.com" className=' hover:underline'> info@itips.com </Link>
            </div>
          </div>

          {/* <hr className=' border w-full' /> */}

          {/* call section  */}
          {/* <div className='flex flex-col justify-center items-center text-center'> <div className='w-[50px] h-[50px]'>
            <Image src={"/call.png"} width={50} height={50} alt='call' className='object-contain w-full h-full' />
          </div>
            <div className='flex flex-col'>
              <Link href="tel:1115555555" className=' hover:underline'> (111) 555-5555 </Link>
              <Link href="tel:1115555555" className=' hover:underline'> (111) 555-5555 </Link>
            </div>
          </div> */}

        </div>

        {/* right side  */}
        <div className=' w-full shadow-4-side p-8 border border-gray-300 rounded-xl flex flex-col gap-4 -mt-4 md:mt-0'>

          <h3 className=' font-plusSans text-[1.5rem] font-medium'>Say Hello!</h3>

          <p className=' text-slate w-10/12'>For any inquiries, assistance, or further information, please feel free to reach out to us, and our dedicated team will be delighted to assist you as promptly as possible.</p>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

            <div>
              <Input className=' rounded-full bg-white ' id='email' placeholder='Enter your e-mail' {...register("email", {
                required: "required*",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })} />
              {errors.email && <p className=' text-[0.8rem] text-red-400 ml-4'>{errors.email.message}</p>}
            </div>

            <div>
              <Input className='bg-white rounded-full' id='subject' placeholder='Subject' {...register("subject", { required: "required*" })} />
              {errors.subject && <p className=' text-[0.8rem] text-red-400 ml-4'>{errors.subject.message}</p>}
            </div>

            <div>
              <Textarea className=' bg-white' {...register("inquiry", { required: "required*" })} placeholder='Your inquiry' />
              {errors.inquiry && <p className=' text-[0.8rem] text-red-400 ml-4'>{errors.inquiry.message}</p>}
            </div>

            <div>
              <Button className=''>
                {loading ? (
                  <span className="flex items-center gap-2">
                    Sending <FaSpinner className="animate-spin" />
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>

          </form>

        </div>
        <div>

        </div>
      </div>
    </div>
  )
}

export default Contact
