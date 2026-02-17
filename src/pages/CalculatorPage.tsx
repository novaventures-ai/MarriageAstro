import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BirthDataForm } from '../components/BirthDataForm';
import { useAppStore } from '../store/useAppStore';
import { ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthButton } from '../components/ui/AuthButton';
import { Logo } from '../components/ui/Logo';

export const CalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { generateReport, isLoading, error, clearError } = useAppStore();
  const [personAData, setPersonAData] = useState<any>(null);
  const [personBData, setPersonBData] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const handlePersonASubmit = (data: any) => {
    setPersonAData(data);
    setStep(2);
  };

  const handlePersonBSubmit = (data: any) => {
    setPersonBData(data);
    setStep(3);
  };

  const handleGenerateReport = async () => {
    if (personAData && personBData) {
      await generateReport(personAData, personBData);
      // Only navigate if there's no error in the store
      const state = useAppStore.getState();
      if (!state.error) {
        navigate('/report');
      }
    }
  };


  return (
    <div className="min-h-screen py-12 px-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group"
          >
            <Logo size="sm" />
          </button>
          <div className="flex items-center gap-3">
            <AuthButton />
            <ThemeToggle />
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors">
            Compatibility Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">
            Enter birth details for both partners to generate a comprehensive analysis
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            <StepIndicator step={1} currentStep={step} label="Person 1" />
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded transition-colors">
              <div
                className={`h-full bg-indigo-600 dark:bg-indigo-500 rounded transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'
                  }`}
              />
            </div>
            <StepIndicator step={2} currentStep={step} label="Person 2" />
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded transition-colors">
              <div
                className={`h-full bg-indigo-600 dark:bg-indigo-500 rounded transition-all duration-300 ${step >= 3 ? 'w-full' : 'w-0'
                  }`}
              />
            </div>
            <StepIndicator step={3} currentStep={step} label="Report" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 transition-colors">
            {error}
            <button
              onClick={clearError}
              className="ml-4 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-all duration-500">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 transition-colors">
                Person 1 Details
              </h2>
              <BirthDataForm
                onSubmit={handlePersonASubmit}
                defaultValues={{ gender: 'male' }}
              />
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                  Person 2 Details
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm transition-colors"
                >
                  ← Back to Person 1
                </button>
              </div>
              <BirthDataForm
                onSubmit={handlePersonBSubmit}
                defaultValues={{ gender: 'female' }}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 transition-colors">
                Review & Generate Report
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <ReviewCard
                  title="Person 1"
                  data={personAData}
                />
                <ReviewCard
                  title="Person 2"
                  data={personBData}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Report
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StepIndicator: React.FC<{
  step: number;
  currentStep: number;
  label: string;
}> = ({ step, currentStep, label }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step <= currentStep
        ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}
    >
      {step}
    </div>
    <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 transition-colors">{label}</span>
  </div>
);

const ReviewCard: React.FC<{
  title: string;
  data: any;
}> = ({ title, data }) => (
  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-lg transition-all duration-500">
    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors">{title}</h3>
    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 transition-colors">
      <p><span className="font-medium dark:text-gray-300">Name:</span> {data?.name}</p>
      <p><span className="font-medium dark:text-gray-300">Gender:</span> {data?.gender}</p>
      <p><span className="font-medium dark:text-gray-300">Birth Date:</span> {data?.dateOfBirth}</p>
      <p><span className="font-medium dark:text-gray-300">Birth Time:</span> {data?.timeOfBirth}</p>
      <p><span className="font-medium dark:text-gray-300">Location:</span> {data?.location}</p>
    </div>
  </div>
);

export default CalculatorPage;