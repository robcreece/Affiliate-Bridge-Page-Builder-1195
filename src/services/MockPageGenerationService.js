class MockPageGenerationService {
  constructor() {
    this.generationQueue = new Map();
    this.mockHostingDomain = 'https://bridge-pages.netlify.app';
  }

  // Validate all required inputs before generation
  validatePageData(bridgePageData) {
    const errors = [];
    
    // Required content fields
    if (!bridgePageData.headline?.trim()) {
      errors.push('Headline is required');
    }
    
    if (!bridgePageData.subheadline?.trim()) {
      errors.push('Subheadline is required');
    }
    
    if (!bridgePageData.bodyParagraphs?.some(p => p.trim())) {
      errors.push('At least one body paragraph is required');
    }
    
    if (!bridgePageData.ctaButtons?.some(cta => cta.trim())) {
      errors.push('At least one CTA button is required');
    }
    
    if (!bridgePageData.affiliateLink?.trim()) {
      errors.push('Affiliate link is required');
    }
    
    // Design requirements
    if (!bridgePageData.primaryColor) {
      errors.push('Primary color is required');
    }
    
    if (!bridgePageData.secondaryColor) {
      errors.push('Secondary color is required');
    }
    
    if (!bridgePageData.headingFont) {
      errors.push('Heading font is required');
    }
    
    if (!bridgePageData.bodyFont) {
      errors.push('Body font is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate complete HTML page with all content
  generateCompleteHTML(bridgePageData, pageId) {
    const enabledBonuses = bridgePageData.bonuses?.filter(bonus => bonus.enabled) || [];
    
    // Generate hero video HTML if enabled
    const heroVideoHTML = bridgePageData.heroVideo?.enabled && bridgePageData.heroVideo?.embed ? 
      `<div class="hero-video-container">
        <div class="video-wrapper">
          ${bridgePageData.heroVideo.embed}
        </div>
      </div>` : '';

    // Generate additional video HTML if present
    const additionalVideoHTML = bridgePageData.videoEmbed ? 
      `<div class="video-container">
        <div class="video-wrapper">
          ${bridgePageData.videoEmbed}
        </div>
      </div>` : '';

    // Generate bonuses section
    const bonusesHTML = enabledBonuses.length > 0 ? 
      `<div class="bonuses-section">
        <h2 class="bonuses-title">🎁 Exclusive Bonuses</h2>
        <div class="bonuses-grid">
          ${enabledBonuses.map(bonus => `
            <div class="bonus-item">
              <div class="bonus-icon">🎁</div>
              <div class="bonus-content">
                <h4>${this.escapeHtml(bonus.title)}</h4>
                <div class="bonus-type">${this.escapeHtml(bonus.type)}</div>
                <p>${this.escapeHtml(bonus.description)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : '';

    // Generate CTA buttons
    const ctaButtonsHTML = bridgePageData.ctaButtons
      .filter(cta => cta.trim())
      .map(cta => `
        <a href="${this.escapeHtml(bridgePageData.affiliateLink)}" class="cta-button" onclick="trackConversion('${pageId}', 'cta_click', '${this.escapeHtml(cta)}')">
          ${this.escapeHtml(cta)} →
        </a>
      `).join('');

    // Complete HTML template
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(bridgePageData.headline || 'Bridge Page')}</title>
    <meta name="description" content="${this.escapeHtml(bridgePageData.subheadline || 'High-converting bridge page')}">
    
    <!-- SEO Meta Tags -->
    <meta property="og:title" content="${this.escapeHtml(bridgePageData.headline)}">
    <meta property="og:description" content="${this.escapeHtml(bridgePageData.subheadline)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${this.mockHostingDomain}/${pageId}">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=${bridgePageData.headingFont.replace(' ', '+')}:wght@400;600;700&family=${bridgePageData.bodyFont.replace(' ', '+')}:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Analytics -->
    <script>
      // Mock analytics tracking
      function trackConversion(pageId, eventType, eventData) {
        console.log('Analytics:', { pageId, eventType, eventData, timestamp: Date.now() });
        
        // Store in localStorage for demo
        const analytics = JSON.parse(localStorage.getItem('bridgePageAnalytics') || '[]');
        analytics.push({
          pageId,
          eventType,
          eventData,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        });
        localStorage.setItem('bridgePageAnalytics', JSON.stringify(analytics));
      }
      
      // Track page view
      document.addEventListener('DOMContentLoaded', function() {
        trackConversion('${pageId}', 'page_view', {});
      });
    </script>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${bridgePageData.bodyFont}', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, ${bridgePageData.primaryColor}15 0%, ${bridgePageData.secondaryColor}15 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .headline {
            font-family: '${bridgePageData.headingFont}', sans-serif;
            font-size: 2.5rem;
            font-weight: 700;
            color: ${bridgePageData.primaryColor};
            margin-bottom: 20px;
            line-height: 1.2;
        }
        
        .subheadline {
            font-size: 1.25rem;
            color: ${bridgePageData.secondaryColor};
            margin-bottom: 30px;
            font-weight: 500;
        }
        
        .hero-video-container {
            margin: 30px 0;
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .video-wrapper {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .video-wrapper iframe,
        .video-wrapper video {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
        }
        
        .content {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }
        
        .paragraph {
            font-size: 1.1rem;
            margin-bottom: 25px;
            line-height: 1.8;
        }
        
        .video-container {
            margin: 40px 0;
            text-align: center;
        }
        
        .bonuses-section {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }
        
        .bonuses-title {
            font-family: '${bridgePageData.headingFont}', sans-serif;
            font-size: 2rem;
            color: ${bridgePageData.primaryColor};
            text-align: center;
            margin-bottom: 30px;
        }
        
        .bonuses-grid {
            display: grid;
            gap: 20px;
        }
        
        .bonus-item {
            display: flex;
            align-items: flex-start;
            padding: 20px;
            background: ${bridgePageData.primaryColor}10;
            border-radius: 10px;
            border-left: 4px solid ${bridgePageData.primaryColor};
        }
        
        .bonus-icon {
            width: 40px;
            height: 40px;
            background: ${bridgePageData.primaryColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
            font-size: 1.2rem;
        }
        
        .bonus-content h4 {
            font-family: '${bridgePageData.headingFont}', sans-serif;
            font-size: 1.2rem;
            color: ${bridgePageData.primaryColor};
            margin-bottom: 5px;
        }
        
        .bonus-type {
            font-size: 0.9rem;
            color: ${bridgePageData.secondaryColor};
            font-weight: 500;
            margin-bottom: 8px;
        }
        
        .cta-section {
            text-align: center;
            margin-top: 40px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, ${bridgePageData.primaryColor} 0%, ${bridgePageData.secondaryColor} 100%);
            color: white;
            padding: 18px 40px;
            font-size: 1.2rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: 50px;
            margin: 10px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .headline {
                font-size: 2rem;
            }
            
            .content,
            .bonuses-section {
                padding: 25px;
            }
            
            .container {
                padding: 20px 15px;
            }
            
            .hero-video-container {
                padding: 15px;
            }
            
            .cta-button {
                display: block;
                margin: 10px 0;
            }
        }
        
        /* Demo Banner */
        .demo-banner {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 14px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .demo-banner a {
            color: white;
            text-decoration: underline;
        }
        
        .container {
            margin-top: 60px;
        }
    </style>
</head>
<body>
    <div class="demo-banner">
        🚀 This is a demo bridge page created with Bridge Page Builder - 
        <a href="#" onclick="window.parent?.postMessage?.('close-preview', '*')">Create your own</a>
    </div>
    
    <div class="container">
        <div class="header">
            <h1 class="headline">${this.escapeHtml(bridgePageData.headline)}</h1>
            <p class="subheadline">${this.escapeHtml(bridgePageData.subheadline)}</p>
        </div>
        
        ${heroVideoHTML}
        
        <div class="content">
            ${bridgePageData.bodyParagraphs.map(paragraph => 
              `<p class="paragraph">${this.escapeHtml(paragraph)}</p>`
            ).join('')}
            
            ${additionalVideoHTML}
        </div>
        
        ${bonusesHTML}
        
        <div class="cta-section">
            ${ctaButtonsHTML}
        </div>
    </div>
    
    <script>
        // Demo functionality
        console.log('Bridge Page loaded successfully!');
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // CTA click tracking
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', function(e) {
                // In demo, prevent actual navigation
                if (this.href.includes('example.com') || this.href.includes('your-affiliate')) {
                    e.preventDefault();
                    alert('🎉 CTA clicked! In a real bridge page, this would redirect to your affiliate link.');
                }
            });
        });
    </script>
</body>
</html>`;
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Create and "host" the page (using blob URL for demo)
  async createAndHostPage(bridgePageData, pageId, userId) {
    try {
      // Update generation status
      this.updateGenerationStatus(pageId, 'validating');
      
      // Validate all required data
      const validation = this.validatePageData(bridgePageData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Simulate processing time
      await this.delay(800);
      
      this.updateGenerationStatus(pageId, 'generating');
      
      // Generate complete HTML
      const htmlContent = this.generateCompleteHTML(bridgePageData, pageId);
      
      await this.delay(1000);
      this.updateGenerationStatus(pageId, 'uploading');
      
      // Create blob URL for demo
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const pageUrl = URL.createObjectURL(blob);
      
      // Store the page data in localStorage for persistence
      const pageData = {
        id: pageId,
        userId,
        bridgePageData,
        htmlContent,
        pageUrl,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(`bridgePage_${pageId}`, JSON.stringify(pageData));
      
      await this.delay(600);
      this.updateGenerationStatus(pageId, 'configuring');
      
      await this.delay(400);
      this.updateGenerationStatus(pageId, 'testing');
      
      // Test the URL (blob URLs are always accessible)
      await this.delay(300);
      
      this.updateGenerationStatus(pageId, 'complete', null, pageUrl);
      
      return {
        success: true,
        pageUrl,
        pageId,
        generatedAt: new Date().toISOString(),
        htmlContent
      };
      
    } catch (error) {
      console.error('Page generation failed:', error);
      this.updateGenerationStatus(pageId, 'failed', error.message);
      throw error;
    }
  }

  // Helper function to simulate async delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Update generation status for UI feedback
  updateGenerationStatus(pageId, status, error = null, pageUrl = null) {
    const statusUpdate = {
      pageId,
      status,
      timestamp: Date.now(),
      error,
      pageUrl
    };
    
    // Store in memory for immediate access
    this.generationQueue.set(pageId, statusUpdate);
    
    // Notify UI components
    window.dispatchEvent(new CustomEvent('pageGenerationUpdate', {
      detail: statusUpdate
    }));
  }

  // Get current generation status
  getGenerationStatus(pageId) {
    return this.generationQueue.get(pageId) || { status: 'idle' };
  }

  // Generate unique page ID
  generatePageId(bridgePageData) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const titleSlug = bridgePageData.headline
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 20) || 'page';
    
    return `${titleSlug}-${randomString}-${timestamp}`;
  }

  // Get all saved pages
  getSavedPages() {
    const pages = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('bridgePage_')) {
        try {
          const pageData = JSON.parse(localStorage.getItem(key));
          pages.push(pageData);
        } catch (e) {
          console.error('Error parsing saved page:', e);
        }
      }
    }
    return pages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export default new MockPageGenerationService();