import React, { useRef } from 'react';
import { CommunityHero } from '../components/Community/CommunityHero';
import { DiscussionList } from '../components/Community/DiscussionList';
import { CreatorSidebar } from '../components/Community/CreatorSidebar';
import { StatsStrip } from '../components/Community/StatsStrip';
import { Footer } from '../components/Footer';


export default function Community() {
    const discussionRef = useRef(null);
    const groupsRef = useRef(null);

    return (
        <>
            <section className="relative py-16 bg-[#050505] overflow-hidden">

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 max-w-[1680px] mx-auto px-6 lg:px-8">
                    <CommunityHero discussionRef={discussionRef} groupsRef={groupsRef} />

                    <div ref={discussionRef} className="grid xl:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_400px] gap-8 scroll-mt-24">
                        <DiscussionList />
                        <CreatorSidebar />
                    </div>

                    <div ref={groupsRef} className="mt-20 scroll-mt-24">
                        <StatsStrip />
                    </div>

                </div>
            </section>
            <Footer />
        </>
    );
}
