"use client";

import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "./ui/input";
import { PasswordInput } from "./ui/password-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { RegisterSchema, RegisterSchemaType } from "@/schema/login";
import useAuth from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { axios_instance } from "@/api/axios";

const RegisterFormStep = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      shippingMark: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      location: "",
    },
  });

  const onNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const onBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      setIsPending(true);
      toast.loading("Signing Up...", { id: "register" });

      const response = await axios_instance.post("/auth/signup/client", {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        shippingMark: data.shippingMark,
        phone: data.phone,
        location: data.location,
      });

      dispatch({ type: "ADD_AUTH", payload: response.data });
      form.reset();
      toast.success("Register successful", { id: "register" });
      navigate(from, { replace: true });
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || "Registration failed", { id: "register" });
      } else {
        toast.error("Something went wrong", { id: "register" });
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form className="mt-2 space-y-2 md:w-full xl:w-[80%]" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Step Indicator */}
        {/* <div className="flex justify-center mb-4">
          <div className="text-xs font-medium text-gray-600">
            Step {step} of 3
          </div>
        </div> */}

        {/* Step 1: Account Details */}
        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@gmail.com" className="text-xs" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Password</FormLabel>
                  <FormControl>
                    <PasswordInput className="text-xs" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormDescription>Minimum 8 characters</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput className="text-xs" placeholder="Confirm password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <>
            <FormField
              control={form.control}
              name="shippingMark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Shipping Mark</FormLabel>
                  <FormControl>
                    <Input placeholder="Your shipping mark" {...field} className="text-xs" />
                  </FormControl>
                  <FormDescription>Use shipping mark given by cslfreight.</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xs">Phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      country="gh"
                      value={phone}
                      onChange={(value) => setPhone(value)}
                      onBlur={() => form.setValue("phone", phone)}
                      containerStyle={{ width: "100%", fontSize: "10px" }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="text-xs">Location</FormLabel>
                <FormControl>
                  <Input placeholder="Accra, Kumasi" {...field} className="text-xs" />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-2 mt-4">
          {step > 1 && (
            <button type="button" onClick={onBack} className="px-4 py-2 border rounded text-xs">
              Back
            </button>
          )}
          {step < 3 && (
            <button type="button" onClick={onNext} className="px-4 py-2 bg-blue-600 text-white rounded text-xs">
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-green-600 text-white rounded flex items-center justify-center text-xs"
            >
              {!isPending && "Register"}
              {isPending && <Loader2 className="animate-spin h-4 w-4" />}
            </button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default RegisterFormStep;
