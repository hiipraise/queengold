"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useCart } from "@/components/store/cart-context";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";

export function CartDrawer({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { items, subtotal, updateQty, removeItem } = useCart();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a0509] border-l border-[var(--border-gold)] p-6 z-50 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="font-serif text-xl">Cart</Dialog.Title>
            <Dialog.Close><X size={18} /></Dialog.Close>
          </div>
          {items.length === 0 ? (
            <div className="card-luxury p-6 text-sm">Your cart is empty.</div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="card-luxury p-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm opacity-70">{formatCurrency(item.price)}</p>
                  <div className="mt-3 flex gap-2 items-center">
                    <button className="px-2 border border-[var(--border-gold)]" onClick={() => updateQty(item.productId, Math.max(1, item.quantity - 1))}>-</button>
                    <span>{item.quantity}</span>
                    <button className="px-2 border border-[var(--border-gold)]" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                    <button className="ml-auto text-xs underline" onClick={() => removeItem(item.productId)}>Remove</button>
                  </div>
                </div>
              ))}
              <div className="card-luxury p-4">
                <p className="text-sm uppercase tracking-widest opacity-60">Subtotal</p>
                <p className="text-xl text-gold-gradient font-serif">{formatCurrency(subtotal)}</p>
              </div>
              <Link className="btn-gold h-12 w-full flex items-center justify-center text-xs" href="/checkout" onClick={() => setOpen(false)}>Proceed to Checkout</Link>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
