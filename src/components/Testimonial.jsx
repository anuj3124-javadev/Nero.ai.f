import { Quote, Star } from "lucide-react";
import React from "react";

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Ankit Sharma",
      title: "Content Strategist, Fluid AI",
      content: "Nero AI has fundamentally transformed our creative pipeline. The precision of the healing tools and the depth of the neural chat is simply unmatched.",
      rating: 5,
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Saurav Kumar",
      title: "Senior Developer Advocate",
      content: "The API response speed and the clean, intuitive interface make Nero AI an absolute joy to work with. It's the professional AI suite we've been waiting for.",
      rating: 5,
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: "Priya Varma",
      title: "Technical Writer & Educator",
      content: "As someone who writes 5000+ words daily, the Writing Studio has become my primary co-pilot. The semantic coherence it offers is truly professional-grade.",
      rating: 5,
    },
  ];

  return (
    <div className="px-6 sm:px-20 xl:px-32 py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-400/5 border border-indigo-500/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Global Recognition</span>
           </div>
          <h2 className="text-gray-900 dark:text-white text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Trusted by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Next Generation</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg leading-relaxed font-medium">
             Discover why industry leaders rely on Nero AI to drive their creative and professional excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {dummyTestimonialData.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-10 rounded-[3rem] bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800/80 transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/30 hover:-translate-y-2 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Quote className="w-20 h-20 text-indigo-600 rotate-180" />
              </div>

              <div className="flex items-center gap-1 mb-6">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 dark:text-gray-800"
                      }`}
                    />
                  ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed italic font-medium mb-10 relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-50 dark:border-gray-800 pt-8 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-600 blur-[8px] opacity-0 group-hover:opacity-40 transition-opacity rounded-full" />
                  <img
                    src={testimonial.image}
                    className="relative w-14 h-14 object-cover rounded-2xl border-2 border-white dark:border-gray-800 shadow-md group-hover:scale-110 transition-transform duration-500"
                    alt={testimonial.name}
                  />
                </div>
                <div>
                  <h3 className="text-base font-black dark:text-white tracking-tight">{testimonial.name}</h3>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest mt-0.5">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
