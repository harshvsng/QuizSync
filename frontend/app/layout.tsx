import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import Provider from "@/components/provider";

const theme = createTheme({/** Put your mantine theme override here */});

export const metadata: Metadata = {
  title: "Quiz Sync",
  description: "Quiz Sync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={theme}>
          <Provider>{children}</Provider>
        </MantineProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
