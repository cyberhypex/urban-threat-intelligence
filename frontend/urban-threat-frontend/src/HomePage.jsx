import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-white border border-sky-100 shadow-lg rounded-3xl p-10 text-center">
        <h1 className="text-4xl font-bold text-sky-700 mb-4">
          Urban Threat Intelligence
        </h1>

        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          Real-time safety intelligence powered by recent public incident analysis
          from the last <span className="font-semibold text-sky-700">4 days</span>.
        </p>

        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Threat categories considered during prediction
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            "Crime",
            "Violence",
            "Riots",
            "Protests",
            "Accidents",
            "Fires",
            "Robbery",
            "Public Threats"
          ].map((item) => (
            <div
              key={item}
              className="bg-sky-100 text-sky-700 py-3 rounded-xl font-medium"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <p className="text-amber-800 text-sm leading-relaxed">
            <span className="font-semibold">Disclaimer:</span> Predictions are
            generated using recent publicly available incident intelligence and
            heuristic risk scoring models. Actual ground conditions may vary.
          </p>
        </div>

        <button
          onClick={() => navigate("/summary")}
          className="bg-sky-600 hover:bg-sky-700 transition-colors text-white font-semibold px-8 py-3 rounded-xl shadow-md"
        >
          Check Location Safety
        </button>
      </div>
    </div>
  );
}