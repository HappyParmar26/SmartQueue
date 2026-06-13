import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isInCurrentPage = (path) => pathname === path;

  const items = [
    { name: "Home", path: "/" },
    { name: "Queue", path: "#" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Book Token", path: "/book-token" },
    { name: "My Tickets", path: "#" },
    { name: "Help", path: "#" },
  ];

  return (
    <header className="bg-gray-900 text-white border-b border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="font-bold text-lg">SmartQueue</div>

        <nav className="relative">
          <button
            className="block sm:hidden text-xl p-1"
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
          >
            ☰
          </button>

          <ul
            className={`
              ${open ? "flex" : "hidden"}
              absolute top-14 right-0
              flex-col
              bg-slate-950
              p-2
              rounded-lg
              shadow-lg
              sm:shadow-none
              sm:static
              sm:flex
              sm:flex-row
              sm:bg-transparent
              sm:p-0
              gap-4
            `}
          >
            {items
              .filter((item) => !isInCurrentPage(item.path))
              .map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="block px-3 py-2 rounded-md hover:bg-white/5 transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
