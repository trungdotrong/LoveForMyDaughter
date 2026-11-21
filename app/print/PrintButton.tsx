"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-[#ff9f45] px-6 py-3 font-semibold text-white shadow-[0_4px_0_#e07b1f]"
    >
      Print cards
    </button>
  );
}
