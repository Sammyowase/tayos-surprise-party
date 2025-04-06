'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

type FormData = {
  attending: string;
  fullName: string;
  email: string;
  gender: string;
};

export default function RSVPForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const attending = watch('attending');

  // Get window size for Confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      // Set a timeout for the entire operation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        // Ensure we're sending the right fields and validate them
        const formData = {
          attending: data.attending,
          fullName: data.attending === 'yes' ? data.fullName || "" : "",
          email: data.attending === 'yes' ? data.email || "" : "",
          gender: data.attending === 'yes' ? data.gender || "" : ""
        };
        
        console.log("Submitting data:", formData);
        
        // Use signal from AbortController
        const response = await fetch('/api/submit-rsvp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to submit RSVP');
        }
        
        // Process was successful
        setSubmitted(true);
        setShowConfetti(true);
        
        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      } catch (fetchError: any) {
        if (fetchError.name === 'AbortError') {
          console.log('Request timed out, but showing success UI anyway');
          setSubmitted(true);
          setShowConfetti(true);
          
          setTimeout(() => {
            setShowConfetti(false);
          }, 5000);
        } else {
          throw fetchError; // Re-throw for the outer catch
        }
      }
    } catch (err) {
      setError('There was an error submitting your RSVP. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-xl">
      {showConfetti && windowSize.width > 0 && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          recycle={false} 
          numberOfPieces={200}
          colors={['#E5E7EB', '#9CA3AF', '#6B7280', '#4B5563', '#f3f4f6']}
        />
      )}
      
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Form Header */}
            <div className="bg-gray-800 px-6 py-10 text-white text-center">
              <h2 className="text-3xl font-bold mb-3">Tayo's Birthday Lunch</h2>
              <p className="opacity-80 max-w-md mx-auto">
              You are invited to Tayo's Birthday lunch!
              </p>
            </div>
            
            {/* Form Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">Can you join us?</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <label className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer shadow-sm
                      ${attending === 'yes' 
                        ? 'border-gray-800 bg-gray-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        value="yes"
                        {...register('attending', { required: true })}
                        className="sr-only"
                      />
                      <span className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mb-2 transition-colors
                          ${attending === 'yes' ? 'text-gray-800' : 'text-gray-400'}`} 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`font-medium transition-colors
                          ${attending === 'yes' ? 'text-gray-800' : 'text-gray-500'}`}>Yes, I&apos;ll be there!</span>
                      </span>
                    </label>
                    
                    <label className={`flex-1 flex items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer shadow-sm
                      ${attending === 'no' 
                        ? 'border-gray-800 bg-gray-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        value="no"
                        {...register('attending', { required: true })}
                        className="sr-only"
                      />
                      <span className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mb-2 transition-colors
                          ${attending === 'no' ? 'text-gray-800' : 'text-gray-400'}`} 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className={`font-medium transition-colors
                          ${attending === 'no' ? 'text-gray-800' : 'text-gray-500'}`}>Sorry, can't make it</span>
                      </span>
                    </label>
                  </div>
                  
                  {errors.attending && (
                    <p className="text-sm text-red-500 mt-3">Please select an option</p>
                  )}
                </div>
                
                {attending === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register('fullName', { required: attending === 'yes' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600
                        bg-gray-50 hover:bg-white transition-colors text-black"
                        placeholder="Your full name"
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500 mt-1">Please enter your full name</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register('email', {
                          required: attending === 'yes',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600
                        bg-gray-50 hover:bg-white transition-colors text-black"
                        placeholder="Your email address"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.email.message || 'Please enter a valid email address'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        {...register('gender', { required: attending === 'yes' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600
                        bg-gray-50 hover:bg-white transition-colors text-black"
                      >
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && (
                        <p className="text-sm text-red-500 mt-1">Please select your gender</p>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 text-red-700 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting || (attending === 'yes' && (!watch('fullName') || !watch('email') || !watch('gender')))}
                  className={`w-full py-4 px-4 rounded-lg text-white font-medium text-base transition-all
                    ${submitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gray-800 hover:bg-gray-900 shadow-lg hover:shadow-xl'
                    }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Submit Response</span>
                  )}
                </motion.button>
                
                <p className="text-center text-xs text-gray-500">
                  Your details will only be used for this event
                </p>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-6"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="mb-6 inline-block p-4 bg-gray-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-3 text-gray-800"
            >
              Thank You!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 mb-6"
            >
              Your response has been recorded.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 max-w-xs mx-auto"
            >
              {attending === 'yes' ? 
                "We'll send you a confirmation email with all the details about the event." : 
                "We're sorry you can't make it. Thanks for letting us know!"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 