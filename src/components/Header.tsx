import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";
import LoginButton from "./LoginButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg flex w-full">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4 justify-between w-screen">
        
        <ThemeToggle />

        <div className="flex gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="nav-link"
            activeProps={{ className: "nav-link is-active" }}
          >
            Contact
          </Link>

        </div>

        <LoginButton/>
      </nav>

    </header>
  );
}
