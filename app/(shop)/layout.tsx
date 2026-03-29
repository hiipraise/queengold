import StoreProviders from "@/components/store/StoreProviders";
import StoreHeader from "@/components/store/StoreHeader";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProviders>
      <StoreHeader />
      {children}
    </StoreProviders>
  );
}
