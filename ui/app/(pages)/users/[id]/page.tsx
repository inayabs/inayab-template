"use client";

import { getSingleUser, updateSingleUser } from "@/app/api/userApi";
import UserForm from "@/components/forms/user/user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { passwordSchema } from "@/utils/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, LoaderCircle, Save, UserPen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  const params = useParams();
  // const userId = params.id;
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const numericUserId = userId ? parseInt(userId, 10) : undefined;

  if (!numericUserId || isNaN(numericUserId)) {
    console.error("Invalid user ID");
  }

  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const defaultValues = {
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    password: "",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { reset } = form;

  const onSubmit = (d: UserFormValue) => {
    updateUserFromApi(d);
  };

  const updateUserFromApi = async (data: UserFormValue) => {
    if (numericUserId === undefined || isNaN(numericUserId)) {
      console.error("Invalid user ID");
      return;
    }
    setSaveBtnLoading(true);

    try {
      const response = await updateSingleUser(numericUserId, data);

      setSaveBtnLoading(false);
      toast.success(response?.data?.message);
    } catch (error) {
      setSaveBtnLoading(false);

      let errorMessage = "An unexpected error occurred";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const fetchUser = async () => {
    // Ensure numericUserId is valid before proceeding
    if (typeof numericUserId !== "number" || isNaN(numericUserId)) {
      console.error("Invalid user ID");
      setFormLoading(false);
      return;
    }

    try {
      const response = await getSingleUser(numericUserId);
      const userData = response.data.data;

      reset(userData);
      setFormLoading(false);
    } catch (error) {
      setFormLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [numericUserId]);

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
                  <UserPen className="w-6 h-6" />
                  <span>Update user</span>
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
                  formLoading={formLoading}
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
