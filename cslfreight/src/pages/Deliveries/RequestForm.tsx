import useAxiosToken from "@/hooks/useAxiosToken"
import { useState,useEffect } from 'react';
import { RequestFormData, DeliveryType, PickupBy } from '../../types/request';
import useAuth from '@/hooks/useAuth'
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const initialFormData: RequestFormData = {
  shippingMark: '',
  deliveryType: 'Pickup',
  pickupBy: 'Self',
  thirdPartyName: '',
  thirdPartyPhone: '',
  loadedDate: '',
  location: '',
  phone: ''
};

export default function RequestForm() {
  // const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()
  const axios_instance_token = useAxiosToken()
  const {auth} = useAuth()
  const [formData, setFormData] = useState<RequestFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  useEffect(()=>{
    setFormData(prev => ({ ...prev, shippingMark: auth!.shippingMark }));
  }, [auth])

  const updateFormData = (field: keyof RequestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    if (!formData.shippingMark || !formData.deliveryType || !formData.pickupBy) {
      return false;
    }

    if (formData.pickupBy === 'Third Party') {
      if (!formData.thirdPartyName || !formData.thirdPartyPhone) {
        return false;
      }
    }

    if (!formData.loadedDate || !formData.location || !formData.phone) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid()) {
      // setSubmitted(true);
      onSubmit(formData)
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSubmitted(false);
  };


  const onSubmit = async (data: RequestFormData) =>{
    try{
      // setIsPending(true)
      toast.loading("Submitting request...", {
        id: "request"
      })

      const response = await axios_instance_token.post("/deliveries", {
        ...data
      })
      console.log(response)
      // setIsPending(false)
      toast.success("Delivery request created successfully", {
          id: "request"
      })            
        navigate(-1)
        
    }catch(err:any){
      // setIsPending(false)
      if (axios.isAxiosError(err)){
        toast.error(err?.response?.data?.message, {
          id: "request"
        })
      }
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-green-600 text-white px-8 py-6 text-center">
              <h1 className="text-3xl font-bold mb-2">Request Submitted!</h1>
              <p className="text-green-100">Your {formData.deliveryType} request has been successfully submitted.</p>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Shipping Mark</p>
                <p className="text-lg font-medium text-gray-900">{formData.shippingMark}</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Call Number</p>
                <p className="text-lg font-medium text-gray-900">{formData.phone}</p>
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
            <p className="text-blue-100 text-xs">Pickup/Delivery request must be placed 5 hours ahead of pickup and toward our working hours.</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
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
                    name="deliveryType"
                    value="Pickup"
                    checked={formData.deliveryType === 'Pickup'}
                    onChange={(e) => updateFormData('deliveryType', e.target.value as DeliveryType)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Pickup</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="Delivery"
                    checked={formData.deliveryType === 'Delivery'}
                    onChange={(e) => updateFormData('deliveryType', e.target.value as DeliveryType)}
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
                    name="pickupBy"
                    value="Self"
                    checked={formData.pickupBy === 'Self'}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        pickupBy: e.target.value as PickupBy,
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
                    name="pickupBy"
                    value="Third Party"
                    checked={formData.pickupBy === 'Third Party'}
                    onChange={(e) => updateFormData('pickupBy', e.target.value as PickupBy)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Third Party</span>
                </label>
              </div>
            </div>

            {formData.pickupBy === 'Third Party' && (
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="loadedDate" className="block text-sm font-medium text-gray-700 mb-2">
                Loading Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="loadedDate"
                value={formData.loadedDate}
                onChange={(e) => updateFormData('loadedDate', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900`}
                required
              />
              <p className="text-gray-500 text-sm mt-1">Day the package was loaded.</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="Enter location"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Call Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="Enter phone number"
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
