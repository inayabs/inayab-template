"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { login, verifyCode } from "@/app/api/authApi";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { TwoFactorForm } from "./forms/auth/2fa-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ✅ Define form validation schema using Zod
const formSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type UserFormValue = z.infer<typeof formSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Store password for 2FA sign-in

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    setHasError(false);
    setErrorMessage("");
    setEmail(data.email);
    setPassword(data.password); // Store password for later use in 2FA

    login({
      email: data.email,
      password: data.password,
      twoFactorCode: null,
    }).then((res) => {
      const { message, status, two_factor_validation } = res.data;

      if (!status) {
        setHasError(true);
        setErrorMessage(message);
        setLoading(false);
        return;
      }

      if (two_factor_validation) {
        setShow2FA(true);
        setLoading(false);
        return;
      }

      signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/",
      });
    });
  };

  const handleVerify2FA = async (code: string) => {
    setVerifyLoading(true);
    setHasError(false);
    setErrorMessage("");

    verifyCode({ email, code }).then((res) => {
      const { status, message } = res.data;

      if (!status) {
        setVerifyLoading(false);
        setHasError(true);
        setErrorMessage(message);
        return;
      }

      signIn("credentials", {
        email,
        twoFactorCode: code,
        password, // ✅ Now includes password for proper 2FA sign-in
        redirect: true,
        callbackUrl: "/",
      });
    });
  };

  useEffect(() => {
    setErrorMessage("");
    setHasError(false);
  }, [form.watch("email"), form.watch("password"), show2FA]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* ✅ Animated Error Message */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              key="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant={"destructive"}>
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {show2FA ? (
          <TwoFactorForm
            email={email}
            onVerify={handleVerify2FA}
            onCancel={() => setShow2FA(false)}
            verifyLoading={verifyLoading}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              {/* ✅ Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email..."
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ Password Input */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password..."
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ Login Button */}
              <Button
                type="submit"
                className="w-full relative"
                disabled={loading}
              >
                {loading && (
                  <LoaderCircle className="absolute left-3 animate-spin h-4 w-4" />
                )}
                Login
              </Button>

              <div className="text-right text-sm">
                <Link href="/auth/forgot-password" className="">
                  Forgot password?
                </Link>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
