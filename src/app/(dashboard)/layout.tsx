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
            className="w-full flex items-start justify-start gap-2 mb-6"
          >
            <Image className="hidden lg:block" src="/logo.png" alt="logo" width={150} height={100} />
            <Image className="lg:hidden" src="/logo1.png" alt="logo" width={100} height={100} />
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
