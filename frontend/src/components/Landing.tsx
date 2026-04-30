import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Shield, 
  ArrowRight, 
  Zap, 
  Lock, 
  Cpu, 
  Users, 
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[60] transition-all duration-500 ${isScrolled ? 'py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img src="/logo.png" alt="GigCredit Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500" />
          <span className="text-2xl font-display font-bold tracking-tighter text-white">
            Gig<span className="text-cyan-400">Credit</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Process', 'Features', 'Impact', 'Docs'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-colors">
              {item}
            </a>
          ))}
          <button className="btn-primary">
            Launch App <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-slate-950 border-b border-white/10 p-8 md:hidden shadow-2xl"
        >
          <div className="flex flex-col gap-6">
            {['Process', 'Features', 'Impact', 'Docs'].map((item) => (
              <a key={item} href="#" className="text-xl font-display font-bold text-slate-200" onClick={() => setMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
            <button className="btn-primary w-full py-4 text-lg">Launch App</button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-[0.2em] mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Privacy-First Credit Protocol
          </span>
          
          <h1 className="text-6xl md:text-[7.5rem] font-display font-black tracking-tightest mb-10 leading-[0.9] text-white">
            Your Work is Your <br />
            <span className="text-gradient">Credit History</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-400 mb-14 leading-relaxed font-medium">
            GigCredit converts your platform activity into a verifiable, portable credit score. Unlock formal loans and banking services with your work, not your paperwork.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="btn-primary text-xl px-12 py-5 w-full sm:w-auto shadow-2xl shadow-cyan-500/20">
              Calculate Your GigScore
            </button>
            <button className="btn-secondary text-xl px-12 py-5 w-full sm:w-auto">
              Read the Whitepaper
            </button>
          </div>
        </motion.div>

        <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { label: 'Gig Workforce in India', value: '150M+', icon: Users, color: 'text-cyan-400' },
            { label: 'Interest Rate Reduction', value: '70%', icon: Zap, color: 'text-yellow-400' },
            { label: 'Data Privacy Guard', value: 'ZK-Engine', icon: Lock, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card p-10 group text-left border-l-4 border-l-transparent hover:border-l-cyan-500 transition-all duration-500"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mb-6 group-hover:scale-110 transition-transform`} />
              <div className="text-5xl font-display font-black mb-2 text-white">{stat.value}</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const steps = [
    {
      title: "Data Ingestion",
      description: "Drop your UPI or platform statements. Our local engine parses data privately without any server uploads.",
      icon: <Users className="w-8 h-8" />,
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "AI Analysis",
      description: "Proprietary ML models compute your GigScore based on 50+ behavioral and consistency metrics.",
      icon: <Cpu className="w-8 h-8" />,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "ZK-Proof Minting",
      description: "Generate a cryptographic attestation on Polygon. Prove creditworthiness without revealing transactions.",
      icon: <Shield className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section id="process" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-display font-black mb-8 leading-tight text-white">Simple. Secure. <span className="text-cyan-400">Instant.</span></h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">From invisible gig worker to bank-verified borrower in under 5 minutes.</p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-24 h-24 rounded-3xl bg-slate-950 border border-white/10 flex items-center justify-center mb-10 relative shadow-2xl group-hover:border-cyan-500/50 transition-all duration-700`}>
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                  <div className="text-cyan-400 group-hover:scale-110 transition-transform duration-700">{step.icon}</div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-xl">
                    0{i + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold mb-6 text-white">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg font-medium">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature, i }: { feature: any; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.1 }}
    className="glass-card p-12 flex flex-col h-full group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-[1px] mb-10 relative z-10`}>
      <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
        <feature.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-700" />
      </div>
    </div>
    <h3 className="text-3xl font-display font-bold mb-6 group-hover:text-cyan-400 transition-colors relative z-10 text-white">{feature.title}</h3>
    <p className="text-slate-400 leading-relaxed text-xl relative z-10 font-medium">{feature.description}</p>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      title: "Privacy First",
      description: "We never store raw statements. Our ZK-engine generates an attestation of income while keeping source data on your local device.",
      icon: Lock,
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "AI-Behavioral Scoring",
      description: "Proprietary ML models analyze consistency, platform tenure, and activity volume to compute a score that banks actually trust.",
      icon: Cpu,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "On-Chain Identity",
      description: "Your credit score is minted as a portable identity on Polygon, enabling instant verification by any global financial partner.",
      icon: CheckCircle2,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-display font-black mb-10 leading-tight text-white">
              Built for the <br />
              <span className="text-cyan-400 italic">Invisible</span> Workforce
            </h2>
            <p className="text-2xl text-slate-400 font-medium leading-relaxed">GigCredit is bridging the gap between gig economy activity and formal financial credit.</p>
          </div>
          <button className="flex items-center gap-3 text-cyan-400 font-black tracking-widest uppercase text-sm group bg-cyan-500/5 px-8 py-4 rounded-full border border-cyan-500/20 hover:bg-cyan-500/10 transition-all">
            Explore Protocol <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ComparisonSection = () => {
  return (
    <section id="impact" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card p-12 md:p-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-500/5 blur-[120px] -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl font-display font-bold mb-12 leading-tight text-white">The <span className="text-cyan-400">GigCredit</span> Advantage</h2>
              <p className="text-2xl text-slate-400 mb-16 leading-relaxed font-medium">
                Bridge the gap between your digital labor and formal banking. Unlock capital that was previously out of reach.
              </p>
              
              <div className="space-y-10">
                {[
                  "Eliminate predatory 48%+ informal interest",
                  "100% portable on-chain credit identity",
                  "Privacy-preserving ZK verification engine",
                  "Unlock housing, education, and business capital"
                ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex items-center gap-6 text-xl font-bold text-slate-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                    </div>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-8">
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="bg-red-500/5 border border-red-500/10 p-12 rounded-[2rem] text-center relative group overflow-hidden"
                >
                  <div className="text-slate-500 text-xs font-black uppercase mb-6 tracking-[0.3em] relative z-10">Market Average</div>
                  <div className="text-7xl font-display font-black text-red-500 relative z-10 tracking-tighter">48%</div>
                  <div className="text-slate-500 mt-6 text-sm font-bold relative z-10">Informal Loans</div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="bg-cyan-500/10 border border-cyan-500/20 p-12 rounded-[2rem] text-center relative group overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)]"
                >
                  <div className="text-cyan-400 text-xs font-black uppercase mb-6 tracking-[0.3em] relative z-10">With GigScore</div>
                  <div className="text-7xl font-display font-black text-white relative z-10 tracking-tighter">14%</div>
                  <div className="text-slate-400 mt-6 text-sm font-bold relative z-10">Target Bank Rate</div>
                </motion.div>
              </div>
              <div className="mt-10 glass p-12 rounded-[2rem] relative overflow-hidden group border border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-2xl font-display font-bold text-white tracking-tight">Annual Financial Impact</div>
                  <ArrowUpRight className="text-cyan-400 w-10 h-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                </div>
                <div className="text-6xl font-display font-black text-white mb-4 tracking-tighter">₹1.25 Lakhs</div>
                <div className="text-slate-500 text-xl font-bold">Projected savings for Swiggy partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-16 md:p-32 relative overflow-hidden group border border-white/10"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <h2 className="text-6xl md:text-8xl font-display font-black mb-12 leading-[0.9] text-white">
            Claim Your <br />
            <span className="text-gradient">Identity.</span>
          </h2>
          <p className="text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium">
            Join 50,000+ gig workers who are already building their financial future with GigCredit.
          </p>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
            <button className="btn-primary text-2xl px-16 py-6 w-full lg:w-auto shadow-3xl shadow-cyan-500/30">
              Start Your Evaluation
            </button>
            <button className="text-white text-xl font-black flex items-center gap-4 hover:text-cyan-400 transition-colors uppercase tracking-widest">
              View Sample Proof <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-32 border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer">
              <img src="/logo.png" alt="GigCredit Logo" className="w-12 h-12 object-contain group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-4xl font-display font-black tracking-tighter text-white">GigCredit</span>
            </div>
            <p className="text-slate-400 max-w-md text-2xl leading-relaxed font-medium">
              Empowering the world's gig workforce with cryptographically secure financial identities.
            </p>
          </div>
          <div>
            <h4 className="text-white font-black mb-10 text-xl uppercase tracking-widest">Protocol</h4>
            <ul className="space-y-6 text-slate-400 text-xl font-medium">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Explorer</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">GigScore AI</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">ZK Engine</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Audit</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-10 text-xl uppercase tracking-widest">Company</h4>
            <ul className="space-y-6 text-slate-400 text-xl font-medium">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Whitepaper</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-16 border-t border-white/5 text-slate-500 text-xs font-black tracking-[0.4em] uppercase">
          <p>© 2024 GigCredit Protocol. All rights reserved.</p>
          <div className="flex items-center gap-12">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 origin-left z-[100]"
        style={{ scaleX }}
      />
      <div className="noise" />
      <Navbar />
      <Hero />
      <Process />
      <Features />
      <ComparisonSection />
      <CTA />
      <Footer />
    </div>
  );
}
