import { Head } from '@inertiajs/react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// --- LOCAL REPLACEMENTS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost';
    size?: 'default' | 'icon';
    children: React.ReactNode;
}

function LocalButton({ variant = 'default', size = 'default', className = '', children, ...props }: ButtonProps) {
    const baseStyle = "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
        ghost: "text-zinc-400 hover:bg-white/10 hover:text-white"
    };
    const sizes = {
        default: "h-10 px-4 py-2 text-sm",
        icon: "h-9 w-9 rounded-md"
    };
    return (
        <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

function LocalInput({ className = '', ...props }: InputProps) {
    return (
        <input
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Welcome() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hi there! I am Brasi AI agent, how can I help you today?',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const formatMessage = (text: any) => {
        if (!text) return '';
        let formatted = typeof text === 'string' ? text : String(text);
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\n/g, '<br />');
        return formatted;
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // --- IPC COMMUNICATION TO PARENT SITE ---
    useEffect(() => {
        const message = isOpen ? { type: 'BRASI_CHAT_RESIZE', state: 'open' } : { type: 'BRASI_CHAT_RESIZE', state: 'closed' };
        window.parent.postMessage(message, '*');
    }, [isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!response.ok) throw new Error('Server error');

            const data = await response.json();
            const aiResponseText = data.response || "I couldn't generate a response.";

            setMessages((prev) => [...prev, { role: 'assistant', content: aiResponseText }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>AI Agent</title>
                {/* Harshly forces the iframe page canvas to match viewport and makes backgrounds clear */}
                <style>{`
                    html, body, #app, main { 
                        background: transparent !important; 
                        background-color: transparent !important;
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                    }
                `}</style>
            </Head>

            {/* CRITICAL FIX: Standardized CSS inline styles enforce exact alignment 
              regardless of existing parent wrapper classes or layouts.
            */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    backgroundColor: 'transparent',
                    userSelect: 'none',
                    zIndex: 999999
                }}
            >
                {/* 1. Chat Trigger Button (Shown when closed) */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-16 w-16 items-center justify-center rounded-full border-0 bg-zinc-900 text-zinc-50 shadow-2xl transition-transform hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-zinc-950"
                        style={{ margin: '0 auto' }}
                    >
                        <MessageCircle className="h-8 w-8" />
                    </button>
                )}

                {/* 2. Chat Box Window (Shown when opened) */}
                {isOpen && (
                    <div
                        className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 dark:border-zinc-800 dark:bg-zinc-900"
                        style={{
                            width: '360px',
                            height: '520px',
                            maxWidth: '100vw',
                            maxHeight: '100vh'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-900 p-4 text-white dark:border-zinc-800 dark:bg-zinc-950">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-zinc-800 p-1">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-sm font-semibold tracking-tight">Brasi AI Assistant</h3>
                            </div>
                            <LocalButton variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-5 w-5" />
                            </LocalButton>
                        </div>

                        {/* Message Feed */}
                        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                            {messages.map((msg, ind) => (
                                <div key={ind} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-zinc-900 text-white'}`}>
                                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </div>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'rounded-br-none bg-zinc-900 text-white' : 'rounded-bl-none border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800'}`}>
                                        <div
                                            className="prose prose-sm dark:prose-invert break-words"
                                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-2 pl-10">
                                    <div className="flex gap-1">
                                        <span className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                                        <span className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                                        <span className="size-1.5 animate-bounce rounded-full bg-zinc-400" />
                                    </div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Typing...</p>
                                </div>
                            )}
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSend} className="flex gap-2 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                            <LocalInput
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything..."
                                className="flex-1 border-zinc-200 bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-800"
                                disabled={isLoading}
                            />
                            <LocalButton type="submit" disabled={isLoading || !input.trim()} size="icon">
                                <Send className="size-4" />
                            </LocalButton>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}