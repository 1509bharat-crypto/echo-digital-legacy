'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    title: 'Let\'s begin your Echo journey',
    subtitle: 'First, tell us a little about yourself',
    fields: [
      { name: 'firstName', label: 'First name', type: 'text', placeholder: 'Your first name' },
      { name: 'lastName', label: 'Last name', type: 'text', placeholder: 'Your last name' },
      { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
    ],
  },
  {
    id: 2,
    title: 'What matters most to you?',
    subtitle: 'Select the types of memories you want to preserve',
    options: [
      { value: 'photos', label: 'Photos & Videos', description: 'Visual memories from your life' },
      { value: 'messages', label: 'Messages & Letters', description: 'Written words and conversations' },
      { value: 'music', label: 'Music & Playlists', description: 'The soundtrack of your life' },
      { value: 'documents', label: 'Documents & Writing', description: 'Your thoughts and creations' },
      { value: 'social', label: 'Social Media', description: 'Your digital presence and connections' },
      { value: 'other', label: 'Other Memories', description: 'Anything else meaningful to you' },
    ],
  },
  {
    id: 3,
    title: 'Who will receive your Echo?',
    subtitle: 'Designate the loved ones who will experience your legacy',
    fields: [
      { name: 'recipient1', label: 'Primary recipient', type: 'text', placeholder: 'Name of your primary recipient' },
      { name: 'recipient1Email', label: 'Their email', type: 'email', placeholder: 'their@email.com' },
      { name: 'relationship', label: 'Your relationship', type: 'text', placeholder: 'e.g., Daughter, Partner, Friend' },
    ],
  },
  {
    id: 4,
    title: 'You\'re ready to begin',
    subtitle: 'We\'ll guide you through the curation process step by step',
    summary: true,
  },
];

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const step = steps[currentStep];

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionToggle = (value: string) => {
    setSelectedOptions(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { ...formData, memoryTypes: selectedOptions });
    // Handle form submission
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Progress Bar */}
      <div className="px-6 lg:px-12 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step Header */}
              <div className="mb-10">
                <h1 className="font-serif text-3xl lg:text-4xl font-light mb-3">
                  {step.title}
                </h1>
                <p className="text-gray-400 text-lg">
                  {step.subtitle}
                </p>
              </div>

              {/* Step Content */}
              {'fields' in step && step.fields && (
                <div className="space-y-6">
                  {step.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm text-gray-400 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={(formData[field.name] as string) || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}

              {'options' in step && step.options && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionToggle(option.value)}
                      className={`p-5 border rounded-xl text-left transition-all ${
                        selectedOptions.includes(option.value)
                          ? 'border-white bg-white/5'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium mb-1">{option.label}</h3>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                        {selectedOptions.includes(option.value) && (
                          <Check size={20} className="text-white flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {'summary' in step && step.summary && (
                <div className="space-y-6">
                  <div className="p-6 border border-white/20 rounded-xl">
                    <h3 className="font-medium mb-4">Your Echo Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name</span>
                        <span>{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email</span>
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Memory types</span>
                        <span>{selectedOptions.length} selected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Primary recipient</span>
                        <span>{formData.recipient1}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    By clicking &quot;Begin curation&quot;, you agree to our Terms of Service and 
                    Privacy Policy. Your data is encrypted and never shared without your consent.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 lg:px-12 py-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Cancel
            </Link>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Begin curation
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
