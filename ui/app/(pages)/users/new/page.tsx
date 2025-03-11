"use client";

import { createUser } from "@/app/api/userApi";
import UserForm from "@/components/forms/user/user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { passwordSchema } from "@/utils/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Save, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  first_name: z.string().nonempty("First Name is required"),
  last_name: z.string().nonempty("Last Name is required"),
  email: z.string().email(),
  role: z.string().nonempty("Role is required"),
  password: passwordSchema,
});

type UserFormValue = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);

  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    role: "User",
    password: "",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = (d: UserFormValue) => {
    createUserFromApi(d);
  };

  const createUserFromApi = async (data: UserFormValue) => {
    setSaveBtnLoading(true);

    try {
      const response = await createUser(data);

      // setSaveBtnLoading(false);
      toast.success(response?.data?.message);
      router.push("/users");
    } catch (error) {
      setSaveBtnLoading(false);

      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const errResponse = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        errorMessage = errResponse?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <Link href="/users">
          <Button variant={"ghost"} size={"sm"}>
            <ArrowLeft />
            Back
          </Button>
        </Link>
      </div>
      <div className="grid lg:grid-cols-2">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <UserPlus className="w-6 h-6" />
                  <span>Create new user</span>
                  <div className="ml-auto">
                    <Button size={"sm"} type="submit" disabled={saveBtnLoading}>
                      {saveBtnLoading ? (
                        <span className="h-4 w-4 animate-spin">
                          <LoaderCircle />
                        </span>
                      ) : (
                        <Save />
                      )}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserForm
                  form={form}
                  saveBtnLoading={saveBtnLoading}
                  formLoading={false}
                />
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Page;
