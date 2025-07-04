import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiTarget, FiZap, FiTrendingUp, FiDollarSign, FiClock, FiCheckCircle, 
  FiArrowRight, FiPlay, FiUsers, FiAward, FiLock, FiMail, FiUser 
} = FiIcons;

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Mitchell",
      title: "Affiliate Marketer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      quote: "I went from $500/month to $8,500/month in just 3 months using bridge pages. The difference is incredible!",
      result: "+1,600% Revenue Increase"
    },
    {
      name: "Mike Rodriguez",
      title: "Digital Entrepreneur",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      quote: "My conversion rates jumped from 2% to 12% overnight. This tool pays for itself in the first week.",
      result: "500% Conversion Boost"
    },
    {
      name: "Jessica Chen",
      title: "Online Coach",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      quote: "Finally, a simple way to create professional bridge pages without hiring expensive designers or developers.",
      result: "Saved $5,000+ in Design Costs"
    }
  ];

  const benefits = [
    {
      icon: FiDollarSign,
      title: "Increase Conversions by 300%+",
      description: "Transform cold traffic into hot buyers with proven bridge page psychology that gets results."
    },
    {
      icon: FiClock,
      title: "Create Pages in Under 10 Minutes",
      description: "No more waiting weeks for designers. Build professional bridge pages in minutes, not months."
    },
    {
      icon: FiTarget,
      title: "AI-Powered Copy Generation",
      description: "Let our AI analyze any sales page and generate high-converting copy that speaks to your audience."
    },
    {
      icon: FiTrendingUp,
      title: "Real-Time Analytics & Optimization",
      description: "Track every click, conversion, and dollar earned with built-in analytics that help you optimize for maximum profit."
    },
    {
      icon: FiZap,
      title: "One-Click Publishing",
      description: "Go from idea to live page instantly. No hosting headaches, no technical skills required."
    },
    {
      icon: FiAward,
      title: "Proven Templates That Convert",
      description: "Access battle-tested templates used by 6-figure affiliates to generate millions in commissions."
    }
  ];

  const features = [
    "Drag-and-drop page builder",
    "50+ high-converting templates",
    "AI-powered copy generation",
    "Advanced split testing",
    "Real-time analytics dashboard",
    "Mobile-optimized designs",
    "One-click integrations",
    "24/7 priority support"
  ];

  const stats = [
    { number: "47,382", label: "Bridge Pages Created" },
    { number: "$12.3M", label: "Revenue Generated" },
    { number: "8.7%", label: "Average Conversion Rate" },
    { number: "15 Min", label: "Average Build Time" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !firstName) return;

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowModal(true);
      
      // Store lead data
      const leadData = {
        email,
        firstName,
        timestamp: Date.now(),
        source: 'landing_page'
      };
      
      const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('leads', JSON.stringify(existingLeads));
      
      // Track conversion
      console.log('Lead captured:', leadData);
    }, 2000);
  };

  const handleGetStarted = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Copy */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Attention Grabber */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-full px-4 py-2">
                <SafeIcon icon={FiZap} className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">
                  🔥 Limited Time: 50% OFF First Month
                </span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Turn Any Sales Page Into a 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}Conversion Machine
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Stop losing 90% of your traffic to poor conversions. Create high-converting bridge pages in minutes that turn visitors into buyers and maximize your affiliate commissions.
                </p>
              </div>

              {/* Benefit Bullets */}
              <div className="space-y-3">
                {[
                  "Increase conversions by 300%+ with proven psychology",
                  "Build professional pages in under 10 minutes",
                  "AI generates high-converting copy automatically",
                  "No design skills or coding required"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=40&h=40&fit=crop&crop=face`}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Loved by <span className="font-semibold">12,000+</span> marketers
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Email Capture Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Instant Access
                </h3>
                <p className="text-gray-600">
                  Join 12,000+ marketers already using Bridge Page Builder
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Creating Your Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Get Instant Access</span>
                      <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                    </div>
                  )}
                </motion.button>
              </form>

              {/* Trust Indicators */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <SafeIcon icon={FiLock} className="w-4 h-4" />
                  <span>100% secure. No spam, ever.</span>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    Free 7-day trial • Cancel anytime • No hidden fees
                  </p>
                </div>
              </div>

              {/* Urgency */}
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 text-center font-medium">
                  ⚠️ Only <strong>47 spots left</strong> at this price
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Bridge Pages Outperform Direct Linking by 300%
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stop sending cold traffic directly to sales pages. Bridge pages warm up your audience and dramatically increase conversions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <SafeIcon icon={benefit.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Marketers
            </h2>
            <p className="text-xl text-gray-600">
              See how Bridge Page Builder is changing lives and bank accounts
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center"
              >
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full mx-auto mb-6"
                />
                
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                <div className="mb-4">
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].title}
                  </div>
                </div>
                
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                  <span>{testimonials[currentTestimonial].result}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Maximize Conversions
            </h2>
            <p className="text-xl text-gray-600">
              Professional tools that would cost $1000s separately - all in one platform
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Stop Losing Money to Poor Conversions
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Every day you wait is money left on the table. Join thousands of successful marketers already using Bridge Page Builder to maximize their commissions.
            </p>
            
            <motion.button
              onClick={() => document.querySelector('input[type="email"]').scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now - 50% OFF
            </motion.button>
            
            <p className="text-blue-200 text-sm mt-4">
              Limited time offer expires in 24 hours
            </p>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={FiCheckCircle} className="w-8 h-8 text-green-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome Aboard, {firstName}! 🎉
              </h3>
              
              <p className="text-gray-600 mb-6">
                You're now part of an exclusive community of successful marketers. Let's get you started with your first high-converting bridge page!
              </p>
              
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                Start Building My First Bridge Page
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;