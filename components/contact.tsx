"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Twitter, MessageCircle, Send, Github, Mail, Copy, X, Hexagon } from "lucide-react"
import { useState } from "react"

export function Contact() {
  const [showEmailBox, setShowEmailBox] = useState(false)
  const [copied, setCopied] = useState(false)
  const email = "ammaraslam4243@gmail.com"

  const socialLinks = [
    {
      name: "Email",
      icon: Mail,
      href: "#",
      description: "Send us an email",
      isEmail: true,
      color: "primary",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      description: "Follow us for updates",
      color: "secondary",
    },
    {
      name: "Telegram",
      icon: MessageCircle,
      href: "#",
      description: "Join our community",
      color: "primary",
    },
    {
      name: "Discord",
      icon: Send,
      href: "#",
      description: "Connect with investors",
      color: "accent",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "#",
      description: "View our code",
      color: "secondary",
    },
  ]

  const colorClasses = {
    primary: {
      bg: "bg-primary/20",
      border: "border-primary/30 hover:border-primary/60",
      text: "text-primary",
      glow: "group-hover:shadow-[0_0_30px_rgba(0,200,200,0.3)]",
    },
    secondary: {
      bg: "bg-secondary/20",
      border: "border-secondary/30 hover:border-secondary/60",
      text: "text-secondary",
      glow: "group-hover:shadow-[0_0_30px_rgba(200,0,200,0.3)]",
    },
    accent: {
      bg: "bg-accent/20",
      border: "border-accent/30 hover:border-accent/60",
      text: "text-accent",
      glow: "group-hover:shadow-[0_0_30px_rgba(0,200,100,0.3)]",
    },
  }

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowEmailBox(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30 mb-6">
            <span className="text-sm font-medium text-accent">Get in Touch</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Contact <span className="text-primary neon-text">Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Connect with the Gecim community and stay updated with the latest news, announcements, and developments in
            our ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {socialLinks.map((social, index) => {
            const colors = colorClasses[social.color as keyof typeof colorClasses]
            return (
              <Card
                key={index}
                className={`glass-card border ${colors.border} transition-all duration-300 cursor-pointer group ${colors.glow} hover:scale-105`}
              >
                <CardContent className="p-5 text-center">
                  <div
                    onClick={social.isEmail ? handleEmailClick : undefined}
                    className={social.isEmail ? "block cursor-pointer" : ""}
                  >
                    <a href={!social.isEmail ? social.href : "#"} className="block">
                      <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                        <social.icon size={28} className={colors.text} />
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-1">{social.name}</h3>
                      <p className="text-muted-foreground text-xs text-pretty">{social.description}</p>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-20 glass-card rounded-3xl p-8 md:p-12 text-center border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Join the Revolution?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
              Do not miss out on the opportunity to be part of the Gecim ecosystem. Join thousands of investors who are
              already building the future of decentralized finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-primary/20 text-primary border border-primary/50 rounded-xl hover:bg-primary/30 transition-all neon-border text-lg font-semibold">
                Start Investing Now
              </button>
              <button className="px-8 py-4 border border-secondary/50 text-secondary rounded-xl hover:bg-secondary/10 transition-all text-lg font-semibold">
                Download Whitepaper
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-20 pt-8 border-t border-border/30">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="relative">
                <Hexagon className="w-8 h-8 text-primary" fill="currentColor" fillOpacity={0.1} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">G</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-primary neon-text tracking-wider">GECIM</span>
            </div>
            <p className="text-muted-foreground text-sm">
              2025 Gecim Token. All rights reserved. Building the future of decentralized finance.
            </p>
          </div>
        </footer>
      </div>

      {showEmailBox && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm glass-card border border-primary/50 neon-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">Email Address</h3>
                <button
                  onClick={() => setShowEmailBox(false)}
                  className="text-muted-foreground hover:text-primary transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-xl mb-4 border border-border/50">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <span className="text-foreground font-mono text-sm break-all">{email}</span>
              </div>

              <button
                onClick={copyToClipboard}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-semibold ${
                  copied 
                    ? "bg-accent/20 text-accent border border-accent/50" 
                    : "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30"
                }`}
              >
                <Copy size={18} />
                {copied ? "Copied!" : "Copy Email"}
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
