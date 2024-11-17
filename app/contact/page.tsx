'use client';
import { FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelopeOpen, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

interface ContactFormData {
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setFormData({
        email: '',
        subject: '',
        message: ''
      });

      alert('Message sent successfully!');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <h1 className="text-center mb-5 wow fadeInUp" data-wow-delay="0.1s">
          Contact For Any Query
        </h1>
        <div className="row g-4">
          <div className="col-12">
            <div className="row gy-4">
              <div className="col-md-4 wow fadeIn" data-wow-delay="0.1s">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div 
                    className="bg-white border rounded d-flex flex-shrink-0 align-items-center justify-content-center me-3" 
                    style={{ width: '45px', height: '45px' }}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                  </div>
                  <span>123 Street, New York, USA</span>
                </div>
              </div>
              <div className="col-md-4 wow fadeIn" data-wow-delay="0.3s">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div 
                    className="bg-white border rounded d-flex flex-shrink-0 align-items-center justify-content-center me-3" 
                    style={{ width: '45px', height: '45px' }}
                  >
                    <FontAwesomeIcon icon={faEnvelopeOpen} className="text-primary" />
                  </div>
                  <span>info@example.com</span>
                </div>
              </div>
              <div className="col-md-4 wow fadeIn" data-wow-delay="0.5s">
                <div className="d-flex align-items-center bg-light rounded p-4">
                  <div 
                    className="bg-white border rounded d-flex flex-shrink-0 align-items-center justify-content-center me-3" 
                    style={{ width: '45px', height: '45px' }}
                  >
                    <FontAwesomeIcon icon={faPhoneAlt} className="text-primary" />
                  </div>
                  <span>+012 345 6789</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <iframe
              className="position-relative rounded w-100 h-100"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.928637863704!2d114.16669567529303!3d22.318538479673467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340400c7be160685%3A0x8306b9ab1d9da633!2s2301%2C%20Wu%20Sang%20House%2C%20655%20Nathan%20Rd%2C%20Mong%20Kok!5e0!3m2!1sen!2shk!4v1731836996789!5m2!1sen!2shk" 
              style={{ minHeight: '400px', border: 0 }}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
          <div className="col-md-6">
            <div className="wow fadeInUp" data-wow-delay="0.5s">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                      <label htmlFor="subject">Subject</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Leave a message here"
                        id="message"
                        style={{ height: '150px' }}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                      <label htmlFor="message">Message</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button 
                      className="btn btn-primary w-100 py-3" 
                      type="submit"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
