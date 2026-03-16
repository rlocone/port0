'use client';

import { motion } from 'framer-motion';
import { 
  FileText, Download, Briefcase, GraduationCap, Sparkles, ArrowLeft,
  MapPin, Mail, Globe, Shield, Server, Network, Monitor, Lock,
  Award, Users, Github, Terminal, Cpu, HardDrive, Key, ExternalLink,
  Smartphone, Wifi, Bluetooth, Bug, Settings, Layers,
  Bot, Workflow, BarChart3, Link2, BookOpen, Compass, Zap, Brain
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ResumePage() {
  return (
    <main className="min-h-screen relative z-10">
      {/* Header */}
      <header className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pb-12 space-y-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-8 glow-purple text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border-2 border-purple-500/50 shadow-lg shadow-purple-500/20">
              <span className="text-4xl font-light gradient-text">JO</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light text-white mb-2">James Ortega</h1>
          <h2 className="text-xl text-purple-300 mb-2">IT Support Specialist & AI Systems Engineer</h2>
          <p className="text-sm text-cyan-300 mb-4">Specializing in Agentic Workflows, Multimodal Applications & Constructive AI</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 mb-6">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Tallahassee, FL
            </span>
            <a 
              href="mailto:rlocone+jobs@gmail.com" 
              className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              rlocone+jobs@gmail.com
            </a>
            <Link 
              href="/"
              className="inline-flex items-center gap-1 hover:text-purple-400 transition-colors"
            >
              <Globe className="w-4 h-4 text-purple-400" />
              Portal 0 | Dashboard
            </Link>
          </div>

          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Systems-oriented engineer specializing in the architecture and deployment of <span className="text-cyan-400 font-medium">agentic AI workflows</span>, 
            multimodal applications, and high-utility data platforms. Expert in <span className="text-purple-400 font-medium">"Constructive AI"</span>—developing 
            production-ready systems that prioritize token efficiency, automated evaluation, and domain-specific accuracy in Cybersecurity and Medical Research.
          </p>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            With over <span className="text-cyan-400 font-medium">30 years</span> of hands-on experience in Linux administration, network security, and hardware deployment, 
            combined with a proven track record managing the full AI product lifecycle from rapid prototyping on Abacus.AI to version-controlled production environments. 
            <span className="text-purple-400 font-medium"> CompTIA A+ certified</span>.
          </p>
        </motion.div>

        {/* AI & Engineering Skills */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-light text-white mb-6 flex items-center gap-3"
          >
            <Brain className="w-6 h-6 text-purple-400" />
            AI & Engineering Skills
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glow-purple glass-hover">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-purple-300">AI Orchestration</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Agentic Workflows', 'Planner/Researcher/Synthesizer', 'Tool/Function Calling', 'Multimodality (Text/Image/Sound)'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glow-cyan glass-hover">
              <div className="flex items-center gap-3 mb-3">
                <Workflow className="w-5 h-5 text-cyan-400" />
                <h3 className="font-medium text-cyan-300">Operations & DevOps</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Token Analytics', 'Model Routing Optimization', 'GitHub Sync/Mirroring', 'Automated Logging/Auditing'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-purple-300">Quality & Security</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Weekly QA Testing', 'Vulnerability Assessment', 'Hallucination Checks', 'Deduplication Logic'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-medium text-cyan-300">Web & Data</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Link Analytics', 'Content Aggregation', 'Scheduled Reporting', 'Gateway Architecture'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Selected AI Productions */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-light text-white mb-6 flex items-center gap-3"
          >
            <Zap className="w-6 h-6 text-cyan-400" />
            Selected AI Productions
          </motion.h2>
          
          <div className="space-y-4">
            {/* Mission Control */}
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glow-purple glass-hover">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-purple-400" />
                    Mission Control
                  </h3>
                  <p className="text-purple-400">Agentic Research Console</p>
                </div>
                <a 
                  href="https://rose.abacusai.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2 md:mt-0"
                >
                  rose.abacusai.app
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Engineered a sophisticated agentic environment for deep-dive research in Cybersecurity, Medical Research, and AI.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Designed custom multi-step pipelines (Planner → Researcher → Synthesizer) with integrated tool/function calling.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Optimized for "Least Token" usage: built analytics to route tasks to the fastest/most efficient model.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Implemented advanced logging, auditing, and weekly QA cycles with vulnerability testing.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Maintained engineering rigor via one-way code sync to GitHub (repo: mission_control).
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Agentic AI', 'Multi-step Pipelines', 'Token Optimization', 'Cybersecurity', 'Medical Research'].map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Port0 */}
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glow-cyan glass-hover">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Port0
                  </h3>
                  <p className="text-cyan-400">Central AI Gateway</p>
                </div>
                <a 
                  href="https://port0.abacusai.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-2 md:mt-0"
                >
                  port0.abacusai.app
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  Architected a centralized hub and "front door" for a suite of AI-enabled properties, unifying disparate tools into a cohesive user journey.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  Designed for extensibility, allowing rapid integration of new AI experiments and production utilities.
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Gateway Architecture', 'AI Hub', 'Extensibility', 'User Experience'].map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Other AI Projects Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Imzadi */}
              <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h3 className="font-medium text-white">Imzadi</h3>
                </div>
                <p className="text-xs text-purple-300 mb-2">Multimodal Storytelling & AI Tooling</p>
                <p className="text-sm text-gray-400 mb-3">
                  Creative platform integrating Text + Image + Sound for immersive, AI-assisted narrative experiences with custom authoring tools.
                </p>
                <a 
                  href="https://imzadi.love" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  imzadi.love <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>

              {/* Phipi.io */}
              <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-medium text-white">Phipi.io</h3>
                </div>
                <p className="text-xs text-cyan-300 mb-2">Analytics-Driven Link Utility</p>
                <p className="text-sm text-gray-400 mb-3">
                  High-performance link shortener with integrated telemetry and clickstream analytics to track user engagement patterns.
                </p>
                <a 
                  href="https://phipi.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  phipi.io <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>

              {/* Phipi.me */}
              <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h3 className="font-medium text-white">Phipi.me</h3>
                </div>
                <p className="text-xs text-purple-300 mb-2">Technical Content Intelligence</p>
                <p className="text-sm text-gray-400 mb-3">
                  Selective aggregator for high-signal technical content with AI-powered summarization, tagging, and prioritization.
                </p>
                <a 
                  href="https://phipi.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  phipi.me <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Core Technical Skills */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-light text-white mb-6 flex items-center gap-3"
          >
            <Terminal className="w-6 h-6 text-cyan-400" />
            Core Technical Skills
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
              <div className="flex items-center gap-3 mb-3">
                <Monitor className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-purple-300">Operating Systems</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Linux (Fedora, Ubuntu, Debian, Arch, Red Hat)', 'macOS (Daily Driver)', 'Windows 11'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
              <div className="flex items-center gap-3 mb-3">
                <Network className="w-5 h-5 text-cyan-400" />
                <h3 className="font-medium text-cyan-300">Networking & Security</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['VLAN Implementation', 'Firewall Admin', 'Ubiquiti UniFi', 'Structured Cabling', 'VPNs (Tailscale)'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
              <div className="flex items-center gap-3 mb-3">
                <Server className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-purple-300">Virtualization & Cloud</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Proxmox VE', 'LXC Containers', 'VM Management', 'Home Lab Architecture'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover">
              <div className="flex items-center gap-3 mb-3">
                <HardDrive className="w-5 h-5 text-cyan-400" />
                <h3 className="font-medium text-cyan-300">Monitoring & Tools</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Zabbix', 'Uptime Kuma', 'Warp Terminal', 'SSH Key Management'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-5 glass-hover md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-purple-300">Privacy & Compliance</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Email/Domain Segregation', 'ProtonMail', 'Signal', 'Bitwarden/ProtonPass', 'Data Privacy Best Practices', 'MFA Implementation', 'Yubikeys', 'PassKeys'].map((skill) => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Mobile Platforms & Security Profile */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-light text-white mb-6 flex items-center gap-3"
          >
            <Smartphone className="w-6 h-6 text-purple-400" />
            Mobile Platforms & Security Profile
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Android Ecosystem */}
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glow-cyan glass-hover h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/30 to-cyan-500/30 flex items-center justify-center border border-green-500/30">
                  <Layers className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Android Ecosystem</h3>
                  <p className="text-xs text-cyan-300">2010 – Present</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-green-300 font-medium">Extensive OS Experience:</span> Over 14 years of hands-on experience with the Android ecosystem, ranging from legacy versions to the most recent Canary builds.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-green-300 font-medium">AOSP & Custom ROMs:</span> Expert-level proficiency in deploying and managing various AOSP-based distributions, including LineageOS and GrapheneOS, for enhanced privacy and performance.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-green-300 font-medium">Technical Tooling:</span> Advanced utilization of Android Debug Bridge (ADB) for device management, sideloading, and system-level troubleshooting.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-green-300 font-medium">Security & Pentesting:</span> Specialized in mobile security auditing using Kali NetHunter for on-the-go penetration testing, including Wi-Fi surveys and Bluetooth reconnaissance.
                  </div>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                {['AOSP', 'LineageOS', 'GrapheneOS', 'ADB', 'Kali NetHunter'].map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-200 border border-green-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* iOS Ecosystem */}
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glow-purple glass-hover h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-500/30">
                  <Settings className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">iOS Ecosystem</h3>
                  <p className="text-xs text-purple-300">2019 – Present</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-purple-300 font-medium">Platform Migration:</span> Successfully transitioned to iOS as a primary daily driver while maintaining a cross-platform workflow for specialized technical tasks.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-purple-300 font-medium">Device Management:</span> Proficient in advanced iPhone maintenance and recovery, including the use of DFU (Device Firmware Update) mode and Apple Configurator for flashing and provisioning devices.
                  </div>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                {['iOS', 'DFU Mode', 'Apple Configurator', 'Device Recovery'].map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Specialized Mobile Skills */}
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glass-hover md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Bug className="w-6 h-6 text-cyan-400" />
                <h3 className="font-medium text-white">Specialized Mobile Skills</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 font-medium text-sm">Wireless Reconnaissance</span>
                  </div>
                  <p className="text-sm text-gray-300">Active use of mobile platforms for environmental security analysis, specifically Wi-Fi signal surveying and Bluetooth LE discovery.</p>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Bluetooth className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 font-medium text-sm">Hybrid Workflow</span>
                  </div>
                  <p className="text-sm text-gray-300">Maintaining a dual-device strategy to leverage the security-hardened nature of iOS alongside the open-source flexibility and auditing power of Android.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Professional Experience */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-light text-white mb-6 flex items-center gap-3"
          >
            <Briefcase className="w-6 h-6 text-purple-400" />
            Professional Experience
          </motion.h2>
          
          <div className="space-y-4">
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glow-cyan glass-hover">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Wireless Support Technician</h3>
                  <p className="text-cyan-400">Startup Wireless Solutions Provider</p>
                </div>
                <div className="text-sm text-gray-400 mt-2 md:mt-0 md:text-right">
                  <p>Contract | Wilmington, NC</p>
                  <p className="text-cyan-300">2004</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  Provided technical support for a wireless ISP division utilizing Fedora Core 1 systems.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  Monitored network health and access point performance using Zabbix.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  Troubleshot client connectivity issues in a high-growth startup environment.
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glow-purple glass-hover">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Network Security Lead</h3>
                  <p className="text-purple-400">Community & Church Organizations</p>
                </div>
                <div className="text-sm text-gray-400 mt-2 md:mt-0 md:text-right">
                  <p>Volunteer/Pro-Bono | Various</p>
                  <p className="text-purple-300">2001 – Present</p>
                </div>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Designed and deployed open-source firewall solutions (Smoothwall and Endian) to secure organizational data.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Implemented content filtering, intrusion detection, and secure remote access for non-technical users.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Provided ongoing IT maintenance and hardware troubleshooting for local community groups.
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Key Projects */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-light text-white mb-6 flex items-center gap-3"
          >
            <Cpu className="w-6 h-6 text-cyan-400" />
            Key Projects & Technical Achievements
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glass-hover h-full">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
                <h3 className="font-medium text-white">Secure Remote Infrastructure</h3>
              </div>
              <p className="text-xs text-cyan-300 mb-3">Pandemic Initiative</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  Engineered a "rock-solid" secure home network to meet state agency public-facing security requirements.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  Managed a multi-thousand dollar upgrade of Ubiquiti networking gear, including professional structured Ethernet wiring.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  Implemented logical network segmentation via VLANs to isolate work traffic from personal and guest devices.
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glass-hover h-full">
              <div className="flex items-center gap-3 mb-4">
                <Server className="w-6 h-6 text-purple-400" />
                <h3 className="font-medium text-white">Advanced Homelab Management</h3>
              </div>
              <p className="text-xs text-purple-300 mb-3">Proxmox Environment</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Architected a Proxmox-based virtualization environment hosting: 2x Database servers, Web server, Uptime Kuma monitoring, and Tailscale mesh networking.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Maintains Windows 11 23H2 VM and various Linux distros (Arch, Fedora) to ensure OS-agnostic proficiency.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  Utilizes Warp Terminal for streamlined interaction with LXC and VM instances.
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glass-hover md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-6 h-6 text-cyan-400" />
                <h3 className="font-medium text-white">Digital Identity & Privacy Architecture</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-sm text-gray-300">Developed a domain-segregation strategy to phase out legacy providers (Gmail) in favor of custom domain-based email.</p>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-sm text-gray-300">Migrated primary communications to ProtonMail and Signal to ensure end-to-end encryption.</p>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-sm text-gray-300">Manages a centralized security repository for SSH keys, configurations, and sensitive notes using encrypted password management.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Education & Certifications */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-light text-white mb-6 flex items-center gap-3"
          >
            <GraduationCap className="w-6 h-6 text-purple-400" />
            Education & Certifications
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glow-purple glass-hover">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center border border-purple-500/30">
                  <Award className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">CompTIA A+ Certified</h3>
                  <p className="text-sm text-gray-400">Certification ID: COMP001001154143</p>
                  <p className="text-xs text-purple-300 mt-1">2003</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glow-cyan glass-hover">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/30">
                  <GraduationCap className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Network Administration Diploma</h3>
                  <p className="text-sm text-gray-400">Core Focus: Red Hat Linux 2.1 Administration</p>
                  <p className="text-xs text-cyan-300 mt-1">Technical School | 2002</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Community Involvement */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-2xl font-light text-white mb-6 flex items-center gap-3"
          >
            <Users className="w-6 h-6 text-cyan-400" />
            Community Involvement
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glass-hover">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-purple-300">Privacy Advocate</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Regularly consults with peers and the public on digital hygiene, open-source benefits, and online security.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="glass rounded-xl p-6 glass-hover">
              <div className="flex items-center gap-3 mb-4">
                <Github className="w-5 h-5 text-cyan-400" />
                <h3 className="font-medium text-cyan-300">Open Source Contributor</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Actively engages with GitHub projects to maintain and expand Linux systems knowledge.
              </p>
              <a 
                href="https://github.com/rlocone"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>View GitHub Profile</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-8"
        >
          <a
            href="/api/generate-cv-pdf"
            download="James_Ortega_CV.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white hover:border-purple-400/50 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF Version</span>
          </a>
          <p className="text-gray-500 text-xs mt-2">PDF generated dynamically with all current information</p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-gray-500 text-sm">
          Crafted with <span className="text-purple-400">♥</span> in the ethereal realm
        </p>
      </footer>
    </main>
  );
}
