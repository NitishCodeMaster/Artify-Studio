import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, ExternalLink, Layers3, Loader2, Mail, MapPin, Palette, Sparkles, Star, UserRound } from 'lucide-react';
import api from '../utils/api';
import { Footer } from '../components/Footer';
import { ImageWithFallback } from '../components/placeholder/ImageWithFallback';

const fallbackCover = 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1800&auto=format&fit=crop';

export default function Portfolio() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const res = await api.get(`/users/portfolio/${id}`);
                setArtist(res.data.artist);
                setPosts(res.data.posts || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Portfolio not found');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
                <Loader2 className="animate-spin text-amber-400" size={42} />
            </div>
        );
    }

    if (error || !artist) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-center text-white">
                <h1 className="mb-3 text-3xl font-black">Portfolio unavailable</h1>
                <p className="mb-6 text-white/50">{error}</p>
                <button onClick={() => navigate(-1)} className="rounded-full bg-white px-6 py-3 font-bold text-black">
                    Go Back
                </button>
            </div>
        );
    }

    const portfolio = artist.portfolio || {};
    const works = portfolio.featuredWorks || [];
    const skills = portfolio.skills || [];
    const services = portfolio.services || [];
    const cover = portfolio.coverImage || artist.profilePic || fallbackCover;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <section className="relative min-h-[72vh] overflow-hidden border-b border-white/10">
                <ImageWithFallback src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-black/35" />
                <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-5 pb-12 pt-24 sm:px-8">
                    <button onClick={() => navigate(-1)} className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-sm text-white/75 backdrop-blur-md transition hover:bg-white/10 hover:text-white">
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="max-w-3xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100 backdrop-blur-md">
                            <Sparkles size={14} />
                            Artist Portfolio
                        </div>
                        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                            {artist.name}
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/72">
                            {portfolio.headline || artist.bio || 'A creative portfolio built on Artify.'}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3 text-sm">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold">
                                <Palette size={16} className="text-amber-300" />
                                {artist.artStyle || artist.role || 'Artist'}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold">
                                <MapPin size={16} className="text-pink-300" />
                                {artist.originLocation || 'Creative Network'}
                            </span>
                            {portfolio.isAvailableForWork && (
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 font-semibold text-emerald-100">
                                    <BriefcaseBusiness size={16} />
                                    Available
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
                <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="space-y-5">
                        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                                <UserRound className="text-amber-300" />
                                About
                            </h2>
                            <p className="whitespace-pre-wrap leading-relaxed text-white/68">
                                {portfolio.about || artist.bio || 'This artist is still writing their portfolio story.'}
                            </p>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
                                <Layers3 className="text-amber-300" />
                                Featured Work
                            </h2>
                            {works.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {works.map((work, index) => (
                                        <article key={`${work.title}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/35">
                                            {work.image && <ImageWithFallback src={work.image} alt={work.title} className="h-52 w-full object-cover" />}
                                            <div className="p-4">
                                                <h3 className="font-bold">{work.title || 'Untitled work'}</h3>
                                                {work.description && <p className="mt-2 text-sm leading-relaxed text-white/55">{work.description}</p>}
                                                {work.link && (
                                                    <a href={work.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-300">
                                                        Open Work <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : posts.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {posts.map((post) => (
                                        <div key={post._id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/35">
                                            {post.image && <ImageWithFallback src={post.image} alt="" className="h-52 w-full object-cover" />}
                                            <p className="p-4 text-sm leading-relaxed text-white/62">{post.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-white/35">
                                    No featured work added yet.
                                </div>
                            )}
                        </section>
                    </div>

                    <aside className="space-y-5">
                        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                            <h3 className="mb-4 flex items-center gap-2 font-bold uppercase tracking-[0.16em] text-white/45">
                                <Star size={16} className="text-amber-300" />
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(skills.length ? skills : [artist.artStyle || artist.role || 'Creative']).map((skill) => (
                                    <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                            <h3 className="mb-4 font-bold uppercase tracking-[0.16em] text-white/45">Services</h3>
                            <div className="space-y-2">
                                {(services.length ? services : ['Custom work', 'Collaborations', 'Creative projects']).map((service) => (
                                    <div key={service} className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
                                        {service}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-6">
                            <h3 className="mb-2 text-xl font-black">Work With {artist.name?.split(' ')[0]}</h3>
                            <p className="mb-5 text-sm leading-relaxed text-white/60">Reach out for bookings, commissions, collaborations, or showcase opportunities.</p>
                            <a href={`mailto:${portfolio.contactEmail || artist.email}`} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-black text-black transition hover:bg-amber-100">
                                <Mail size={17} />
                                Contact Artist
                            </a>
                            <Link to={`/profile/${artist._id}`} className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white/75 transition hover:bg-white/10">
                                View Artify Profile
                            </Link>
                        </section>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
