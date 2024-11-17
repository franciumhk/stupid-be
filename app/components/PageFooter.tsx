import "../globals.css";
import React from "react";
import Link from "next/link";

const PageFooter = () => {
  return (
    <div
      className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div className="container py-1">
        <div className="row g-5">
          <div className="col-12">
            <h5 className="text-white mb-4">Contact</h5>
            <div className="d-flex flex-wrap gap-3">
              <div className="contact-item">
                <p className="mb-2">
                  <i className="fa fa-map-marker-alt me-3"></i>123 Street, New York,
                  USA
                </p>
              </div>
              <div className="contact-item">
                <p className="mb-2">
                  <i className="fa fa-phone-alt me-3"></i>+012 345 67890
                </p>
              </div>
              <div className="contact-item">
                <p className="mb-2">
                  <i className="fa fa-envelope me-3"></i>info@example.com
                </p>
              </div>
              <div className="contact-item ms-auto">
                <div className="d-flex gap-2">
                  <a className="btn btn-outline-light btn-social" href="">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="btn btn-outline-light btn-social" href="">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy;{" "}
              <Link href="#" className="border-bottom">
                StartUp Dream
              </Link>
              , All Right Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageFooter;
