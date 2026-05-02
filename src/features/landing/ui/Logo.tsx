export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-baseline text-xl md:text-2xl font-bold whitespace-nowrap text-white">
        Case
        <span className="text-red-600 group-hover:text-red-500 transition-colors ml-px">
          Shell
        </span>
      </span>
    </div>
  );
}
