"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/en/products"); }, [router]);
  return null;
}
