"use client";

import { useState } from "react";
import { Decoded6CTOC } from "@/lib/decoder";
import { SAMPLE_TAGS } from "@/lib/constants";

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

  const handleSampleClick = (sampleHex: string) => {
    setHex(sampleHex);
    decode(sampleHex);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            6C TOC Tag Decoder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Decode ISO 18000-6C toll transponder tags
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label
              htmlFor="hex"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Enter hex value (24 or 28 characters)
            </label>
            <input
              type="text"
              id="hex"
              value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              placeholder="31B03E9400000407500001561F98"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "Decoding..." : "Decode"}
          </button>
        </form>

        {/* Sample Tags */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Try a sample:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TAGS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleClick(sample.hex)}
                className="px-3 py-1.5 text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {sample.hex.slice(0, 12)}...
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Decoded Number */}
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Decoded Tag Number
              </p>
              <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                {result.printedNumber}
              </p>
            </div>

            {/* Details Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow
                  label="Agency"
                  value={`${result.agencyInfo[0]} - ${result.agencyInfo[1]}`}
                />
                <DetailRow label="State/Region" value={result.agencyInfo[2]} />
                <DetailRow
                  label="Agency Code"
                  value={result.agencyCode.toString()}
                />
                <DetailRow
                  label="Serial Number"
                  value={result.transponderSerialNumber.toString()}
                />
                <DetailRow
                  label="Check Digit"
                  value={`${result.checkDigit} (Luhn)`}
                />
                <DetailRow label="Version" value={result.versionDescription} />
                <DetailRow label="HOV Declaration" value={result.hovDescription} />
                <DetailRow
                  label="UII Hash"
                  value={`0x${result.uiiValidationHash.toString(16).toUpperCase().padStart(4, "0")}`}
                />
              </div>

              {/* Classification */}
              {result.classification.assigned && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Vehicle Classification
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailRow
                      label="Type"
                      value={result.classification.vehicleType}
                    />
                    <DetailRow
                      label="Axles"
                      value={result.classification.axles.toString()}
                    />
                    <DetailRow label="Weight" value={result.classification.weight} />
                    <DetailRow
                      label="Rear Tires"
                      value={result.classification.rearTires}
                    />
                  </div>
                </div>
              )}

              {/* Barcode */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <DetailRow
                  label="Barcode Content"
                  value={result.barcodeContent}
                  mono
                />
              </div>

              {/* Raw Data */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                  Raw Data
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    UII: {result.uii}
                  </p>
                  {result.pcBits && (
                    <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                      PC: {result.pcBits}
                    </p>
                  )}
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    DSFID: 0x{result.dsfid.toString(16).toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8">
          Based on 6C TOC AVI Standard v3.1 Rev 1 (ISO 18000-6C/63)
        </p>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-500">{label}</p>
      <p
        className={`text-sm text-gray-900 dark:text-white ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
