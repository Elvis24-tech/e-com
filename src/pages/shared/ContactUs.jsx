import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = ({ onNavigate }) => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .sendForm(
        'service_ili2gqn',    
        'template_fcam8bq',   
        form.current,
        'HPYSq67Uru7FGi-2N'     
      )
      .then(
        () => {
          alert('Message sent successfully!');
          form.current.reset();
          setIsSending(false);
        },
        (error) => {
          alert('Failed to send message. Please try again.');
          console.error(error);
          setIsSending(false);
        }
      );
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-16 px-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-green-900 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="mb-6 text-lg">
            Have questions or feedback? Reach out and we’ll get back to you as soon as possible.
          </p>
          <ul className="space-y-4 text-sm">
            <li>📧 <span className="font-semibold">Email:</span> support@farmart.com</li>
            <li>📞 <span className="font-semibold">Phone:</span> +254 712 345678</li>
            <li>📍 <span className="font-semibold">Location:</span> Nairobi, Kenya</li>
          </ul>
        </div>

        <div className="p-10">
          <h3 className="text-2xl font-semibold text-green-700 mb-6">Send us a message</h3>
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="user_name"
                placeholder="Your Name"
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="email"
                name="user_email"
                placeholder="Your Email"
                required
                className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            ></textarea>
            <button
              type="submit"
              disabled={isSending}
              className={`w-full ${
                isSending ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } text-white font-medium py-3 rounded-md transition`}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={() => onNavigate('landing')}
          className="bg-[#800000] hover:bg-[#990000] text-white font-semibold px-6 py-3 rounded-md shadow transition"
        >
          ← Back to Main Site
        </button>
      </div>
    </div>
  );
};

export default ContactUs;
