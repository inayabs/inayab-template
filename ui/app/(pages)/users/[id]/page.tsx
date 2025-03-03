"use client";

import { getSingleUser, updateSingleUser } from "@/app/api/userApi";
import UserForm from "@/components/forms/user/user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { passwordSchema } from "@/utils/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle, Save, UserPen, UserPlus } from "lucide-react";
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

const page = () => {
  const params = useParams();
  const userId = params.id;

  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    password: "",
  });

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { reset } = form;

  const onSubmit = (d: UserFormValue) => {
    updateUserFromApi(d);
  };

  const updateUserFromApi = async (data: UserFormValue) => {
    setSaveBtnLoading(true);

    try {
      const response = await updateSingleUser(userId, data);

      setSaveBtnLoading(false);
      toast.success(response?.data?.message);
    } catch (error) {
      setSaveBtnLoading(false);

      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as any)?.response?.data?.message ||
            "An unexpected error occurred";

      toast.error(errorMessage);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await getSingleUser(userId);
      const userData = response.data.data;

      reset(userData);
      console.log(userData);
      setFormLoading(false);
    } catch (error) {
      setFormLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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

export default page;
