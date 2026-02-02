import { ArrowRight, Play } from 'lucide-react';
import ArtistSpotlight from '../components/Home/ArtistSpotlight';
import PerformerPanel from '../components/Home/PerformerPanel';
import Features from '../components/Home/Features';
import Events from '../components/Home/Events';
import MarketPlace from '../components/Home/MarketPlace';
import MentorshipSection from '../components/Home/MentorshipSection';
import CTA from '../components/Home/CTA';
import { Footer } from '../components/Footer';
import Testimonials from '../components/Home/Testimonials';

const Home = () => {
    return (
        <main className="bg-black text-white selection:bg-indigo-500/30 font-sans w-full overflow-x-hidden">

            <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-20 bg-black">

                <div className="absolute inset-0 pointer-events-none">

                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] opacity-50"></div>

                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                    <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full border border-white/5 border-t-white/10 animate-[spin_20s_linear_infinite] pointer-events-none"></div>

                    <div className="absolute top-1/3 -left-10 w-[400px] h-[400px] rounded-full border border-white/5 border-b-indigo-500/30 animate-[spin_15s_linear_infinite] pointer-events-none" style={{ animationDirection: 'reverse' }}></div>
                </div>

                <div className="relative z-10 w-full mx-auto px-6 lg:px-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm cursor-default">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                <span className="text-white/70 tracking-wide text-sm font-medium">Where Artists Connect & Create</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl text-white leading-[1.1] font-bold font-playfair tracking-tight">
                                Unleash Your <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                                    Creative Spirit
                                </span>
                            </h1>

                            <p className="text-lg lg:text-xl text-white/60 max-w-xl leading-[1.8] font-poppins">
                                All in one platform :— Explore gigs, join events, collaborate with artists, and unlock endless opportunities built for creators.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                                    Start Creating
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                                <button className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-medium">
                                    <Play size={20} className="fill-white" />
                                    Watch Demo
                                </button>
                            </div>

                            <div className="flex gap-12 pt-8 border-t border-white/10 mt-8">
                                {[
                                    { label: "Artists Joined", value: "50K+" },
                                    { label: "Live Events", value: "10K+" },
                                    { label: "Creative Cities", value: "100+" },
                                ].map((stat, i) => (
                                    <div key={i}>
                                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                                        <div className="text-indigo-200/60 text-sm mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-center h-full relative">
                            <PerformerPanel />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-black z-20"></div>
            </section>


            <div className="bg-black relative z-20">
                <ArtistSpotlight />
            </div>

            <div className="bg-black relative z-20 pb-20">
                <div className="w-full h-24 bg-gradient-to-b from-black to-[#0a0a0a]"></div>
                <Features />
            </div>

            <div className="bg-[#050505] relative z-20">
                <div className="w-full bg-gradient-to-b from-[#050505] to-black"></div>
                <Events />
            </div>

            <div className="bg-black relative z-20">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-900/50 to-transparent"></div>
                <MarketPlace />
            </div>

            <div className="bg-gradient-to-b from-black to-[#050505] relative z-20 border-t border-white/5">
                <MentorshipSection />
            </div>

            <div className="bg-black relative z-20">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <Testimonials />
            </div>

            <div className="bg-black relative z-20">
                <CTA />
            </div>

            <div className="bg-black relative z-20">
                <Footer />
            </div>

        </main>
    )
}

export default Home;