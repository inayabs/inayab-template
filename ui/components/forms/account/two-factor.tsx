import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const ManageTwoFactor = () => {
  const { data: session } = useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <KeyRound className="w-6 h-6" />
          <span>Manage two-factor authentication</span>
          <div className="ml-auto">
            <Button size={"sm"}>
              <Save />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Here you can manage the two-factor e-mail addresses you have
            registered on your account. These e-mail addresses will also receive
            any two-factor codes when you log into your account.
          </p>
          <p className="text-sm text-muted-foreground">
            If you would like to change your primary e-mail address, please
            contact arm@ccpc.com.au
          </p>
          <p>
            <span className="text-sm font-medium">
              Primary E-mail address:{" "}
            </span>{" "}
            <span className="text-sm text-muted-foreground">
              {session?.user?.email}
            </span>
          </p>
        </div>
        <p>
          <span className="text-sm font-medium">
            Secondary E-mail addresses:
          </span>
        </p>
        <div>
          <Button size={"sm"} className="mt-2" variant={"ghost"}>
            Add another email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageTwoFactor;
