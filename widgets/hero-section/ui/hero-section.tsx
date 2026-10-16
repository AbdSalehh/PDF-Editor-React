const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const TOOLS = ["Edit", "Merge", "Split", "Gambar ke PDF"];

export default function HeroSection() {
  const now = new Date();
  const date = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <header className="relative z-10 mx-auto w-full max-w-[84rem] px-6 pt-6 pb-14">
      <div className="flex items-center gap-3 border-b border-[#1a1917] pb-4 font-mono text-xs tracking-wide uppercase dark:border-[#ece8df]">
        <span className="size-2.5 bg-[#d9482b] dark:bg-[#ff7a59]" />
        <span className="font-medium">PDF Editor</span>
        <span className="hidden text-[#1a1917]/50 sm:inline dark:text-[#ece8df]/50">
          / {date}
        </span>
      </div>

      <h1 className="mt-14 font-display text-6xl! leading-[0.95]! tracking-tight sm:text-8xl! lg:text-[8rem]!">
        Edit PDF
        <br />
        <em className="text-[#d9482b] dark:text-[#ff7a59]">di browser Anda.</em>
      </h1>

      <div className="mt-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <p className="max-w-md text-base! leading-relaxed text-[#1a1917]/75 dark:text-[#ece8df]/75">
          Semua proses berjalan di perangkat Anda. File tidak dikirim ke server,
          tidak perlu akun, dan tidak ada yang disimpan.
        </p>

        <ol className="font-mono text-xs tracking-wide uppercase">
          {TOOLS.map((tool, i) => (
            <li
              key={tool}
              className="flex gap-6 border-t border-[#1a1917]/20 py-2 first:border-t-0 md:min-w-56 dark:border-[#ece8df]/20"
            >
              <span className="text-[#1a1917]/40 dark:text-[#ece8df]/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              {tool}
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
