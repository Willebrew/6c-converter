"use client";

import { useState } from "react";
import { Decoded6CTOC } from "@/lib/decoder";

export default function Home() {
  const [hex, setHex] = useState("");
  const [result, setResult] = useState<Decoded6CTOC | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const decode = async (hexValue: string) => {
    if (!hexValue.trim()) {
      setError("Please enter a hex value");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hex: hexValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to decode");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    decode(hex);
  };

  const clearForm = () => {
    setHex("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4 px-4 sm:pt-12 sm:pb-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mb-4 sm:mb-6 shadow-lg shadow-emerald-500/25">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
              6C TOC Tag Decoder
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Decode ISO 18000-6C toll transponder tags
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pb-8">
          <div className="max-w-xl mx-auto">
            {/* Input Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-700/50 shadow-xl">
              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="hex"
                  className="block text-sm font-medium text-slate-300 mb-2 sm:mb-3"
                >
                  Hex Value
                </label>
                <input
                  type="text"
                  id="hex"
                  value={hex}
                  onChange={(e) => setHex(e.target.value.toUpperCase())}
                  placeholder="Enter 24 or 28 character hex..."
                  className="w-full px-4 py-3 sm:py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white font-mono text-sm sm:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="characters"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:shadow-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Decoding
                      </span>
                    ) : (
                      "Decode"
                    )}
                  </button>
                  {(result || error || hex) && (
                    <button
                      type="button"
                      onClick={clearForm}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-medium rounded-xl transition-all"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 sm:mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-400 text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                {/* Primary Result */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <p className="text-emerald-400/80 text-xs sm:text-sm font-medium uppercase tracking-wider mb-1 sm:mb-2">
                    Decoded Tag Number
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white tracking-wider">
                    {result.printedNumber}
                  </p>
                </div>

                {/* Details Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 overflow-hidden">
                  {/* Agency Section */}
                  <div className="p-4 sm:p-6 border-b border-slate-700/50">
                    <h3 className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">
                      Agency Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <InfoItem
                        label="Agency"
                        value={`${result.agencyInfo[0]}`}
                        subvalue={result.agencyInfo[1]}
                      />
                      <InfoItem label="Region" value={result.agencyInfo[2]} />
                      <InfoItem label="Agency Code" value={result.agencyCode.toString()} />
                      <InfoItem
                        label="Serial Number"
                        value={result.transponderSerialNumber.toLocaleString()}
                      />
                    </div>
                  </div>

                  {/* Tag Details Section */}
                  <div className="p-4 sm:p-6 border-b border-slate-700/50">
                    <h3 className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">
                      Tag Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <InfoItem label="Check Digit" value={`${result.checkDigit}`} subvalue="Luhn" />
                      <InfoItem label="Version" value={result.versionDescription} />
                      <InfoItem label="HOV Status" value={result.hovDescription} />
                      <InfoItem
                        label="UII Hash"
                        value={`0x${result.uiiValidationHash.toString(16).toUpperCase().padStart(4, "0")}`}
                        mono
                      />
                    </div>
                  </div>

                  {/* Classification Section */}
                  {result.classification.assigned && (
                    <div className="p-4 sm:p-6 border-b border-slate-700/50">
                      <h3 className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">
                        Vehicle Classification
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <InfoItem label="Type" value={result.classification.vehicleType} />
                        <InfoItem label="Axles" value={result.classification.axles.toString()} />
                        <InfoItem label="Weight" value={result.classification.weight} />
                        <InfoItem label="Rear Tires" value={result.classification.rearTires} />
                      </div>
                    </div>
                  )}

                  {/* Raw Data Section */}
                  <div className="p-4 sm:p-6 bg-slate-900/30">
                    <h3 className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">
                      Raw Data
                    </h3>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-xs text-slate-500 sm:w-20">Barcode:</span>
                        <code className="text-xs sm:text-sm font-mono text-emerald-400 break-all">
                          {result.barcodeContent}
                        </code>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-xs text-slate-500 sm:w-20">UII:</span>
                        <code className="text-xs sm:text-sm font-mono text-slate-300 break-all">
                          {result.uii}
                        </code>
                      </div>
                      {result.pcBits && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="text-xs text-slate-500 sm:w-20">PC Bits:</span>
                          <code className="text-xs sm:text-sm font-mono text-slate-300">
                            {result.pcBits}
                          </code>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-xs text-slate-500 sm:w-20">DSFID:</span>
                        <code className="text-xs sm:text-sm font-mono text-slate-300">
                          0x{result.dsfid.toString(16).toUpperCase()}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4">
          <p className="text-center text-xs sm:text-sm text-slate-500">
            Based on 6C TOC AVI Standard v3.1 Rev 1
          </p>
        </footer>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  subvalue,
  mono = false,
}: {
  label: string;
  value: string;
  subvalue?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5 sm:mb-1">{label}</p>
      <p className={`text-sm sm:text-base text-white ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
      {subvalue && (
        <p className="text-xs text-slate-400 mt-0.5">{subvalue}</p>
      )}
    </div>
  );
}
