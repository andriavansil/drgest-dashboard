"use client";

import Link from "next/link";
import { LayoutDashboard, Users, History, BookOpen, School, ClipboardList, FileText, Calendar, Bell, CircleUserRound, Settings, LogOut, CircleQuestionMark } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/med",
        visible: ["med", "med-pro"],
      },
      {
        icon: Users,
        label: "Pacientes",
        href: "/list/patients",
        visible: ["med", "med-pro"],
      },
      {
        icon: ClipboardList,
        label: "Consultas",
        href: "/list/appointments",
        visible: ["med", "med-pro"],
      },
      {
        icon: Calendar,
        label: "Calendário",
        href: "/calendar",
        visible: ["med", "med-pro"],
      },
      {
        icon: FileText,
        label: "Anexos",
        href: "/attachments",
        visible: ["med-pro"],
      },
      {
        icon: Bell,
        label: "Notificações",
        href: "/notifications",
        visible: ["med-pro"],
      },
      {
        icon: History,
        label: "Histórico",
        href: "/list/history",
        visible: ["med", "med-pro"],
      },
    ],
  },
  {
    title: "OUTROS",
    items: [
      {
        icon: CircleUserRound,
        label: "Conta",
        href: "/user-profile",        
        visible: ["med", "med-pro"],
      },
      {
        icon: Settings,
        label: "Configurações",
        href: "/settings",
        visible: ["med-pro"],
      },
      {
        icon: BookOpen,
        label: "Suporte",
        href: "/support",
        visible: ["med-pro"],
      },
      {
        icon: CircleQuestionMark,
        label: "Ajuda",
        href: "/help",
        visible: ["med-pro"],
      },
      {
        icon: LogOut,
        label: "Sair",
        action: "logout",
        visible: ["med", "med-pro"],
      },
    ],
  },
];


const Menu = () => {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string;
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="mt-4 text-xs overflow-y-auto h-[90%] no-scrollbar">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              const Icon = item.icon;

              if (item.action === "logout") {
                return (
                  <button
                    key={item.label}
                      onClick={async () => {
                        await signOut();
                        router.push("/");
                      }}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-SkyLight"
                  >
                    <Icon size={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                );
              } else {
                return (
                  <Link
                    href={item.href? item.href : "#"}
                    key={item.label}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-SkyLight"
                  >
                    <Icon size={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;