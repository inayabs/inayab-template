"use client";

import { ChangePForm } from "@/components/forms/auth/cpassword-form";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ChangePasswordPage() {
  const params = useParams();

  // ✅ Ensure `code` is always a string
  const code = Array.isArray(params.code) ? params.code[0] : params.code || "";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image
            src={"/branding/logo-full.png"}
            alt="Company Logo"
            width={400}
            height={100}
            className="cursor-pointer transition-all duration-200 w-full max-w-sm"
            priority
          />
        </a>
        {code ? (
          <ChangePForm code={code} /> // ✅ Pass only if `code` is valid
        ) : (
          <p className="text-red-500 text-center">
            Invalid or missing reset code.
          </p>
        )}
      </div>
    </div>
  );
}
