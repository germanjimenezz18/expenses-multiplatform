import Header from "@/components/Header";
import SideNavbar from "@/components/SideNav";
import { SheetProvider } from "@/providers/sheet-provider";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  //   const mainClassName = "grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3";
  const mainClassName = "";

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 lg:overflow-hidden">
      <SideNavbar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className={mainClassName}>
          <SheetProvider />
          {children}
        </main>
      </div>
    </div>
  );
}
