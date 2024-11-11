import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Process form data here
  };

  return (
    <footer className="bg-flame-800/30 px-8 md:px-16">
      <div className="container py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-5">
          {/* Newsletter Section */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 mb-4 md:mb-0">
            <div className=" px-6 flex flex-col items-center justify-center text-center h-full bg-flame-400 p-4">
              <Link to="/">
                <h1 className="m-0 text-white text-2xl flex items-center gap-2">
                  <User />
                  NewsLetter
                </h1>
              </Link>
              <p className="mt-3 mb-4 text-robin_egg_blue-900">
                Discover our seasonal catalogs featuring the latest trends and
                must-have kitchenware, curated exclusively by Glam Your Kitchen.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-center px-2">
                  <input
                    type="text"
                    className={`form-control p-3 w-4/5 border-white ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Your Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  <Button type="submit" className="text-white p-3 ml-2">
                    Sign Up
                  </Button>
                </div>
                {errors.email && (
                  <p className="text-red-500 mt-1">{errors.email.message}</p>
                )}
              </form>
            </div>
          </div>

          {/* right div */}

          <div className="flex items-center col-span-1 md:col-span-3 lg:col-span-3 mb-4 md:mb-0 grid grid-col-1 md:grid-cols-3 ">
            <div className="mb-3 mb-md-0">
              <h6 className="text-2xl uppercase mb-3">Customer Services</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <a className="footer-link" href="#">
                    Help & Contact Us
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    Store Locator
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div className="mb-3 mb-md-0">
              <h6 className="text-2xl uppercase mb-3">Company</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <a className="footer-link" href="#">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    Our Products
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    Latest News
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="text-2xl uppercase mb-3">Social Media</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <a className="footer-link" href="#">
                    Twitter
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    Instagram
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    Facebook
                  </a>
                </li>
                <li>
                  <a className="footer-link" href="#">
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t pt-4" style={{ borderColor: "#1d1d1d" }}>
          <div className="flex flex-col lg:flex-row justify-between">
            <div>
              <p className="small text-muted mb-0">
                &copy; 2023 All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
