const userModel = require('../models/userModel');
const Workshop = require('../models/workshopModel');

const fallbackMentorCovers = [
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=1200&q=80',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80',
    'https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?w=1200&q=80',
];

const fallbackWorkshopCovers = [
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&q=80',
];

const accentThemes = {
    indigo: {
        gradient: 'from-sky-500 to-blue-600',
        shadow: 'group-hover:shadow-blue-500/20',
        border: 'group-hover:border-blue-400/50',
        text: 'text-sky-400',
        bg: 'bg-blue-500/10',
        badge: 'bg-blue-500/12 text-blue-200 border-blue-400/20',
        workshopGradient: 'from-blue-600 to-cyan-600',
    },
    amber: {
        gradient: 'from-orange-300 to-amber-600',
        shadow: 'group-hover:shadow-orange-500/20',
        border: 'group-hover:border-orange-400/50',
        text: 'text-orange-300',
        bg: 'bg-orange-500/10',
        badge: 'bg-orange-500/12 text-orange-200 border-orange-400/20',
        workshopGradient: 'from-amber-500 to-orange-600',
    },
    violet: {
        gradient: 'from-violet-400 to-purple-500',
        shadow: 'group-hover:shadow-violet-500/20',
        border: 'group-hover:border-violet-500/50',
        text: 'text-violet-400',
        bg: 'bg-violet-500/10',
        badge: 'bg-violet-500/12 text-violet-200 border-violet-400/20',
        workshopGradient: 'from-purple-600 to-pink-600',
    },
    emerald: {
        gradient: 'from-emerald-400 to-teal-500',
        shadow: 'group-hover:shadow-emerald-500/20',
        border: 'group-hover:border-emerald-400/50',
        text: 'text-emerald-300',
        bg: 'bg-emerald-500/10',
        badge: 'bg-emerald-500/12 text-emerald-200 border-emerald-400/20',
        workshopGradient: 'from-emerald-600 to-teal-600',
    },
};

const safeNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const buildMentorSlug = (name, userId) => {
    const base = (name || 'mentor')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32) || 'mentor';

    return `mentor-${base}-${String(userId).slice(-6)}`;
};

const getTheme = (accentColor) => accentThemes[accentColor] || accentThemes.indigo;

const serializeMentor = (mentor, index = 0) => {
    const profile = mentor.mentorProfile || {};
    const theme = getTheme(profile.accentColor);

    return {
        id: mentor._id,
        mentorSlug: profile.mentorSlug,
        name: mentor.name,
        role: mentor.role || 'Mentor',
        skill: profile.primarySkill || mentor.artStyle || mentor.role || 'Creative Practice',
        headline: profile.headline || mentor.bio || 'Mentoring ambitious artists with practical real-world guidance.',
        specialty: profile.sessionTag || profile.primarySkill || mentor.artStyle || 'Creative Mentorship',
        experience: `${safeNumber(profile.yearsExperience)} Years Exp.`,
        students: `${safeNumber(profile.totalStudents).toLocaleString()}+ Students`,
        rating: safeNumber(profile.rating, 4.8).toFixed(1),
        price: profile.hourlyRate > 0 ? `$${profile.hourlyRate}/hr` : 'Free intro',
        image: profile.coverImage || mentor.profilePic || fallbackMentorCovers[index % fallbackMentorCovers.length],
        color: theme.gradient,
        shadow: theme.shadow,
        border: theme.border,
        text: theme.text,
        bg: theme.bg,
        badge: theme.badge,
        totalSessions: safeNumber(profile.totalSessions),
        availableForBooking: profile.availableForBooking !== false,
        isVerified: Boolean(profile.isVerified),
        languages: profile.languages || [],
        mentorshipModes: profile.mentorshipModes || [],
        tags: profile.tags || [],
        accentColor: profile.accentColor || 'indigo',
    };
};

const serializeWorkshop = (workshop, index = 0) => {
    const mentor = workshop.mentor || {};
    const profile = mentor.mentorProfile || {};
    const theme = getTheme(workshop.accentColor || profile.accentColor);
    const startAt = new Date(workshop.startAt);

    return {
        id: workshop._id,
        title: workshop.title,
        tutor: `With ${mentor.name || 'Artify Mentor'}`,
        mentorId: mentor._id,
        mentorSlug: profile.mentorSlug,
        summary: workshop.summary,
        date: startAt.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }),
        attendees: safeNumber(workshop.attendeesCount),
        tags: workshop.tags?.length ? workshop.tags : [workshop.mode || 'Live'],
        color: workshop.accentColor || theme.workshopGradient,
        image: workshop.coverImage || profile.coverImage || mentor.profilePic || fallbackWorkshopCovers[index % fallbackWorkshopCovers.length],
        durationMinutes: safeNumber(workshop.durationMinutes, 60),
        mode: workshop.mode || 'Live',
    };
};

module.exports.getMentors = async (req, res) => {
    try {
        const limit = Math.min(safeNumber(req.query.limit, 6), 12);
        const query = req.query.q?.trim();

        const mentors = await userModel
            .find({
                'mentorProfile.isMentor': true,
                'mentorProfile.availableForBooking': true,
                ...(query ? {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { role: { $regex: query, $options: 'i' } },
                        { artStyle: { $regex: query, $options: 'i' } },
                        { 'mentorProfile.primarySkill': { $regex: query, $options: 'i' } },
                        { 'mentorProfile.tags': { $elemMatch: { $regex: query, $options: 'i' } } },
                    ]
                } : {})
            })
            .select('name role profilePic bio artStyle experience mentorProfile')
            .sort({
                'mentorProfile.isVerified': -1,
                'mentorProfile.rating': -1,
                'mentorProfile.totalStudents': -1,
                updatedAt: -1,
            })
            .limit(limit);

        res.status(200).json({
            success: true,
            mentors: mentors.map(serializeMentor),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch mentors', error: error.message });
    }
};

module.exports.getWorkshops = async (req, res) => {
    try {
        const limit = Math.min(safeNumber(req.query.limit, 6), 12);
        const query = req.query.q?.trim();

        const workshops = await Workshop.find({
            isPublished: true,
            ...(query ? {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { summary: { $regex: query, $options: 'i' } },
                    { tags: { $elemMatch: { $regex: query, $options: 'i' } } },
                ]
            } : {})
        })
            .populate('mentor', 'name profilePic mentorProfile role')
            .sort({ startAt: 1, createdAt: -1 })
            .limit(limit);

        res.status(200).json({
            success: true,
            workshops: workshops.map(serializeWorkshop),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch workshops', error: error.message });
    }
};

module.exports.getLearnOverview = async (req, res) => {
    try {
        const [mentorCount, workshopCount] = await Promise.all([
            userModel.countDocuments({ 'mentorProfile.isMentor': true, 'mentorProfile.availableForBooking': true }),
            Workshop.countDocuments({ isPublished: true }),
        ]);

        res.status(200).json({
            success: true,
            stats: {
                mentors: mentorCount,
                workshops: workshopCount,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch learn overview', error: error.message });
    }
};

module.exports.createWorkshop = async (req, res) => {
    try {
        if (!req.user?.mentorProfile?.isMentor) {
            return res.status(403).json({ success: false, message: 'Only mentors can create workshops' });
        }

        const workshop = await Workshop.create({
            title: req.body.title,
            mentor: req.user._id,
            summary: req.body.summary,
            startAt: req.body.startAt,
            durationMinutes: safeNumber(req.body.durationMinutes, 60),
            attendeesCount: safeNumber(req.body.attendeesCount, 0),
            tags: Array.isArray(req.body.tags) ? req.body.tags.filter(Boolean) : [],
            mode: req.body.mode || 'Live',
            coverImage: req.body.coverImage || '',
            accentColor: req.body.accentColor || getTheme(req.user.mentorProfile?.accentColor).workshopGradient,
            isPublished: req.body.isPublished !== false,
        });

        const populated = await Workshop.findById(workshop._id).populate('mentor', 'name profilePic mentorProfile role');

        res.status(201).json({
            success: true,
            message: 'Workshop created successfully',
            workshop: serializeWorkshop(populated),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create workshop', error: error.message });
    }
};

module.exports.seedLearnData = async (req, res) => {
    try {
        const mentorUsers = await userModel.find({ 'mentorProfile.isMentor': true }).limit(3);

        if (!mentorUsers.length) {
            return res.status(400).json({
                success: false,
                message: 'Create at least one mentor profile before seeding workshops.',
            });
        }

        const existingCount = await Workshop.countDocuments();
        if (existingCount > 0) {
            return res.status(200).json({ success: true, message: 'Learn data already exists.' });
        }

        const seeds = mentorUsers.map((mentor, index) => ({
            title: index === 0 ? 'Mastering Watercolor Textures' : index === 1 ? 'Music Production for Live Sets' : 'Movement & Stage Presence Lab',
            mentor: mentor._id,
            summary: 'A focused live workshop built to help creators sharpen practical skills with real mentor feedback.',
            startAt: new Date(Date.now() + (index + 1) * 86400000),
            durationMinutes: 75,
            attendeesCount: 80 + index * 35,
            tags: [mentor.mentorProfile?.primarySkill || mentor.artStyle || 'Creative', 'Live'],
            mode: 'Live',
            coverImage: mentor.mentorProfile?.coverImage || mentor.profilePic || fallbackWorkshopCovers[index % fallbackWorkshopCovers.length],
            accentColor: getTheme(mentor.mentorProfile?.accentColor).workshopGradient,
        }));

        await Workshop.insertMany(seeds);

        res.status(201).json({ success: true, message: 'Learn demo data seeded successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to seed learn data', error: error.message });
    }
};

module.exports.buildMentorSlug = buildMentorSlug;
