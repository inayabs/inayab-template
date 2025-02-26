import { updateUserPass } from "@/app/api/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/utils/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Lock, Save } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ✅ Define strong password validation

const formSchema = z
  .object({
    current_password: z.string().nonempty("Current Password is required"),
    new_password: passwordSchema,
    confirm_password: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type UserFormValue = z.infer<typeof formSchema>;

const PasswordInformation = () => {
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: UserFormValue) => {
    setSaveBtnLoading(true);
    updateUserPassFromApi(data);
  };

  const updateUserPassFromApi = async (data: UserFormValue) => {
    setSaveBtnLoading(true);
    try {
      await updateUserPass(data);
      toast.success("Password updated successfully.");
      setSaveBtnLoading(false);
    } catch (error) {
      toast.error(error?.message || "Failed to update password.");
      setSaveBtnLoading(false);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Lock className="w-6 h-6" />
              <span>Password Information</span>
              <div className="ml-auto">
                <Button type="submit" size={"sm"} disabled={saveBtnLoading}>
                  {saveBtnLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save />
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Current Password */}
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your current password"
                        {...field}
                        disabled={saveBtnLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* New Password */}
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a strong password"
                        {...field}
                        disabled={saveBtnLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter your new password"
                        {...field}
                        disabled={saveBtnLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default PasswordInformation;
