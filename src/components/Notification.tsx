import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

type NotificationOptions = {
  text: string;
  color: string;
  timeout: number;
  bottomMargin?: boolean;
};

const Notification = () => {
  const [options, setOptions] = useState<NotificationOptions | undefined>(
    undefined
  );
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1024px)",
  });
  window.addEventListener("notification", (e: any) => {
    setOptions(e.detail);
  });
  useEffect(() => {
    setTimeout(() => setOptions(undefined), options?.timeout || 5000);
  }, [options]);
  return (
    <div
      className={`fixed z-50 ${
        isDesktop
          ? "right-10 top-24 h-20"
          : `bottom-${
              options?.bottomMargin ? "20" : "2"
            } w-11/12 max-w-screen-lg`
      } flex flex-col justify-center p-2 rounded-lg gradient-${
        options?.color
      } ${
        options
          ? `${isDesktop ? "w-2/12 maw-w-screen-sm" : "h-24"}`
          : `${isDesktop ? "w-0" : "h-0"}`
      } duration-500`}
    >
      <div className="flex flex-row justify-center">
        <span className="text-white">{options?.text}</span>
      </div>
    </div>
  );
};

export default Notification;