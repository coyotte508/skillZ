import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

const Logout = () => {
  const { t } = useTranslation();
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      {t("nav.logout")}
    </button>
  );
};

export default Logout;