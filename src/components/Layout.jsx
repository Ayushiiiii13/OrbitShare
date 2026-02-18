import Navbar from "./Navbar";
import ParticlesBackground from "./ParticlesBackground";
import { Orb } from "./Orb";

export default function Layout({ children }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground font-sans antialiased selection:bg-primary/30">
            {/* Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ParticlesBackground />

                {/* Glowing Orbs */}
                <Orb color="bg-primary/30" size="w-[500px] h-[500px]" className="-top-20 -left-20" delay={0} />
                <Orb color="bg-secondary/20" size="w-[400px] h-[400px]" className="top-[20%] right-[10%]" delay={2} />
                <Orb color="bg-accent/20" size="w-[600px] h-[600px]" className="-bottom-32 -right-20" delay={4} />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
