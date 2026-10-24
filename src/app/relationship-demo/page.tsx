import { Suspense } from "react";
import { notFound } from "next/navigation";
import { RelationshipEntry } from "@/components/relationship-workspace";
export const metadata={title:"Hop · Local relationship demo",robots:{index:false,follow:false}};
export default function Page(){if(process.env.NEXT_PUBLIC_HOP_REVIEW_MODE!=="1")notFound();return <Suspense fallback={<main className="hop-wrap hop-work-main"><p role="status">Getting the local relationship demo ready…</p></main>}><RelationshipEntry/></Suspense>;}
