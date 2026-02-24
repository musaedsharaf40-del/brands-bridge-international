'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button, Input, Textarea, Select } from '@/components/ui';
import { inquiriesApi } from '@/lib/api';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  type: z.string().optional(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const inquiryTypes = [
  { value: 'GENERAL', label: 'General Inquiry' },
  { value: 'BUSINESS', label: 'Business Partnership' },
  { value: 'PARTNERSHIP', label: 'Distribution Partnership' },
  { value: 'SUPPORT', label: 'Support Request' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: 'GENERAL',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await inquiriesApi.create(data);
      setSubmitted(true);
      reset();
      toast.success('Your inquiry has been submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
      console.error('Failed to submit inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          <p className="mt-2 text-white/80">Get in touch with our team</p>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="text-secondary-600 mb-8">
              Have questions about our products or services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-secondary-600 mt-1">
                    123 Trade Center<br />
                    Business District<br />
                    Dubai, UAE
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-secondary-600 mt-1">+1 (555) 123-4567</p>
                  <p className="text-secondary-600">Mon-Fri 9am-6pm</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-secondary-600 mt-1">info@brandsbridgeintl.com</p>
                  <p className="text-secondary-600">sales@brandsbridgeintl.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-secondary-600 mb-6">
                    Your inquiry has been submitted successfully. Our team will get back to you within 24-48 hours.
                  </p>
                  <Button variant="primary" onClick={() => setSubmitted(false)}>
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Inquiry Type */}
                    <div>
                      <Select
                        label="Inquiry Type"
                        options={inquiryTypes}
                        {...register('type')}
                      />
                    </div>

                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="First Name *"
                        placeholder="John"
                        error={errors.firstName?.message}
                        {...register('firstName')}
                      />
                      <Input
                        label="Last Name *"
                        placeholder="Doe"
                        error={errors.lastName?.message}
                        {...register('lastName')}
                      />
                    </div>

                    {/* Contact Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Email Address *"
                        type="email"
                        placeholder="john@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                      <Input
                        label="Phone Number"
                        placeholder="+1 (555) 000-0000"
                        {...register('phone')}
                      />
                    </div>

                    {/* Company & Country */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Company"
                        placeholder="Your company name"
                        {...register('company')}
                      />
                      <Input
                        label="Country"
                        placeholder="Your country"
                        {...register('country')}
                      />
                    </div>

                    {/* Subject */}
                    <Input
                      label="Subject"
                      placeholder="How can we help you?"
                      {...register('subject')}
                    />

                    {/* Message */}
                    <Textarea
                      label="Message *"
                      placeholder="Please describe your inquiry in detail..."
                      error={errors.message?.message}
                      {...register('message')}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full md:w-auto"
                      isLoading={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
