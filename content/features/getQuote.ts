export const getQuoteContent = {
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Get a Quote' },
  ],
  sidebar: {
    eyebrow: 'Custom Travel Planning',
    title: 'Build Your Ideal Escape',
    subtitle:
      "Share your destination, dates, and preferences. We'll craft a package that matches your budget and travel style.",
    benefits: [
      'Personalized itinerary with flight, hotel, and tour options',
      'Transparent pricing and package recommendations',
      'Fast response from our travel specialist team',
    ],
    progressLabel: 'Form progress',
  },
  form: {
    successMessage: 'Quote request received. Our team will contact you shortly.',
    sections: {
      tripDetails: {
        title: 'Trip Details',
        description: 'Tell us the basics of your travel plan.',
      },
      contactDetails: {
        title: 'Contact Details',
        description: 'Where should we send your quote and follow-up details?',
      },
    },
    actions: {
      clear: 'Clear Form',
      submit: 'Request Quote',
      submitting: 'Submitting...',
    },
    toasts: {
      submitSuccess: 'Quote request submitted successfully. Our team will contact you shortly.',
      submitError: 'Failed to submit quote request. Please try again.',
    },
    fields: {
      where: 'Where',
      when: 'When',
      tourType: 'Tour Type',
      adults: 'Adults',
      children: 'Children',
      budget: 'Budget Range',
      hotelClass: 'Preferred Hotel',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      notes: 'Additional Notes',
      notesPlaceholder: 'Flight preference, activities, pickup details, or special requests.',
    },
    options: {
      budget: ['Below ₱20,000', '₱20,000 - ₱50,000', '₱50,000 - ₱100,000', '₱100,000+'],
      hotelClass: ['3-Star', '4-Star', '5-Star', 'Flexible'],
    },
    validationMessages: {
      required_where: 'Please select a destination.',
      required_when: 'Please select your travel dates.',
      required_tour_type: 'Please select a tour type.',
      required_adults: 'Please enter the number of adults.',
      invalid_adults: 'Adults must be at least 1.',
      required_budget: 'Please select your budget range.',
      required_hotel_class: 'Please select your preferred hotel.',
      required_full_name: 'Please enter your full name.',
      required_email: 'Please enter your email address.',
      invalid_email: 'Please enter a valid email address.',
      required_phone: 'Please enter your phone number.',
      invalid_phone: 'Please enter a valid phone number.',
    },
  },
  floatingHelp: {
    closeAriaLabel: 'Close urgent assistance',
    title: 'Prefer to chat instead of filling the form?',
    description: 'Message our team on WhatsApp, Messenger, or Viber for a personalized quote.',
  },
} as const;
