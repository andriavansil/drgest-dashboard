import { UserProfile } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-start min-h-screen py-10 px-4">
      <div className="w-full max-w-4xl">
        <UserProfile />
      </div>
    </div>
  );
}