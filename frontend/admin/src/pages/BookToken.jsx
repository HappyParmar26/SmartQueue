import React, { useState } from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";

const STEPS = [
  { id: 1, title: "Select Office", desc: "Choose an office" },
  { id: 2, title: "Select Service", desc: "Pick the service" },
  { id: 3, title: "Choose Time", desc: "Pick a convenient time" },
  { id: 4, title: "Confirm Booking", desc: "Review your details" },
  { id: 5, title: "Success", desc: "Your token is booked" },
];

const token = {
  id: "B-142",
  office: "Ahmedabad RTO",
  service: "Driving License Renewal",
};
export default function BookToken() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Token</h1>
          <p className="text-gray-500 mt-2">
            Complete the steps below to secure your spot.
          </p>
        </div>

       
        {/* Progress Bar (Stepper) */}
        <div className="mb-16 sm:mb-20">
          {" "}
          {/* Increased bottom margin to fit absolute labels */}
          <div className="flex items-center w-full">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isLast = index === STEPS.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* Step Circle & Label Container */}
                  <div className="relative flex flex-col items-center">
                    {/* Circle */}
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors duration-300 relative z-10",
                        isActive
                          ? "bg-white border-blue-600 text-blue-600"
                          : isCompleted
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-200 text-gray-400",
                      )}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>

                    {/* Step Titles (Absolute positioned so they don't break the flex line spacing) */}
                    <div className="hidden sm:flex absolute top-12 w-32 flex-col items-center text-center">
                      <span
                        className={
                          ("text-sm font-semibold",
                          isActive
                            ? "text-blue-700"
                            : isCompleted
                              ? "text-gray-900"
                              : "text-gray-400")
                        }
                      >
                        {step.title}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {step.desc}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Connecting Line (Rendered between steps, skipped on the last step) */}
                  {!isLast && (
                    <div
                      className={clsx(
                        "flex-auto h-1 transition-colors duration-300 mx-2 sm:mx-4 rounded-full",
                        isCompleted ? "bg-blue-600" : "bg-gray-200",
                      )}
                    ></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
          {currentStep === 1 && <Step1Office />}
          {currentStep === 2 && <Step2Service />}
          {currentStep === 3 && <Step3Time />}
          {currentStep === 4 && <Step4Confirm />}
          {currentStep === 5 && <Step5Success />}

          {/* Navigation Buttons (Hidden on Step 5) */}
          {currentStep < 5 && (
            <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={clsx(
                  "px-6 py-2.5 rounded-xl font-medium transition-colors",
                  currentStep === 1
                    ? "text-gray-300 cursor-not-allowed bg-gray-50"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
                )}
              >
                Back
              </button>

              <button
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                {currentStep === 4 ? "Confirm & Book" : "Next Step"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Step Components ---

function Step1Office() {
  const offices = [
    {
      id: 1,
      name: "Regional Transport Office (RTO)",
      type: "Transport",
      dist: "2.4 km",
    },
    { id: 2, name: "Civil Hospital", type: "Healthcare", dist: "4.1 km" },
    {
      id: 3,
      name: "Municipal Corporation Center",
      type: "Civic Services",
      dist: "5.0 km",
    },
    { id: 4, name: "Passport Seva Kendra", type: "Identity", dist: "8.2 km" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Select a Government Office
      </h2>
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by office name or city..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {offices.map((office) => (
          <label
            key={office.id}
            className="relative flex cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500"
          >
            <input type="radio" name="office" className="sr-only peer" />
            <div className="flex w-full items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">
                  {office.type}
                </p>
                <p className="text-base font-bold text-gray-900">
                  {office.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">{office.dist} away</p>
              </div>
              {/* Custom Radio Circle */}
              <div className="h-5 w-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 flex items-center justify-center transition-colors">
                <div className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
              </div>
            </div>
            {/* Active Border State via Peer */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step2Service() {
  const services = [
    { id: 1, name: "Driving License Renewal", time: "~15 mins" },
    { id: 2, name: "Vehicle Registration (RC)", time: "~25 mins" },
    { id: 3, name: "Learner's License Test", time: "~45 mins" },
    { id: 4, name: "Address Update", time: "~10 mins" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Select Service</h2>
      <p className="text-gray-500 mb-6">
        Showing services for:{" "}
        <span className="font-medium text-gray-900">
          Regional Transport Office (RTO)
        </span>
      </p>

      <div className="space-y-3">
        {services.map((service) => (
          <label
            key={service.id}
            className="relative flex cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <input type="radio" name="service" className="sr-only peer" />
            <div className="flex w-full items-center justify-between">
              <span className="text-base font-semibold text-gray-900">
                {service.name}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  Est: {service.time}
                </span>
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-blue-600 pointer-events-none"></div>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step3Time() {
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Choose a Date & Time
      </h2>

      {/* Date Selection (Mocked as static for UI purposes) */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
          Available Dates
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {["Today", "Tomorrow", "Wed, Oct 24", "Thu, Oct 25"].map((day, i) => (
            <button
              key={i}
              className={clsx(
                "flex-shrink-0 px-5 py-3 rounded-xl border font-medium transition-colors",
                i === 0
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
          Available Time Slots
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {timeSlots.map((time, i) => (
            <label key={i} className="relative cursor-pointer">
              <input type="radio" name="timeSlot" className="sr-only peer" />
              <div className="text-center px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:border-blue-400 transition-all">
                {time}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4Confirm() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Confirm</h2>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-6">
        {/* Detail Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-gray-200 gap-2">
          <div>
            <p className="text-sm text-gray-500">Government Office</p>
            <p className="text-lg font-bold text-gray-900">
              Regional Transport Office (RTO)
            </p>
          </div>
          <button className="text-sm font-medium text-blue-600 self-start sm:self-center">
            Edit
          </button>
        </div>

        {/* Detail Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-gray-200 gap-2">
          <div>
            <p className="text-sm text-gray-500">Selected Service</p>
            <p className="text-lg font-bold text-gray-900">
              Driving License Renewal
            </p>
          </div>
          <button className="text-sm font-medium text-blue-600 self-start sm:self-center">
            Edit
          </button>
        </div>

        {/* Detail Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="text-lg font-bold text-gray-900">Today, 10:30 AM</p>
          </div>
          <button className="text-sm font-medium text-blue-600 self-start sm:self-center">
            Edit
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
        <svg
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>
          Please arrive at the office 10 minutes before your scheduled time. You
          will receive an SMS alert when your turn is approaching.
        </p>
      </div>
    </div>
  );
}

function Step5Success() {
  return (
    <div className="py-8 text-center animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
        Booking Confirmed!
      </h2>
      <p className="text-gray-500 mb-8">
        Your digital token has been generated successfully.
      </p>

      {/* Ticket Card */}
      <div className="max-w-xs mx-auto bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 relative">
        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-white border-r border-gray-300 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white border-l border-gray-300 rounded-full transform -translate-y-1/2"></div>

        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-1">
          Token Number
        </p>
        <p className="text-5xl font-black text-blue-600 mb-4 tracking-tighter">
          B-142
        </p>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="text-sm text-gray-500">Expected Time</p>
          <p className="text-lg font-bold text-gray-900">10:30 AM</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <button className="px-8 py-3 text-white bg-blue-600 font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-colors">
          Download Ticket
        </button>
        <Link
          to={`/track-token/${token.id}`}
          className="px-8 py-3 text-gray-700 bg-white border border-gray-300 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Go to Token Page
        </Link>
      </div>
    </div>
  );
}
