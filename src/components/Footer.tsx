export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 w-full left-0 mt-20 border-t border-(--line) px-4 pb-14 pt-10 text-(--sea-ink-soft) bg-(--bg-base) opacity-90">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Your name here. All rights reserved.
        </p>
        <p className="island-kicker m-0">Built with TanStack Start</p>
      </div>
    </footer>
  );
}
