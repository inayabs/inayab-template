"use client";

import React from "react";
import GeneralInformation from "@/components/forms/account/general-information";
import PasswordInformation from "@/components/forms/account/password-information";
import ManageTwoFactor from "@/components/forms/account/two-factor";

const Page = () => {
  return (
    <div>
      {/* <ActionButtons handleSave={handleSave} saveBtnLoading={saveBtnLoading} /> */}
      <div className="grid xl:grid-cols-2 gap-6 grid-flow-row">
        <div className="space-y-6">
          <GeneralInformation />
          <PasswordInformation />
        </div>
        <div className="space-y-6">
          <ManageTwoFactor />
          {/* <Alerts /> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
