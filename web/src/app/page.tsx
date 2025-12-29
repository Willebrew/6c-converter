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
    <div className="min-h-screen bg-black text-white">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-12 pb-6 px-4 sm:pt-16 sm:pb-8">
          <div className="max-w-lg mx-auto">
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-3">
              ISO 18000-6C
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              6C TOC Decoder
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pb-12">
          <div className="max-w-lg mx-auto">
            {/* Input */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  id="hex"
                  value={hex}
                  onChange={(e) => setHex(e.target.value.toUpperCase())}
                  placeholder="Enter hex value"
                  className="w-full px-0 py-4 bg-transparent border-0 border-b border-neutral-800 text-white text-lg sm:text-xl font-mono placeholder-neutral-600 focus:outline-none focus:border-white transition-colors"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="characters"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-medium py-3 px-6 text-sm uppercase tracking-wider transition-colors"
                >
                  {loading ? "Decoding..." : "Decode"}
                </button>
                {(result || error || hex) && (
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-6 py-3 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white text-sm uppercase tracking-wider transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Error */}
            {error && (
              <div className="mb-8 py-4 border-l-2 border-white pl-4">
                <p className="text-neutral-300 text-sm">{error}</p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-8">
                {/* Primary Result */}
                <div className="py-6 border-t border-neutral-800">
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                    Tag Number
                  </p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-mono font-light tracking-wider">
                    {result.printedNumber}
                  </p>
                </div>

                {/* Agency */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-6 border-t border-neutral-800">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Agency</p>
                    <p className="text-lg font-medium">{result.agencyInfo[0]}</p>
                    <p className="text-sm text-neutral-400">{result.agencyInfo[1]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Region</p>
                    <p className="text-lg">{result.agencyInfo[2]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Agency Code</p>
                    <p className="text-lg font-mono">{result.agencyCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Serial</p>
                    <p className="text-lg font-mono">{result.transponderSerialNumber.toLocaleString()}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-6 border-t border-neutral-800">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Check Digit</p>
                    <p className="text-lg font-mono">{result.checkDigit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Version</p>
                    <p className="text-lg">{result.versionDescription}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">HOV</p>
                    <p className="text-lg">{result.hovDescription}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Hash</p>
                    <p className="text-lg font-mono">
                      {result.uiiValidationHash.toString(16).toUpperCase().padStart(4, "0")}
                    </p>
                  </div>
                </div>

                {/* Classification */}
                {result.classification.assigned && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-6 border-t border-neutral-800">
                    <p className="col-span-2 text-xs text-neutral-500 uppercase tracking-wider mb-2">
                      Vehicle Classification
                    </p>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Type</p>
                      <p className="text-lg">{result.classification.vehicleType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Axles</p>
                      <p className="text-lg font-mono">{result.classification.axles}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Weight</p>
                      <p className="text-lg">{result.classification.weight}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Rear Tires</p>
                      <p className="text-lg">{result.classification.rearTires}</p>
                    </div>
                  </div>
                )}

                {/* Raw */}
                <div className="py-6 border-t border-neutral-800">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-4">Raw Data</p>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <span className="text-neutral-500 w-20 shrink-0">Barcode</span>
                      <span className="text-white break-all">{result.barcodeContent}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <span className="text-neutral-500 w-20 shrink-0">UII</span>
                      <span className="text-neutral-400 break-all">{result.uii}</span>
                    </div>
                    {result.pcBits && (
                      <div className="flex flex-col sm:flex-row sm:gap-4">
                        <span className="text-neutral-500 w-20 shrink-0">PC</span>
                        <span className="text-neutral-400">{result.pcBits}</span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <span className="text-neutral-500 w-20 shrink-0">DSFID</span>
                      <span className="text-neutral-400">0x{result.dsfid.toString(16).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-neutral-900">
          <p className="max-w-lg mx-auto text-xs text-neutral-600 font-mono">
            6C TOC AVI Standard v3.1
          </p>
        </footer>
      </div>
    </div>
  );
}
