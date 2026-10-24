import Image from "next/image";
import Link from "next/link";
import { AGENT } from "@/config/agent";
export function BrandIcon({size=44}:{size?:number}){return <span className="inline-flex shrink-0 items-center justify-center bg-green p-1.5" style={{width:size,height:size}}><Image src="/brand/hop-icon.png" alt="Hop In Real Estate" width={2048} height={1988} sizes={`${size}px`} className="w-full h-full object-contain"/></span>;}
export function BrandWordmark({className="w-44",plate=true}:{className?:string;plate?:boolean}){return <span className={`inline-flex shrink-0 items-center ${plate?"bg-green p-2":""} ${className}`}><Image src="/brand/hop-wordmark.png" alt="Hop In Real Estate" width={2048} height={691} sizes="(max-width:640px) 152px,240px" className="w-full h-auto"/></span>;}
export function BrandMasthead(){return <header className="hop-task-masthead"><div className="hop-wrap"><Link href="/" className="hop-nav-brand" aria-label="Hop In Real Estate home"><BrandWordmark className="w-36 sm:w-44" plate={false}/><span>{AGENT.name} · {AGENT.brokerage}</span></Link><Link href="/learn">Field guide <span aria-hidden="true">↗</span></Link></div></header>;}
