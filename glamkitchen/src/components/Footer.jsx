import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Instagram } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

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

          {/* Right Div */}
          <div className="flex items-center col-span-1 md:col-span-3 lg:col-span-3 mb-4 md:mb-0 grid grid-col-1 md:grid-cols-3">
            <Dialog>
              <div className="mb-3 mb-md-0">
                <h6 className="text-2xl uppercase mb-3">Customer Services</h6>
                <ul className="list-unstyled mb-0">
                  <li>
                    <Link className="footer-link" to="/contact">
                      Help & Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/order-tracking"
                      className="footer-link flex items-center font-bold text-lg text-flame-600 hover:text-flame-800 transition duration-300"
                    >
                      <span className="mr-2">📦</span> Track Your Order
                    </Link>
                  </li>
                  <li>
                    <DialogTrigger>
                      <a
                        className="footer-link flex items-center font-bold text-lg text-robin-600 hover:text-robin-800 transition duration-300"
                        href="#"
                      >
                        <span className="mr-2">📍</span> Store Locator
                      </a>
                    </DialogTrigger>
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
                    <a
                      className="footer-link flex items-center space-x-2"
                      href="https://www.instagram.com/_glam.yourkitchen/"
                    >
                      <Instagram className="text-pink-500 animate-bounce" />
                      <span className="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 px-2 text-white">
                        Instagram
                      </span>
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Maps</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[60vh] min-h-[300px] rounded-lg overflow-hidden">
                  <APIProvider
                    apiKey="AIzaSyBYRchWa09UlAUZsewokxw9tGzbrcp8zyg"
                    onLoad={() => console.log("Maps API has loaded.")}
                  >
                    <Map
                      defaultZoom={13}
                      defaultCenter={{ lat: -1.284838, lng: 36.833563 }}
                      mapId="b00cfbb1f90973b0"
                      onCameraChanged={(event) =>
                        console.log(
                          "camera changed:",
                          event.detail.center,
                          "zoom:",
                          event.detail.zoom
                        )
                      }
                      style={{
                        width: "100%",
                        height: "100%", // Full height within the container
                      }}
                    >
                      <AdvancedMarker
                        key={"glam-your-kitchen"}
                        position={{
                          lat: -1.28489,
                          lng: 36.8336,
                        }}
                      >
                        <Pin
                          background={"#FBBC04"}
                          glyphColor={"#000"}
                          borderColor={"#000"}
                        />
                      </AdvancedMarker>
                    </Map>
                  </APIProvider>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="border-t pt-4" style={{ borderColor: "#1d1d1d" }}>
          <div className="flex flex-col lg:flex-row justify-evenly items-center small text-robin_egg_blue">
            <div className="flex ">
              <p className=" mb-0">
                &copy; {new Date().getFullYear()} All rights reserved.
              </p>
              {/* Hidden Admin Link */}
            </div>
            <div className="flex justify-start">
              <Link to="/admin" className="pl-6 text-center">
                glam_your_kitchen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
