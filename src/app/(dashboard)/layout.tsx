"use client";

import { useState } from "react";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      {menuOpen && (
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">Dr. Gest</span>
          </Link>
          <Menu />
        </div>
      )}

      {/* RIGHT */}
      <div
        className={`${
          menuOpen ? "w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]" : "w-full"
        } bg-[#F7F8FA] overflow-y-scroll flex flex-col`}
      >
        <Navbar toggleMenu={() => setMenuOpen(!menuOpen)} />
        {children}
      </div>
    </div>
  );
}
