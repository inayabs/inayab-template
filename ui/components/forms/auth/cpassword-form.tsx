"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { changePassword, resetRequest } from "@/app/api/authApi";
import { passwordSchema } from "@/utils/schema/userSchema";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z
  .object({
    new_password: passwordSchema,
    confirm_password: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type UserFormValue = z.infer<typeof formSchema>;

export function ChangePForm({
  code,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div" & { code: string }>) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const defaultValues = {
    new_password: "",
    confirm_password: "",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    try {
      const newData = {
        ...data,
        token: code,
      };

      const response = await changePassword(newData);
      setLoading(false);
      setError("");
      setSuccess(response.data.message);
    } catch (e) {
      setSuccess("");
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Update password!</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <AnimatePresence>
            {error !== "" && (
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
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            {success !== "" && (
              <motion.div
                key="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert>
                  <CircleCheck className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    <p>{success}</p>
                    <p>
                      Go back to{" "}
                      <Link href={`/auth/login`} className="underline">
                        Login page
                      </Link>
                      .
                    </p>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm new password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full relative"
                    disabled={loading}
                  >
                    {loading && (
                      <span className="absolute left-3">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      </span>
                    )}
                    Reset password
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
