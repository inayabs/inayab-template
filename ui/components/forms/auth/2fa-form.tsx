"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
// import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { LoaderCircle, Lock } from "lucide-react";

interface TwoFactorFormProps {
  email: string;
  onVerify: (code: string) => void;
  onCancel: () => void;
  verifyLoading: boolean;
}

export function TwoFactorForm({
  email,
  onVerify,
  onCancel,
  verifyLoading,
}: TwoFactorFormProps) {
  const [code, setCode] = useState("");

  // ✅ Automatically submit when all 6 digits are entered
  useEffect(() => {
    if (code.length === 6) {
      onSubmit();
    }
  }, [code]);

  const onSubmit = async () => {
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl flex items-center gap-2 justify-center">
          <Lock className="w-6 h-6" />
          <span>Two-factor authentication</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* {error && (
          <Alert variant="destructive">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}
        <div className="text-center text-sm">
          We sent a code to <strong>{email}</strong>
        </div>
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) =>
            setCode(value.replace(/[^A-Z0-9]/gi, "").toUpperCase())
          }
          disabled={verifyLoading}
          className="w-full flex justify-center"
        >
          <InputOTPGroup className="w-full flex justify-between gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-full h-12 text-xl text-center uppercase border border-gray-300 rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <div className="flex gap-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={verifyLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="flex-1 relative"
            disabled={verifyLoading || code.length !== 6}
          >
            {verifyLoading && (
              <LoaderCircle className="absolute left-3 animate-spin h-4 w-4" />
            )}
            Verify
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
