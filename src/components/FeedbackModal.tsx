import { useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Portal } from "react-portal";
import { apiRequest } from "../../api/apiRequest";
import toast from "react-hot-toast";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackData {
  first_name: string;
  last_name: string;
  position: string;
  company_name: string;
  comment: string;
  image: File[];
  feedback_file: File[];
}

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackData>();

  const closeModal = () => {
    reset();
    onClose();
  };

  // Escape to close
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const submitHandler = (data: FeedbackData) => {
    const img = data.image?.[0];
    const file = data.feedback_file?.[0];
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("comment", data.comment);
    formData.append("company_name", data.company_name);
    formData.append("position", data.position);

    if (file) {
      formData.append("feedback_file", file);
    }

    if (img) {
      formData.append("image", img);
    }

    apiRequest("post", "/client/", formData)
      .then(() => {
        toast.success("Success!");
        reset();
      })
      .catch((e) => {
        for (const i in e.response.data) {
          toast.error(e.response.data[i][0]);
        }
      });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="somesome fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center  p-4 overflow-y-auto"
        onClick={handleModalClick}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-hidden"
          onClick={handleModalClick}
        >
          <div
            className="bg-sky-950/90 rounded-2xl p-8 max-w-xl w-full my-8 border border-white/10  overflow-y-scroll !max-h-[700px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {t("leaveComment")}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
              {/* Full Name */}
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
                  {...register("first_name", { required: true })}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("enterFirstName")}
                />
                {errors.first_name && (
                  <p className="text-red-400 text-sm mt-1">
                    {t("requiredField")}
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
                  {...register("last_name", { required: true })}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("enterSecondName")}
                />
                {errors.last_name && (
                  <p className="text-red-400 text-sm mt-1">
                    {t("requiredField")}
                  </p>
                )}
              </div>

              {/* Position */}
              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("position")} *
                </label>
                <input
                  type="text"
                  id="position"
                  {...register("position", { required: true })}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("enterPosition")}
                />
                {errors.position && (
                  <p className="text-red-400 text-sm mt-1">
                    {t("requiredField")}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("companyName")} *
                </label>
                <input
                  type="text"
                  id="company_name"
                  {...register("company_name", { required: true })}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("enterCompanyName")}
                />
                {errors.company_name && (
                  <p className="text-red-400 text-sm mt-1">
                    {t("requiredField")}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("yourFeedback")} *
                </label>
                <textarea
                  id="comment"
                  {...register("comment", { required: true })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={t("enterYourFeedback")}
                />
                {errors.comment && (
                  <p className="text-red-400 text-sm mt-1">
                    {t("requiredField")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("Image")}
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image", { required: false })}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.image && (
                  <p className="text-red-400 text-sm mt-1">
                    {t("requiredField")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="feedback_file"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t("FeedbackFile")}
                </label>
                <input
                  id="feedback_file"
                  type="file"
                  {...register("feedback_file", { required: false })}
                  className="w-full px-4 py-3 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.feedback_file && (
                  <p className="text-red-400 text-sm mt-1">
                    {t("requiredField")}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-row w-full mx-auto gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-6 border border-gray-600 text-gray-300 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
                >
                  {t("send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default FeedbackModal;
