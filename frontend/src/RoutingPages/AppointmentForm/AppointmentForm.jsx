import React, { useState } from 'react';
import './AppointmentForm2.css';
import logo from "../../assets/logo4.png"
import { bookAppointment } from '../../api/appointmentApi';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        preferredDate: '',
        preferredTime: '',
        appointmentType: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const appointmentTypes = [
        'Investment Consultation',
        'Wealth Management',
        'Tax Planning',
        'Portfolio Review',
        'Mutual Fund Planning',
        'PMS Consultation',
        'Other'
    ];

    // Validation functions
    const validateFullName = (name) => {
        if (!name.trim()) return 'Full name is required';
        if (name.trim().length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name should only contain letters';
        return '';
    };

    const validateEmail = (email) => {
        if (!email.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email';
        return '';
    };

    const validateMobile = (mobile) => {
        if (!mobile.trim()) return 'Mobile number is required';
        if (!/^\d{10}$/.test(mobile)) return 'Please enter a valid 10-digit mobile number';
        return '';
    };

    const validateDate = (date) => {
        if (!date) return 'Preferred date is required';
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Please select a future date';
        return '';
    };

    const validateTime = (time) => {
        if (!time) return 'Preferred time is required';
        return '';
    };

    const validateAppointmentType = (type) => {
        if (!type) return 'Please select appointment type';
        return '';
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle blur (when user leaves a field)
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'fullName':
                error = validateFullName(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'mobile':
                error = validateMobile(value);
                break;
            case 'preferredDate':
                error = validateDate(value);
                break;
            case 'preferredTime':
                error = validateTime(value);
                break;
            case 'appointmentType':
                error = validateAppointmentType(value);
                break;
            default:
                break;
        }

        if (error) {
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    // Validate all fields
    const validateForm = () => {
        const newErrors = {
            fullName: validateFullName(formData.fullName),
            email: validateEmail(formData.email),
            mobile: validateMobile(formData.mobile),
            preferredDate: validateDate(formData.preferredDate),
            preferredTime: validateTime(formData.preferredTime),
            appointmentType: validateAppointmentType(formData.appointmentType)
        };

        // Remove empty errors
        Object.keys(newErrors).forEach(key => {
            if (!newErrors[key]) delete newErrors[key];
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Map display label → backend AppointmentType enum
    const TYPE_MAP = {
        'Investment Consultation': 'INVESTMENT_CONSULTATION',
        'Wealth Management':       'WEALTH_MANAGEMENT',
        'Tax Planning':            'FINANCIAL_PLANNING',
        'Portfolio Review':        'FINANCIAL_PLANNING',
        'Mutual Fund Planning':    'INVESTMENT_CONSULTATION',
        'PMS Consultation':        'WEALTH_MANAGEMENT',
        'Other':                   'OTHERS',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await bookAppointment({
                fullName:      formData.fullName,
                email:         formData.email,
                mobile:        formData.mobile,
                preferredDate: formData.preferredDate,
                preferredTime: formData.preferredTime + ':00',
                type:          TYPE_MAP[formData.appointmentType] || 'OTHERS',
                notes:         formData.message,
            });

            setSubmitSuccess(true);

            setTimeout(() => {
                setFormData({
                    fullName: '',
                    email: '',
                    mobile: '',
                    preferredDate: '',
                    preferredTime: '',
                    appointmentType: '',
                    message: ''
                });
                setSubmitSuccess(false);
            }, 3000);
        } catch (error) {
            alert(error.userMessage || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <section className="appointment-form-section">
            <div className="appointment-form-container">
                {/* Logo */}
                <div className="form-logo">
                    <img src={logo} alt="OngoleBulls Logo" />
                </div>

                {/* Header */}
                <div className="form-header">
                    <h1 className="form-title">Book Your Appointment</h1>
                    <p className="form-subtitle">
                        Schedule a consultation with our financial experts
                    </p>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="success-message">
                        <i className="bi bi-check-circle-fill"></i>
                        <p>Appointment booked successfully! We'll contact you soon.</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="appointment-form" noValidate>
                    {/* Full Name */}
                    <div className="form-group">
                        <label htmlFor="fullName" className="form-label">
                            Full Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-input ${errors.fullName ? 'error' : ''}`}
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                            <span className="error-message">
                <i className="bi bi-exclamation-circle"></i> {errors.fullName}
              </span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="your.email@example.com"
                        />
                        {errors.email && (
                            <span className="error-message">
                <i className="bi bi-exclamation-circle"></i> {errors.email}
              </span>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group">
                        <label htmlFor="mobile" className="form-label">
                            Mobile Number (10 digits) <span className="required">*</span>
                        </label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength="10"
                            className={`form-input ${errors.mobile ? 'error' : ''}`}
                            placeholder="9876543210"
                        />
                        {errors.mobile && (
                            <span className="error-message">
                <i className="bi bi-exclamation-circle"></i> {errors.mobile}
              </span>
                        )}
                    </div>

                    {/* Date and Time Row */}
                    <div className="form-row">
                        {/* Preferred Date */}
                        <div className="form-group">
                            <label htmlFor="preferredDate" className="form-label">
                                Preferred Date <span className="required">*</span>
                            </label>
                            <input
                                type="date"
                                id="preferredDate"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min={getMinDate()}
                                className={`form-input ${errors.preferredDate ? 'error' : ''}`}
                            />
                            {errors.preferredDate && (
                                <span className="error-message">
                  <i className="bi bi-exclamation-circle"></i> {errors.preferredDate}
                </span>
                            )}
                        </div>

                        {/* Preferred Time */}
                        <div className="form-group">
                            <label htmlFor="preferredTime" className="form-label">
                                Preferred Time <span className="required">*</span>
                            </label>
                            <input
                                type="time"
                                id="preferredTime"
                                name="preferredTime"
                                value={formData.preferredTime}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-input ${errors.preferredTime ? 'error' : ''}`}
                            />
                            {errors.preferredTime && (
                                <span className="error-message">
                  <i className="bi bi-exclamation-circle"></i> {errors.preferredTime}
                </span>
                            )}
                        </div>
                    </div>

                    {/* Appointment Type */}
                    <div className="form-group">
                        <label htmlFor="appointmentType" className="form-label">
                            Type of Appointment <span className="required">*</span>
                        </label>
                        <select
                            id="appointmentType"
                            name="appointmentType"
                            value={formData.appointmentType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-select ${errors.appointmentType ? 'error' : ''}`}
                        >
                            <option value="">Select appointment type</option>
                            {appointmentTypes.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        {errors.appointmentType && (
                            <span className="error-message">
                <i className="bi bi-exclamation-circle"></i> {errors.appointmentType}
              </span>
                        )}
                    </div>

                    {/* Message */}
                    <div className="form-group">
                        <label htmlFor="message" className="form-label">
                            Message / Notes (Optional)
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="form-textarea"
                            placeholder="Tell us about your requirements or any specific questions..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Booking...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-calendar-check"></i>
                                Book Appointment
                            </>
                        )}
                    </button>

                    {/* Terms */}
                    <p className="terms-text">
                        By submitting the form I agree to the{' '}
                        <a href="/terms" className="terms-link">Terms and Conditions</a> and{' '}
                        <a href="/privacy" className="terms-link">Privacy Policy</a> of Ongolebullsinvest pvt ltd India.
                    </p>
                </form>
            </div>
        </section>
    );
};

export default AppointmentForm;
