import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const cvHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>James Ortega - CV</title>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header>
      <h1>James Ortega</h1>
      <h2>IT Support Specialist & AI Systems Engineer</h2>
      <p class="subtitle">Specializing in Agentic Workflows, Multimodal Applications & Constructive AI</p>
      <div class="contact">
        <span>📍 Tallahassee, FL</span>
        <span>✉️ rlocone+jobs@gmail.com</span>
        <span>🌐 port0.abacusai.app</span>
      </div>
    </header>

    <!-- Professional Summary -->
    <section>
      <h3>Professional Summary</h3>
      <p>Systems-oriented engineer specializing in the architecture and deployment of agentic AI workflows, multimodal applications, and high-utility data platforms. Expert in "Constructive AI"—developing production-ready systems that prioritize token efficiency, automated evaluation, and domain-specific accuracy in Cybersecurity and Medical Research. Proven track record of managing the full product lifecycle from rapid prototyping on Abacus.AI to version-controlled production environments.</p>
      <p>With over 30 years of hands-on experience in Linux administration, network security, and hardware deployment. Expert in virtualization (Proxmox/LXC) and secure network architecture, with a strong commitment to open-source transparency and modern privacy hygiene. CompTIA A+ certified.</p>
    </section>

    <!-- AI & Engineering Skills -->
    <section>
      <h3>AI & Engineering Skills</h3>
      <div class="skills-grid">
        <div class="skill-box">
          <h4>🤖 AI Orchestration</h4>
          <p>Agentic Workflows • Planner/Researcher/Synthesizer • Tool/Function Calling • Multimodality (Text/Image/Sound)</p>
        </div>
        <div class="skill-box">
          <h4>⚙️ Operations & DevOps</h4>
          <p>Token Analytics • Model Routing Optimization • GitHub Sync/Mirroring • Automated Logging/Auditing</p>
        </div>
        <div class="skill-box">
          <h4>🛡️ Quality & Security</h4>
          <p>Weekly QA Testing • Vulnerability Assessment • Hallucination Checks • Deduplication Logic</p>
        </div>
        <div class="skill-box">
          <h4>📊 Web & Data</h4>
          <p>Link Analytics • Content Aggregation • Scheduled Reporting • Gateway Architecture</p>
        </div>
      </div>
    </section>

    <!-- Selected AI Productions -->
    <section>
      <h3>Selected AI Productions</h3>
      
      <div class="project">
        <div class="project-header">
          <strong>Mission Control</strong> — Agentic Research Console
          <span class="project-link">rose.abacusai.app</span>
        </div>
        <ul>
          <li>Engineered a sophisticated agentic environment for deep-dive research in Cybersecurity, Medical Research, and AI.</li>
          <li>Designed custom multi-step pipelines (Planner → Researcher → Synthesizer) with integrated tool/function calling for structured investigations.</li>
          <li>Optimized for "Least Token" usage: built analytics to route tasks to the fastest/most efficient model for the specific task.</li>
          <li>Implemented advanced logging, auditing, and weekly QA cycles with vulnerability testing.</li>
          <li>Developed deduplication and information consolidation logic to enhance report clarity.</li>
          <li>Automated scheduled email reports; maintained engineering rigor via one-way code sync to GitHub (repo: mission_control).</li>
        </ul>
      </div>

      <div class="project">
        <div class="project-header">
          <strong>Port0</strong> — Central AI Gateway
          <span class="project-link">port0.abacusai.app</span>
        </div>
        <ul>
          <li>Architected a centralized hub and "front door" for a suite of AI-enabled properties, unifying disparate tools into a cohesive user journey.</li>
          <li>Designed for extensibility, allowing rapid integration of new AI experiments and production utilities.</li>
        </ul>
      </div>

      <div class="projects-grid">
        <div class="project-small">
          <strong>Imzadi</strong> — imzadi.love<br>
          <em>Multimodal Storytelling & AI Tooling</em><br>
          Creative platform integrating Text + Image + Sound for immersive, AI-assisted narrative experiences.
        </div>
        <div class="project-small">
          <strong>Phipi.io</strong> — phipi.io<br>
          <em>Analytics-Driven Link Utility</em><br>
          High-performance link shortener with integrated telemetry and clickstream analytics.
        </div>
        <div class="project-small">
          <strong>Phipi.me</strong> — phipi.me<br>
          <em>Technical Content Intelligence</em><br>
          Selective aggregator for high-signal technical content with AI-powered summarization.
        </div>
      </div>
    </section>

    <!-- Core Technical Skills -->
    <section>
      <h3>Core Technical Skills</h3>
      <div class="skills-grid">
        <div class="skill-box">
          <h4>💻 Operating Systems</h4>
          <p>Linux (Fedora, Ubuntu, Debian, Arch, Red Hat) • macOS (Daily Driver) • Windows 11</p>
        </div>
        <div class="skill-box">
          <h4>🌐 Networking & Security</h4>
          <p>VLAN Implementation • Firewall Admin • Ubiquiti UniFi • Structured Cabling • VPNs (Tailscale)</p>
        </div>
        <div class="skill-box">
          <h4>🖥️ Virtualization & Cloud</h4>
          <p>Proxmox VE • LXC Containers • VM Management • Home Lab Architecture</p>
        </div>
        <div class="skill-box">
          <h4>📡 Monitoring & Tools</h4>
          <p>Zabbix • Uptime Kuma • Warp Terminal • SSH Key Management</p>
        </div>
        <div class="skill-box full-width">
          <h4>🔐 Privacy & Compliance</h4>
          <p>Email/Domain Segregation • ProtonMail • Signal • Bitwarden/ProtonPass • Data Privacy Best Practices • MFA Implementation • Yubikeys • PassKeys</p>
        </div>
      </div>
    </section>

    <!-- Mobile Platforms -->
    <section>
      <h3>Mobile Platforms & Security Profile</h3>
      <div class="mobile-grid">
        <div class="mobile-box">
          <h4>📱 Android Ecosystem (2010 – Present)</h4>
          <ul>
            <li><strong>Extensive OS Experience:</strong> Over 14 years with Android, from legacy to Canary builds.</li>
            <li><strong>AOSP & Custom ROMs:</strong> Expert in LineageOS, GrapheneOS for enhanced privacy.</li>
            <li><strong>Technical Tooling:</strong> Advanced ADB for device management and troubleshooting.</li>
            <li><strong>Security & Pentesting:</strong> Kali NetHunter for mobile security auditing.</li>
          </ul>
        </div>
        <div class="mobile-box">
          <h4>🍎 iOS Ecosystem (2019 – Present)</h4>
          <ul>
            <li><strong>Platform Migration:</strong> iOS as daily driver with cross-platform workflow.</li>
            <li><strong>Device Management:</strong> DFU mode, Apple Configurator for device provisioning.</li>
          </ul>
          <h4 style="margin-top: 15px;">🔍 Specialized Mobile Skills</h4>
          <ul>
            <li><strong>Wireless Reconnaissance:</strong> Wi-Fi surveying, Bluetooth LE discovery.</li>
            <li><strong>Hybrid Workflow:</strong> Dual-device strategy leveraging iOS security + Android flexibility.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Professional Experience -->
    <section>
      <h3>Professional Experience</h3>
      
      <div class="experience">
        <div class="exp-header">
          <strong>Wireless Support Technician</strong> — Startup Wireless Solutions Provider
          <span>Contract | Wilmington, NC | 2004</span>
        </div>
        <ul>
          <li>Provided technical support for wireless ISP division utilizing Fedora Core 1 systems.</li>
          <li>Monitored network health and access point performance using Zabbix.</li>
          <li>Troubleshot client connectivity issues in a high-growth startup environment.</li>
        </ul>
      </div>

      <div class="experience">
        <div class="exp-header">
          <strong>Network Security Lead</strong> — Community & Church Organizations
          <span>Volunteer/Pro-Bono | Various | 2001 – Present</span>
        </div>
        <ul>
          <li>Designed and deployed open-source firewall solutions (Smoothwall, Endian) to secure organizational data.</li>
          <li>Implemented content filtering, intrusion detection, and secure remote access for non-technical users.</li>
          <li>Provided ongoing IT maintenance and hardware troubleshooting for local community groups.</li>
        </ul>
      </div>
    </section>

    <!-- Key Projects -->
    <section>
      <h3>Key Projects & Technical Achievements</h3>
      
      <div class="project">
        <div class="project-header"><strong>Secure Remote Infrastructure Deployment</strong> — Pandemic Initiative</div>
        <ul>
          <li>Engineered a "rock-solid" secure home network to meet state agency public-facing security requirements.</li>
          <li>Managed multi-thousand dollar upgrade of Ubiquiti networking gear with professional structured Ethernet wiring.</li>
          <li>Implemented logical network segmentation via VLANs to isolate work traffic from personal and guest devices.</li>
        </ul>
      </div>

      <div class="project">
        <div class="project-header"><strong>Advanced Homelab Management</strong> — Proxmox Environment</div>
        <ul>
          <li>Architected Proxmox-based virtualization environment: 2x Database servers, Web server, Uptime Kuma monitoring, Tailscale mesh.</li>
          <li>Maintains Windows 11 23H2 VM and various Linux distros (Arch, Fedora) for OS-agnostic proficiency.</li>
          <li>Utilizes Warp Terminal for streamlined interaction with LXC and VM instances.</li>
        </ul>
      </div>

      <div class="project">
        <div class="project-header"><strong>Digital Identity & Privacy Architecture</strong></div>
        <ul>
          <li>Developed domain-segregation strategy to phase out legacy providers (Gmail) in favor of custom domain-based email.</li>
          <li>Migrated communications to ProtonMail and Signal for end-to-end encryption.</li>
          <li>Manages centralized security repository for SSH keys, configurations, and sensitive notes using encrypted password management.</li>
        </ul>
      </div>
    </section>

    <!-- Education -->
    <section>
      <h3>Education & Certifications</h3>
      <div class="edu-grid">
        <div class="edu-box">
          <strong>🏆 CompTIA A+ Certified</strong><br>
          Certification ID: COMP001001154143<br>
          <em>2003</em>
        </div>
        <div class="edu-box">
          <strong>🎓 Network Administration Diploma</strong><br>
          Core Focus: Red Hat Linux 2.1 Administration<br>
          <em>Technical School | 2002</em>
        </div>
      </div>
    </section>

    <!-- Community -->
    <section>
      <h3>Community Involvement</h3>
      <div class="community-grid">
        <div class="community-box">
          <strong>🛡️ Privacy Advocate</strong><br>
          Regularly consults with peers and the public on digital hygiene, open-source benefits, and online security.
        </div>
        <div class="community-box">
          <strong>💻 Open Source Contributor</strong><br>
          Actively engages with GitHub projects to maintain and expand Linux systems knowledge.<br>
          <a href="https://github.com/rlocone">github.com/rlocone</a>
        </div>
      </div>
    </section>

    <footer>
      <p>Generated from port0.abacusai.app/resume</p>
    </footer>
  </div>
</body>
</html>
`;

const cvCss = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 10pt;
    line-height: 1.5;
    color: #1a1a2e;
    background: #ffffff;
  }
  
  .container {
    max-width: 100%;
    padding: 30px 40px;
  }
  
  header {
    text-align: center;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 2px solid #7c3aed;
  }
  
  header h1 {
    font-size: 28pt;
    font-weight: 300;
    color: #1a1a2e;
    margin-bottom: 5px;
  }
  
  header h2 {
    font-size: 14pt;
    font-weight: 400;
    color: #7c3aed;
    margin-bottom: 3px;
  }
  
  header .subtitle {
    font-size: 10pt;
    color: #06b6d4;
    margin-bottom: 10px;
  }
  
  header .contact {
    display: flex;
    justify-content: center;
    gap: 25px;
    font-size: 9pt;
    color: #4b5563;
  }
  
  section {
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 13pt;
    font-weight: 600;
    color: #7c3aed;
    margin-bottom: 12px;
    padding-bottom: 5px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  h4 {
    font-size: 10pt;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 5px;
  }
  
  p {
    margin-bottom: 8px;
    text-align: justify;
  }
  
  ul {
    margin-left: 20px;
    margin-bottom: 10px;
  }
  
  li {
    margin-bottom: 4px;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .skill-box {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 6px;
    border-left: 3px solid #7c3aed;
  }
  
  .skill-box.full-width {
    grid-column: span 2;
  }
  
  .skill-box h4 {
    color: #7c3aed;
  }
  
  .skill-box p {
    font-size: 9pt;
    margin-bottom: 0;
  }
  
  .project {
    margin-bottom: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #06b6d4;
  }
  
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .project-link {
    font-size: 9pt;
    color: #06b6d4;
  }
  
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 15px;
  }
  
  .project-small {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 6px;
    font-size: 9pt;
    border-left: 3px solid #7c3aed;
  }
  
  .project-small strong {
    color: #1a1a2e;
  }
  
  .project-small em {
    color: #7c3aed;
    font-size: 8pt;
  }
  
  .mobile-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .mobile-box {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 6px;
    border-left: 3px solid #22c55e;
  }
  
  .mobile-box:last-child {
    border-left-color: #7c3aed;
  }
  
  .mobile-box h4 {
    margin-bottom: 10px;
  }
  
  .mobile-box ul {
    margin-left: 15px;
    font-size: 9pt;
  }
  
  .experience {
    margin-bottom: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #06b6d4;
  }
  
  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .exp-header span {
    font-size: 9pt;
    color: #4b5563;
  }
  
  .edu-grid, .community-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .edu-box, .community-box {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 6px;
    border-left: 3px solid #7c3aed;
  }
  
  .edu-box em, .community-box em {
    font-size: 9pt;
    color: #4b5563;
  }
  
  .community-box a {
    color: #06b6d4;
    text-decoration: none;
  }
  
  footer {
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 8pt;
    color: #9ca3af;
  }
  
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

export async function GET() {
  try {
    // Step 1: Create the PDF generation request
    const createResponse = await fetch('https://apps.abacus.ai/api/createConvertHtmlToPdfRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        html_content: cvHtml,
        pdf_options: { 
          format: 'A4',
          margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
          print_background: true
        },
        css_stylesheet: cvCss,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json().catch(() => ({ error: 'Failed to create PDF request' }));
      return NextResponse.json({ success: false, error: error.error }, { status: 500 });
    }

    const { request_id } = await createResponse.json();
    if (!request_id) {
      return NextResponse.json({ success: false, error: 'No request ID returned' }, { status: 500 });
    }

    // Step 2: Poll for status until completion
    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusResponse = await fetch('https://apps.abacus.ai/api/getConvertHtmlToPdfStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_id: request_id, deployment_token: process.env.ABACUSAI_API_KEY }),
      });

      const statusResult = await statusResponse.json();
      const status = statusResult?.status || 'FAILED';
      const result = statusResult?.result || null;

      if (status === 'SUCCESS') {
        if (result && result.result) {
          const pdfBuffer = Buffer.from(result.result, 'base64');
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="James_Ortega_CV.pdf"',
            },
          });
        } else {
          return NextResponse.json({ success: false, error: 'PDF generation completed but no result data' }, { status: 500 });
        }
      } else if (status === 'FAILED') {
        const errorMsg = result?.error || 'PDF generation failed';
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
      }
      attempts++;
    }

    return NextResponse.json({ success: false, error: 'PDF generation timed out' }, { status: 500 });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate PDF' }, { status: 500 });
  }
}
