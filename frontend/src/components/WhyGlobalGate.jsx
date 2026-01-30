import { CheckCircle2, Users, Laptop, BookOpen, Target, Award, Globe, Clock, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function WhyGlobalGate() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      icon: <Users className="w-10 h-10" />,
      title: "Expert Sri Lankan Tutors",
      desc: "Hand-picked instructors with international certifications (CELTA/DELTA) and proven success in preparing students for global opportunities",
    },
    {
      icon: <Laptop className="w-10 h-10" />,
      title: "Live Interactive Classes",
      desc: "Small batch sizes (max 8 students) ensuring personalized attention and maximum speaking time for each student",
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Structured Learning Path",
      desc: "Custom-designed curriculum focused on practical communication skills, from beginner to advanced proficiency levels",
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Exam Preparation Focus",
      desc: "Specialized IELTS, OET, and Cambridge exam preparation taught by instructors with proven track records",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Affordable Excellence",
      desc: "Premium quality education at Sri Lankan-friendly pricing, making global-standard English accessible to all",
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: "Flexible Scheduling",
      desc: "Classes designed around Sri Lankan schedules with options for working professionals, university students, and school leavers",
    },
  ];

  
  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
              The Sri Lankan Difference
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Global Gate</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A homegrown institute with global aspirations. We combine Sri Lankan educational excellence with international standards to prepare you for worldwide opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`
                relative h-full bg-white rounded-2xl p-8 transition-all duration-500
                border border-slate-200 hover:border-blue-300
                hover:shadow-2xl hover:shadow-blue-100/50
                ${hoveredIndex === index ? 'transform -translate-y-2' : 'shadow-lg'}
              `}>
                
                {/* Icon Container */}
                <div className={`
                  inline-flex p-4 rounded-xl mb-6 transition-all duration-500
                  ${hoveredIndex === index 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'bg-blue-50 text-blue-600'
                  }
                `}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {feature.desc}
                </p>

                {/* Sri Lankan Badge - Hidden by default, shows on hover */}
                <div className={`
                  absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                  transition-all duration-500
                  ${hoveredIndex === index 
                    ? 'opacity-100 bg-green-50 text-green-700 border border-green-200' 
                    : 'opacity-0'
                  }
                `}>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Sri Lankan Excellence
                </div>

                {/* Decorative Line */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-blue-500 to-indigo-500
                  transition-all duration-500
                  ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                `}></div>
              </div>
            </div>
          ))}
        </div>

        

       
      </div>
    </section>
  );
}