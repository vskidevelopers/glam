import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useContactUsFunctions } from "@/utils/firebase";
import { ToastAction } from "@/components/ui/toast";

function ContactUs() {
  const { toast } = useToast();
  const { addContactMessage } = useContactUsFunctions();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  const formattedDate = currentDate.toLocaleString("en-US", options);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    const formData = { ...data, date: formattedDate };
    try {
      const newContactUsResponse = await addContactMessage(formData);
      if (newContactUsResponse?.success) {
        toast({
          title: "Message Sent Successfully!",
          description:
            "Thank you for reaching out to us. We will get back to you shortly.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      console.log("error >> ", error);
    }

    reset(); // Clear the form after submission
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-robin_egg_blue rounded-lg p-6">
            <h2 className="text-3xl font-bold text-flame-400 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8 text-sm">
              Have a question or need assistance? Send us a message and we'll
              respond promptly.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md"
            >
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-flame-500 focus:ring-1 focus:ring-flame-500 outline-none ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="E-mail"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className={`w-full p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-flame-500 focus:ring-1 focus:ring-flame-500 outline-none ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message Textarea */}
              <div>
                <textarea
                  placeholder="Message"
                  rows="4"
                  {...register("message", { required: "Message is required" })}
                  className={`w-full p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-flame-500 focus:ring-1 focus:ring-flame-500 outline-none resize-none ${
                    errors.message ? "border-red-500" : ""
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full text-sm bg-flame-500 hover:bg-flame-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold text-flame-400 mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 fill-robin_egg_blue"
                    viewBox="0 0 64 64"
                  >
                    <path d="M32 0A24.032 24.032 0 0 0 8 24c0 17.23 22.36 38.81 23.31 39.72a.99.99 0 0 0 1.38 0C33.64 62.81 56 41.23 56 24A24.032 24.032 0 0 0 32 0zm0 35a11 11 0 1 1 11-11 11.007 11.007 0 0 1-11 11z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Our Location
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Jubilee Complex Building
                    </p>
                    <p className="text-gray-600 text-sm">
                      Basement Shop No. 2, Kamukunji Markets
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 fill-robin_egg_blue"
                    viewBox="0 0 513.64 513.64"
                  >
                    <path d="m499.66 376.96-71.68-71.68c-25.6-25.6-69.12-15.359-79.36 17.92-7.68 23.041-33.28 35.841-56.32 30.72-51.2-12.8-120.32-79.36-133.12-133.12-7.68-23.041 7.68-48.641 30.72-56.32 33.28-10.24 43.52-53.76 17.92-79.36l-71.68-71.68c-20.48-17.92-51.2-17.92-69.12 0L18.38 62.08c-48.64 51.2 5.12 186.88 125.44 307.2s256 176.641 307.2 125.44l48.64-48.64c17.921-20.48 17.921-51.2 0-69.12z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Contact Numbers
                    </h4>
                    <p className="text-gray-600 text-sm">
                      0114499614 / 0702561183
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 fill-robin_egg_blue"
                    viewBox="0 0 512 512"
                  >
                    <path d="M298.789 313.693c-12.738 8.492-27.534 12.981-42.789 12.981-15.254 0-30.05-4.489-42.788-12.981L3.409 173.82A76.269 76.269 0 0 1 0 171.403V400.6c0 26.278 21.325 47.133 47.133 47.133h417.733c26.278 0 47.133-21.325 47.133-47.133V171.402a75.21 75.21 0 0 1-3.416 2.422z" />
                    <path d="m20.05 148.858 209.803 139.874c7.942 5.295 17.044 7.942 26.146 7.942 9.103 0 18.206-2.648 26.148-7.942L491.95 148.858c12.555-8.365 20.05-22.365 20.05-37.475 0-25.981-21.137-47.117-47.117-47.117H47.117C21.137 64.267 0 85.403 0 111.408a44.912 44.912 0 0 0 20.05 37.45z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Pay for Goods
                    </h4>
                    <p className="text-gray-600 text-sm">Mpesa Till: 8930612</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-semibold text-flame-400 mb-6">
                Hours of Operation
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">
                    Monday - Saturday
                  </span>
                  <span className="text-gray-800 text-sm">
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Sunday</span>
                  <span className="text-gray-800 text-sm">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
