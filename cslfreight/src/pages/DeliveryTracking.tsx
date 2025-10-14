import React, { useState, useEffect } from 'react';
import { Check, AlertCircle, Loader, Package, Calendar, MapPin, Phone, User, Truck } from 'lucide-react';

interface FetchedRequest {
  shippingMark: string;
  requestType: string;
  partyType: string;
  thirdPartyName: string;
  thirdPartyPhone: string;
  loadingDate: string;
  location: string;
  callNumber: string;
}

type StatusStep = 'request' | 'confirmed' | 'ready' | 'delivered';

const statusSteps: { id: StatusStep; label: string; description: string }[] = [
  { id: 'request', label: 'Request', description: 'Request created' },
  { id: 'confirmed', label: 'Confirmed by Warehouse', description: 'Awaiting confirmation' },
  { id: 'ready', label: 'Ready for Pickup/Delivery', description: 'Pending' },
  { id: 'delivered', label: 'Delivered', description: 'Pending' }
];

function DeliveryTracking() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchedRequest, setFetchedRequest] = useState<FetchedRequest | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<StatusStep>('request');

  useEffect(() => {
    fetchRequestData();
  }, []);

  const fetchRequestData = async (): Promise<void> => {
    try {
      setLoading(true);

      const mockRequest: FetchedRequest = {
        shippingMark: 'PKG-2025-001',
        requestType: 'pickup',
        partyType: 'third',
        thirdPartyName: 'ABC Logistics Inc.',
        thirdPartyPhone: '+1-555-0123',
        loadingDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16),
        location: 'Warehouse A, Building 5',
        callNumber: 'CALL-2025-5847'
      };

      await new Promise(resolve => setTimeout(resolve, 1500));

      setFetchedRequest(mockRequest);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch request data:', error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSubmitted(false);
    setCurrentStatus('request');
    fetchRequestData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <p className="text-slate-700 text-xl font-medium">Loading Request Data...</p>
        </div>
      </div>
    );
  }

  if (!fetchedRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-slate-700 text-xl font-medium">Failed to load request data</p>
          <button
            onClick={fetchRequestData}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderRequestInfo = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-blue-900">Request Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-slate-600 mb-1">Shipping Mark</p>
            <p className="text-lg font-bold text-slate-900">{fetchedRequest.shippingMark}</p>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-slate-600 mb-1">Request Type</p>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <p className="text-lg font-bold text-slate-900 capitalize">{fetchedRequest.requestType}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-slate-600 mb-1">Party Type</p>
            <p className="text-lg font-bold text-slate-900">
              {fetchedRequest.partyType === 'third' ? 'Third Party' : 'Self'}
            </p>
          </div>

          {fetchedRequest.partyType === 'third' && (
            <>
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-slate-600 mb-1">Third Party Name</p>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <p className="text-lg font-bold text-slate-900">{fetchedRequest.thirdPartyName}</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-100 md:col-span-2">
                <p className="text-sm text-slate-600 mb-1">Phone Number</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <p className="text-lg font-bold text-slate-900">{fetchedRequest.thirdPartyPhone}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-600 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-green-900">Scheduling Details</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
            <p className="text-sm text-slate-600 mb-1">Loading Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <p className="text-lg font-bold text-slate-900">
                {new Date(fetchedRequest.loadingDate).toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
            <p className="text-sm text-slate-600 mb-1">Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <p className="text-lg font-bold text-slate-900">{fetchedRequest.location}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-100">
            <p className="text-sm text-slate-600 mb-1">Call Number</p>
            <p className="text-lg font-bold text-slate-900">{fetchedRequest.callNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-600 p-2 rounded-lg">
            <Check className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-amber-900">Review & Confirmation</h3>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Request Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-amber-100">
                <p className="text-xs text-slate-500">Shipping Mark</p>
                <p className="font-bold text-slate-900">{fetchedRequest.shippingMark}</p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-amber-100">
                <p className="text-xs text-slate-500">Request Type</p>
                <p className="font-bold text-slate-900 capitalize">{fetchedRequest.requestType}</p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-amber-100">
                <p className="text-xs text-slate-500">Party Type</p>
                <p className="font-bold text-slate-900">
                  {fetchedRequest.partyType === 'third' ? 'Third Party' : 'Self'}
                </p>
              </div>
              {fetchedRequest.partyType === 'third' && (
                <>
                  <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-amber-100">
                    <p className="text-xs text-slate-500">Third Party Name</p>
                    <p className="font-bold text-slate-900">{fetchedRequest.thirdPartyName}</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-amber-100 md:col-span-2">
                    <p className="text-xs text-slate-500">Phone Number</p>
                    <p className="font-bold text-slate-900">{fetchedRequest.thirdPartyPhone}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Scheduling Details</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-amber-100">
                <p className="text-xs text-slate-500">Loading Date</p>
                <p className="font-bold text-slate-900">
                  {new Date(fetchedRequest.loadingDate).toLocaleString()}
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-amber-100">
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-bold text-slate-900">{fetchedRequest.location}</p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-amber-100">
                <p className="text-xs text-slate-500">Call Number</p>
                <p className="font-bold text-slate-900">{fetchedRequest.callNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatus = () => (
    <div className="space-y-6 animate-fadeIn">
      {submitted && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 flex items-center gap-4 shadow-xl animate-slideDown">
          <div className="bg-white/20 p-3 rounded-full">
            <Check className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xl font-bold">Request Confirmed Successfully!</p>
            <p className="text-green-100">Your request has been submitted for processing</p>
          </div>
        </div>
      )}

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Request Status Tracking</h3>

        <div className="space-y-4">
          {statusSteps.map((status, idx) => {
            const isActive = idx === 0;
            const isCompleted = idx < statusSteps.findIndex(s => s.id === currentStatus);

            return (
              <div key={status.id} className="flex items-start gap-4 group">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isActive || isCompleted ? <Check size={24} /> : idx + 1}
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={`absolute left-1/2 top-12 w-0.5 h-8 -ml-px transition-colors duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <p className={`font-bold text-lg transition-colors duration-300 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-900'
                  }`}>
                    {status.label}
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isActive ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-slate-500'
                  }`}>
                    {isActive ? 'Request created from fetched data' : status.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const stepTitles = [
    'Request Information',
    'Scheduling Details',
    'Review & Confirmation',
    'Request Status'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-slate-800 bg-clip-text text-transparent mb-2">
            Pickup & Delivery Request
          </h1>
          <p className="text-slate-600 text-lg">Step {currentStep} of 4: {stepTitles[currentStep - 1]}</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                  step < currentStep
                    ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-lg'
                    : step === currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">{stepTitles[currentStep - 1]}</h2>

          {currentStep === 1 && renderRequestInfo()}
          {currentStep === 2 && renderScheduling()}
          {currentStep === 3 && renderReview()}
          {currentStep === 4 && renderStatus()}

          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-8 py-3 border-2 border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Back
              </button>
            )}

            {currentStep < 4 && (
              <button
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Next
              </button>
            )}

            {currentStep === 4 && !submitted && (
              <button
                onClick={handleConfirm}
                className="ml-auto flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Check size={20} /> Confirm Request
              </button>
            )}

            {currentStep === 4 && submitted && (
              <button
                onClick={handleReset}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create New Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryTracking
