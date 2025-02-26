"use client";
import { ChangePForm } from "@/components/forms/auth/cpassword-form";
import { GalleryVerticalEnd } from "lucide-react";
// import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ChangePasswordPage() {
  const params = useParams();

  const code = params.code;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          {/* <Image
            src={"/branding/logo-full.png"}
            alt="Company Logo"
            width={400} // ✅ Adjusted to match form width
            height={100} // ✅ Proportional height
            className="cursor-pointer transition-all duration-200 w-full max-w-sm" // ✅ Ensures full width on smaller screens
            priority
          /> */}
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <ChangePForm code={code} />
      </div>
    </div>
  );
}
