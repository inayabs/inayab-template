"use client";

import { useEffect, useState } from "react";
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

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setHasError(false);
    setErrorMessage("");

    login({ email, password }).then((res) => {
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
        email,
        password,
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
        password: password,
        redirect: true,
        callbackUrl: "/",
      });
    });
  };

  useEffect(() => {
    setErrorMessage("");
    setHasError(false);
  }, [email, password, show2FA]);

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
            setVerifyLoading={setVerifyLoading}
          />
        ) : (
          <>
            <div className="grid gap-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              onClick={onSubmit}
              className="w-full relative"
              disabled={loading}
            >
              {loading && (
                <LoaderCircle className="absolute left-3 animate-spin h-4 w-4" />
              )}
              Login
            </Button>

            <div className="text-right text-sm">
              <Link
                href="/auth/forgot-password"
                className="underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
