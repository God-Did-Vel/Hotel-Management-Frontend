"use client";

import { motion } from "framer-motion";
import { Coffee, UtensilsCrossed, Wine } from "lucide-react";

const meals = [
    {
        name: "Wagyu Beef Filet",
        description: "Served with truffle mash, roasted asparagus, and a port wine reduction.",
        price: "$85",
        category: "Dinner",
    },
    {
        name: "Lobster Ravioli",
        description: "Handmade pasta stuffed with Maine lobster in a saffron cream sauce.",
        price: "$45",
        category: "Dinner",
    },
    {
        name: "Tiramisu della Casa",
        description: "Classic Italian dessert made with espresso, mascarpone, and cocoa.",
        price: "$18",
        category: "Dessert",
    },
    {
        name: "Mediterranean Sea Bass",
        description: "Pan-seared, served with lemon butter, capers, and seasonal greens.",
        price: "$55",
        category: "Dinner",
    },
    {
        name: "Artisan Eggs Benedict",
        description: "Poached eggs, prosciutto, hollandaise on toasted ciabatta.",
        price: "$28",
        category: "Breakfast",
    },
    {
        name: "Avocado & Crab Tartare",
        description: "Fresh crab meat, avocado puree, and citrus dressing.",
        price: "$32",
        category: "Appetizer",
    },
    {
        name: "Tuscan Ribeye",
        description: "Dry-aged 16oz bone-in ribeye with rosemary potatoes.",
        price: "$95",
        category: "Dinner",
    },
    {
        name: "Saffron Risotto",
        description: "Creamy Arborio rice infused with Spanish saffron and parmesan.",
        price: "$38",
        category: "Dinner",
    },
];

export default function RestaurantPage() {
    return (
        <div className="pt-32 pb-20 bg-background min-h-screen text-foreground">

            {/* Header */}
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16 mt-8">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-accent uppercase tracking-[0.3em] text-xs mb-4 block"
                >
                    Culinary Excellence
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-serif text-white mb-6"
                >
                    Restaurants & Bars
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Savor exquisite culinary creations in atmospheres designed to stimulate all your senses. From fine dining to casual bites.
                </motion.p>
            </div>

            {/* Featured Image Section */}
            <div className="container mx-auto px-6 lg:px-12 mb-32">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[600px] rounded-lg overflow-hidden group"
                    >
                        <img
                            src="https://res.cloudinary.com/duweg8kpv/image/upload/v1772119962/d5_okuxgh.jpg"
                            alt="Fine Dining"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif mb-6 text-white">The Fine Dining Room</h2>
                        <div className="w-12 h-px bg-accent mb-6" />
                        <p className="text-gray-400 font-light leading-relaxed mb-6">
                            Our signature restaurant offers a journey through Contemporary Italian cuisine artfully prepared with locally-sourced, seasonal ingredients. Curated by Chef Antonio Rossi, the tasting menu is an unforgettable culinary adventure.
                        </p>
                        <p className="text-gray-400 font-light leading-relaxed mb-8 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-accent mr-3" />
                            Open daily from 6:00 PM to 11:00 PM.
                        </p>
                        <button className="border border-accent text-accent px-8 py-3 uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-colors">
                            Reserve a Table
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Food Menu Chart */}
            <div className="container mx-auto px-6 lg:px-12 mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">A La Carte Menu</h2>
                    <div className="w-16 h-px bg-accent mx-auto" />
                </div>

                <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
                    {meals.map((meal, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="flex justify-between items-baseline mb-2 border-b border-white/10 pb-2 group-hover:border-accent/50 transition-colors">
                                <h3 className="text-xl font-serif text-white tracking-wide group-hover:text-accent transition-colors">
                                    {meal.name}
                                </h3>
                                <span className="text-accent font-light">{meal.price}</span>
                            </div>
                            <p className="text-gray-400 font-light text-sm italic mb-2">
                                {meal.description}
                            </p>
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                                {meal.category}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Experience Cards */}
            <div className="container mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-8 mt-32">
                {[
                    { icon: Coffee, title: "Breakfast Buffet", desc: "Start your day with culinary delights." },
                    { icon: UtensilsCrossed, title: "Private Dining", desc: "Exclusive spaces for special moments." },
                    { icon: Wine, title: "Lounge Bar", desc: "Craft cocktails and premium spirits." }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + (idx * 0.1) }}
                        className="bg-white/5 p-8 text-center border border-white/5 hover:border-accent/30 transition-colors"
                    >
                        <item.icon className="w-10 h-10 text-accent mx-auto mb-6" strokeWidth={1} />
                        <h4 className="text-lg font-serif text-white mb-3">{item.title}</h4>
                        <p className="text-gray-400 font-light text-sm">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

        </div>
    );
}
