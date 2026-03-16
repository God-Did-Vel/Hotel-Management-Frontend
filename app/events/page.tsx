export default function EventsPage() {
    return (
        <div className="pt-32 pb-20 bg-black min-h-screen text-white">
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Meetings & Events</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">Host your prestigious events in our state-of-the-art multi-functional spaces.</p>
            </div>
            <div className="container mx-auto px-6 lg:px-12">
                <div className="bg-[#121212] border border-white/10 p-12 text-center">
                    <h2 className="text-2xl font-serif mb-6">Unforgettable Gatherings</h2>
                    <p className="text-gray-400 font-light leading-relaxed max-w-3xl mx-auto mb-8">From grand corporate galas to intimate boardroom meetings and romantic weddings, our dedicated events team ensures flawless execution down to the finest detail. We offer over 10,000 square feet of adaptable space paired with cutting-edge audiovisual technology and unparalleled catering services.</p>
                    <button className="bg-[#8c7853] text-white px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-[#726242] transition-colors">Request a Proposal</button>
                </div>
            </div>
        </div>
    );
}
