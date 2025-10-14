import { useState } from 'react';
import { RequestFormData, RequestType, PartyType } from '../types/request';

const initialFormData: RequestFormData = {
  shippingMark: '',
  requestType: 'pickup',
  partyType: 'self',
  thirdPartyName: '',
  thirdPartyPhone: '',
  loadingDate: '',
  location: '',
  callNumber: ''
};

export default function RequestForm() {
  const [formData, setFormData] = useState<RequestFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const updateFormData = (field: keyof RequestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getMinDateTime = () => {
    const twelveHoursFromNow = new Date(Date.now() + 12 * 60 * 60 * 1000);
    return twelveHoursFromNow.toISOString().slice(0, 16);
  };

  const validateDate = () => {
    if (!formData.loadingDate) return false;

    const selectedDate = new Date(formData.loadingDate);
    const twelveHoursFromNow = new Date(Date.now() + 12 * 60 * 60 * 1000);

    return selectedDate >= twelveHoursFromNow;
  };

  const isFormValid = () => {
    if (!formData.shippingMark || !formData.requestType || !formData.partyType) {
      return false;
    }

    if (formData.partyType === 'third-party') {
      if (!formData.thirdPartyName || !formData.thirdPartyPhone) {
        return false;
      }
    }

    if (!formData.loadingDate || !formData.location || !formData.callNumber) {
      return false;
    }

    return validateDate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid()) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-600 text-white px-8 py-6 text-center">
              <h1 className="text-3xl font-bold mb-2">Request Submitted!</h1>
              <p className="text-green-100">Your {formData.requestType} request has been successfully submitted.</p>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Shipping Mark</p>
                <p className="text-lg font-medium text-gray-900">{formData.shippingMark}</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Call Number</p>
                <p className="text-lg font-medium text-gray-900">{formData.callNumber}</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-lg font-medium text-gray-900">{formData.location}</p>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Pickup & Delivery Request</h1>
            <p className="text-blue-100">Complete the form to submit your request</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            <div>
              <label htmlFor="shippingMark" className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Mark <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="shippingMark"
                value={formData.shippingMark}
                onChange={(e) => updateFormData('shippingMark', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter shipping mark"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="requestType"
                    value="pickup"
                    checked={formData.requestType === 'pickup'}
                    onChange={(e) => updateFormData('requestType', e.target.value as RequestType)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Pickup</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="requestType"
                    value="delivery"
                    checked={formData.requestType === 'delivery'}
                    onChange={(e) => updateFormData('requestType', e.target.value as RequestType)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Delivery</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Party Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="partyType"
                    value="self"
                    checked={formData.partyType === 'self'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        partyType: e.target.value as PartyType,
                        thirdPartyName: '',
                        thirdPartyPhone: ''
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Self</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="partyType"
                    value="third-party"
                    checked={formData.partyType === 'third-party'}
                    onChange={(e) => updateFormData('partyType', e.target.value as PartyType)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Third Party</span>
                </label>
              </div>
            </div>

            {formData.partyType === 'third-party' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label htmlFor="thirdPartyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Third Party Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="thirdPartyName"
                    value={formData.thirdPartyName || ''}
                    onChange={(e) => updateFormData('thirdPartyName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter third party name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="thirdPartyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Third Party Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="thirdPartyPhone"
                    value={formData.thirdPartyPhone || ''}
                    onChange={(e) => updateFormData('thirdPartyPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="loadingDate" className="block text-sm font-medium text-gray-700 mb-2">
                Loading Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="loadingDate"
                value={formData.loadingDate}
                onChange={(e) => updateFormData('loadingDate', e.target.value)}
                min={getMinDateTime()}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formData.loadingDate && !validateDate() ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {formData.loadingDate && !validateDate() && (
                <p className="text-red-500 text-sm mt-1">Loading date must be at least 12 hours from now</p>
              )}
            </div>

           <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter location"
                required
              />
            </div>

            <div>
              <label htmlFor="callNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Call Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="callNumber"
                value={formData.callNumber}
                onChange={(e) => updateFormData('callNumber', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter call number"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!isFormValid()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
