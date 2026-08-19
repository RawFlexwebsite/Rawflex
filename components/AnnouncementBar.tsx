export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-[100000] bg-[#0C0E0D] border-b border-[#D4A82C] h-9 flex items-center justify-center px-4">
      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.22em] uppercase text-white flex items-center gap-2 whitespace-nowrap">
        <svg className="w-5 h-5 shrink-0 text-[#D4A82C]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L4.5 13.5h5L10 22l8.5-11.5h-5L13 2z" />
        </svg>
        Free Shipping on Orders Above ₹1,099
      </p>
    </div>
  );
}
