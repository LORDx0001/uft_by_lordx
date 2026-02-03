import { useState, useEffect } from "react";
import { Clock, X, Upload, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../api/apiRequest";
import { useForm } from "react-hook-form";
import Skeleton from "./Skeleton";
import toast from "react-hot-toast";

type Requirement = {
  id: string | number;
  name: string;
};

type TeamType = {
  id: string;
  name: string;
  requirements: Requirement[];
  isActive: boolean;
  created_at: string;
  updated_at: string;
};

type FormData = {
  id: string;
  resume: FileList;
  job_type: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

type JobAboutTypes = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

const Team = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const [positions, setPositions] = useState<TeamType[] | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [jobAbout, setJobAbout] = useState<JobAboutTypes[] | []>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>();
  const resume = watch("resume");

  const openModal = (id: string) => {
    setSelectedPosition(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedPosition) {
      setValue("id", selectedPosition);
    }
  }, [selectedPosition]);

  // Improved scroll prevention
  useEffect(() => {
    const handleEscapeKey = (event: any) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscapeKey);

      // Get current scroll position
      const scrollY = window.scrollY;

      // Apply styles to prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";

      // Store scroll position for restoration
      document.body.setAttribute("data-scroll-y", scrollY.toString());
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);

      if (isModalOpen) {
        // Restore scroll position
        const scrollY = document.body.getAttribute("data-scroll-y");

        // Reset styles
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        document.body.style.width = "";

        // Restore scroll position
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY));
          document.body.removeAttribute("data-scroll-y");
        }
      }
    };
  }, [isModalOpen]);

  const handleModalClick = (e: any) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const onSubmit = (data: FormData) => {
    const phone_number =
      data?.phone_number[0] === "+"
        ? data?.phone_number
        : "+" + data?.phone_number;
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("job_type", data.job_type);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("phone_number", phone_number);

    if (data.resume && data.resume[0]) {
      formData.append("resume", data.resume[0]);
    }
    setIsSubmitting(true);
    apiRequest("post", `/portfolio/job/${selectedPosition}/apply/`, formData, {
      "Content-Type": "multipart/form-data",
    })
      .then(() => {
        toast.success("Success!");
        setIsSubmitting(false);
        reset();
        setIsModalOpen(false);
      })
      .catch((error) => {
        for (const i in error.response.data) {
          setError(i as keyof FormData, {
            type: "server",
            message: error.response.data[i][0],
          });
        }
        toast.error("Error!");
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    apiRequest("get", "/portfolio/job/").then((data) =>
      setPositions(data as TeamType[])
    );

    apiRequest("get", "/portfolio/job/about/").then((data) =>
      setJobAbout(data as JobAboutTypes[])
    );
  }, []);

  return (
    <>
      <section
        id="team"
        className="relative py-20 bg-gradient-to-tr from-sky-900 via-slate-950 to-sky-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-start mb-8">
            {jobAbout.length > 0 ? (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-montserrat mb-2">
                  {jobAbout[0]?.title}
                </h2>
                <div className="flex items-center justify-between mt-10">
                  <p className="text-xl text-gray-300 font-montserrat max-w-3xl mb-0">
                    {jobAbout[0]?.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Skeleton width="50%" height="3.5rem" className="mb-6" />
                <div className="mt-10">
                  <Skeleton width="80%" height="1.5rem" variant="text" />
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {positions ? (
              positions.map((position, index) => (
                <div
                  key={index}
                  className="relative bg-black/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-black/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/10 overflow-hidden group"
                >
                  {/* Animated border lines */}
                  <span className="absolute top-0 left-0 w-full h-[2px] animate-line1 bg-gradient-to-r from-transparent to-cyan-400"></span>
                  <span className="absolute top-0 right-0 h-full w-[2px] animate-line2 bg-gradient-to-b from-transparent to-cyan-400 delay-75"></span>
                  <span className="absolute bottom-0 right-0 w-full h-[2px] animate-line3 bg-gradient-to-l from-transparent to-cyan-400 delay-150"></span>
                  <span className="absolute bottom-0 left-0 h-full w-[2px] animate-line4 bg-gradient-to-t from-transparent to-cyan-400 delay-300"></span>

                  <div className="mb-6 relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {position.name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{t("tashkent")}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{t("contract")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 relative z-10">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      {t("requirements")}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {position?.requirements.map((req, reqIndex) => (
                        <span
                          key={reqIndex}
                          className="text-sm cursor-pointer text-sky-600 bg-gray-600/50 hover:bg-blue-500/5 transition-all ease-in px-3 py-1 rounded-full"
                        >
                          {req.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openModal(position.id)}
                    className="relative group/btn text-cyan-300 font-semibold uppercase tracking-widest py-3 px-6 overflow-hidden rounded-lg transition duration-300 ease-in-out z-10
               hover:bg-cyan-400 hover:text-[#050801] hover:shadow-[0_0_5px_#03e9f4,0_0_25px_#03e9f4,0_0_50px_#03e9f4,0_0_200px_#03e9f4]"
                  >
                    <span className="absolute top-0 left-0 w-full h-[2px] animate-line1 bg-gradient-to-r from-transparent to-cyan-400"></span>
                    <span className="absolute top-0 right-0 h-full w-[2px] animate-line2 bg-gradient-to-b from-transparent to-cyan-400 delay-75"></span>
                    <span className="absolute bottom-0 right-0 w-full h-[2px] animate-line3 bg-gradient-to-l from-transparent to-cyan-400 delay-150"></span>
                    <span className="absolute bottom-0 left-0 h-full w-[2px] animate-line4 bg-gradient-to-t from-transparent to-cyan-400 delay-300"></span>

                    {t("applyNow")}
                  </button>
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height="250px" className="rounded-2xl" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto scrollbar-hidden"
          onClick={handleModalClick}
        >
          <div
            className="bg-sky-950/90 rounded-2xl p-8 max-w-xl w-full my-8 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {t("jobApplication")}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="id"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("selectPosition")} *
                </label>
                <select
                  id="id"
                  required
                  {...register("id", { required: "This field is required" })}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t("choosePosition")}</option>
                  {positions?.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
                {errors?.id && (
                  <p className="text-red-700 text-[12px] font-semibold">
                    {errors.id.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="job_type"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("workType")} *
                </label>
                <select
                  id="job_type"
                  {...register("job_type", {
                    required: "This field is required",
                  })}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{t("chooseWorkType")}</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="online">Online</option>
                </select>
                {errors?.job_type && (
                  <p className="text-red-700 text-[12px] font-semibold">
                    {errors.job_type.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("firstName")} *
                </label>
                <input
                  type="text"
                  id="first_name"
                  {...register("first_name", {
                    required: "This field is required",
                  })}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("firstName")}
                />
                {errors?.first_name && (
                  <p className="text-red-700 text-[12px] font-semibold">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("secondName")} *
                </label>
                <input
                  type="text"
                  id="last_name"
                  {...register("last_name", {
                    required: "This field is required",
                  })}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("secondName")}
                />
                {errors?.last_name && (
                  <p className="text-red-700 text-[12px] font-semibold">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("phoneNumber")} *
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  {...register("phone_number", {
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: "Incorrect phone number",
                    },
                    required: "This field is required",
                  })}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("enterPhoneNumber")}
                />
                {errors?.phone_number && (
                  <p className="text-red-700 text-[12px] font-semibold">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("cvResume")} *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="resume"
                    {...register("resume", {
                      required: "This field is required",
                    })}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label
                    htmlFor="resume"
                    className="w-full flex items-center justify-center px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <Upload size={20} className="mr-2" />
                    {resume
                      ? resume.item(0)?.name
                      : `${t("chooseFile")} (PDF, DOC, DOCX)`}
                  </label>
                  {errors?.resume && (
                    <p className="text-red-700 text-[12px] font-semibold">
                      {errors.resume.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse w-4/5 mx-auto gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-6 border border-gray-600 text-gray-300 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
                >
                  {isSubmitting ? "..." : t("submitApplication")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Team;
