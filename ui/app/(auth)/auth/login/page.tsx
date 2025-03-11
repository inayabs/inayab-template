import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  console.log("authsecret", process.env.NEXTAUTH_SECRET);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image
            src={"/branding/logo-full.png"}
            alt="Company Logo"
            width={400} // ✅ Adjusted to match form width
            height={100} // ✅ Proportional height
            className="cursor-pointer transition-all duration-200 w-full max-w-sm" // ✅ Ensures full width on smaller screens
            priority
          />
          {/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc. */}
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
