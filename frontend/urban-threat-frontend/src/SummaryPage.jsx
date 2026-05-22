import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axios";

export default function SummaryPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "India",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    console.log("Input changed:", e.target.name, e.target.value);

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckSafety = async () => {
    console.log("Check Safety button clicked");

    if (!formData.city.trim()) {
      console.warn("Validation failed: city is empty");
      setError("Location is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      console.log("Calling backend API with params:", {
        city: formData.city,
        state: formData.state,
        country: formData.country,
      });

      const response = await api.get("/predict-risk", {
        params: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
      });

      console.log("API response received:", response.data);

      setResult(response.data.data);
    } catch (err) {
      console.error("API request failed:", err);

      if (err.response) {
        console.error("Backend response error:", err.response.data);
      }

      setError("Failed to fetch safety assessment");
    } finally {
      console.log("API request completed");
      setLoading(false);
    }
  };

  const verdictColor = (verdict) => {
    switch (verdict) {
      case "SAFE":
        return "text-green-600 bg-green-50 border border-green-200";
      case "CAUTION":
        return "text-yellow-700 bg-yellow-50 border border-yellow-200";
      case "HIGH RISK":
        return "text-red-700 bg-red-50 border border-red-200";
      default:
        return "text-slate-600 bg-slate-50 border border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-lg rounded-3xl border border-sky-100 p-8">
          <h1 className="text-3xl font-bold text-sky-700 text-center mb-8">
            Safety Risk Assessment
          </h1>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              name="city"
              placeholder="Enter location"
              value={formData.city}
              onChange={handleChange}
              className="border border-sky-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
            />

            <input
              type="text"
              name="state"
              placeholder="State (optional)"
              value={formData.state}
              onChange={handleChange}
              className="border border-sky-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
            />

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="border border-sky-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div className="text-center mb-6">
            <button
              onClick={handleCheckSafety}
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Check Safety"}
            </button>
          </div>

          {loading && (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-8 mb-6 text-center">
              <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>

              <h3 className="text-xl font-semibold text-sky-700 mb-2">
                Analyzing Safety Signals...
              </h3>

              <p className="text-slate-600">
                Fetching recent incidents and computing threat intelligence score.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-center">
              {error}
            </div>
          )}

          {result && (
            <>
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-sky-50 rounded-2xl p-5 text-center shadow-sm border border-sky-100">
                  <p className="text-slate-500 text-sm">Location</p>
                  <p className="font-semibold text-slate-800 mt-2">
                    {result.location}
                  </p>
                </div>

                <div
                  className={`rounded-2xl p-5 text-center shadow-sm ${verdictColor(
                    result.verdict
                  )}`}
                >
                  <p className="text-sm">Verdict</p>
                  <p className="font-bold mt-2">{result.verdict}</p>
                </div>

                <div className="bg-sky-50 rounded-2xl p-5 text-center shadow-sm border border-sky-100">
                  <p className="text-slate-500 text-sm">Risk Score</p>
                  <p className="font-bold text-slate-800 mt-2">
                    {result.riskScore}
                  </p>
                </div>

                <div className="bg-sky-50 rounded-2xl p-5 text-center shadow-sm border border-sky-100">
                  <p className="text-slate-500 text-sm">Confidence</p>
                  <p className="font-bold text-slate-800 mt-2">
                    {result.confidence}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-sky-100 shadow-md p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                  Recent Incidents ({result.incidentCount})
                </h2>

                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {result.incidents.map((incident, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition"
                    >
                      <h3 className="font-semibold text-slate-800 mb-3">
                        {incident.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm">
                          {incident.category}
                        </span>

                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                          {incident.severity}
                        </span>
                      </div>

                      <a
                        href={incident.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:underline text-sm"
                      >
                        View Source
                      </a>
                    </div>
                  ))}
                </div>
              </div>

             
            </>
          )}
        </div>
      </div>
       <div className="text-center mt-8">
                <button
                  onClick={() => navigate("/")}
                  className="bg-white border border-sky-300 text-sky-700 hover:bg-sky-50 px-8 py-3 rounded-xl font-semibold shadow-sm"
                >
                  Back to Home
                </button>
              </div>
    </div>
  );
}