import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PageNotFound = () => {
  const {t} = useTranslation()
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // Get current path from URL
  const currentPath = window.location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-sky-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("pageNotFound.title")}</h1>
          <p className="text-gray-600 mb-4">
           {t("pageNotFound.description")}
          </p>

          {/* Display the wrong path */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-red-700">
              <span className="font-semibold">{t("pageNotFound.requestedPath")}:</span>
              <code className="ml-2 bg-red-100 px-2 py-1 rounded text-red-800">
                {currentPath}
              </code>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Home button */}
          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-sky-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home size={20} />
           {t("pageNotFound.goHome")}
          </button>

          {/* Go back button */}
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
           {t("pageNotFound.goBack")}
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>{t("pageNotFound.contactSupport")}</p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;