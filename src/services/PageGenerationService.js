import { supabase } from '../lib/supabase';

class PageGenerationService {
  constructor() {
    this.generationQueue = new Map();
    this.hostingEndpoint = process.env.REACT_APP_HOSTING_ENDPOINT || 'https://pages.bridgebuilder.pro';
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
                <h4>${bonus.title}</h4>
                <div class="bonus-type">${bonus.type}</div>
                <p>${bonus.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : '';

    // Generate CTA buttons
    const ctaButtonsHTML = bridgePageData.ctaButtons
      .filter(cta => cta.trim())
      .map(cta => `
        <a href="${bridgePageData.affiliateLink}" class="cta-button" onclick="trackConversion('${pageId}', 'cta_click', '${cta}')">
          ${cta} →
        </a>
      `).join('');

    // Complete HTML template
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bridgePageData.headline || 'Bridge Page'}</title>
    <meta name="description" content="${bridgePageData.subheadline || 'High-converting bridge page'}">
    
    <!-- SEO Meta Tags -->
    <meta property="og:title" content="${bridgePageData.headline}">
    <meta property="og:description" content="${bridgePageData.subheadline}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${this.hostingEndpoint}/${pageId}">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=${bridgePageData.headingFont.replace(' ', '+')}:wght@400;600;700&family=${bridgePageData.bodyFont.replace(' ', '+')}:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
      
      // Custom tracking
      function trackConversion(pageId, eventType, eventData) {
        gtag('event', eventType, {
          'page_id': pageId,
          'event_data': eventData,
          'timestamp': Date.now()
        });
        
        // Send to our analytics
        fetch('${this.hostingEndpoint}/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId: pageId,
            eventType: eventType,
            eventData: eventData,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
          })
        });
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
        
        /* Loading Animation */
        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid ${bridgePageData.primaryColor};
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="headline">${bridgePageData.headline}</h1>
            <p class="subheadline">${bridgePageData.subheadline}</p>
        </div>
        
        ${heroVideoHTML}
        
        <div class="content">
            ${bridgePageData.bodyParagraphs.map(paragraph => 
              `<p class="paragraph">${paragraph}</p>`
            ).join('')}
            
            ${additionalVideoHTML}
        </div>
        
        ${bonusesHTML}
        
        <div class="cta-section">
            ${ctaButtonsHTML}
        </div>
    </div>
    
    <!-- Loading overlay for dynamic content -->
    <div id="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading content...</p>
    </div>
    
    <script>
        // Hide loading when page is fully loaded
        window.addEventListener('load', function() {
            document.getElementById('loading').style.display = 'none';
        });
        
        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>`;
  }

  // Create and host the actual page
  async createAndHostPage(bridgePageData, pageId, userId) {
    try {
      // Update generation status
      this.updateGenerationStatus(pageId, 'validating');
      
      // Validate all required data
      const validation = this.validatePageData(bridgePageData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
      
      this.updateGenerationStatus(pageId, 'generating');
      
      // Generate complete HTML
      const htmlContent = this.generateCompleteHTML(bridgePageData, pageId);
      
      this.updateGenerationStatus(pageId, 'uploading');
      
      // Create the page file
      const pageUrl = await this.uploadPageToHosting(pageId, htmlContent);
      
      this.updateGenerationStatus(pageId, 'configuring');
      
      // Save page metadata to database
      await this.savePageMetadata(pageId, userId, bridgePageData, pageUrl);
      
      this.updateGenerationStatus(pageId, 'testing');
      
      // Test the live URL
      const isLive = await this.testPageAccessibility(pageUrl);
      if (!isLive) {
        throw new Error('Generated page is not accessible');
      }
      
      this.updateGenerationStatus(pageId, 'complete');
      
      return {
        success: true,
        pageUrl,
        pageId,
        generatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Page generation failed:', error);
      this.updateGenerationStatus(pageId, 'failed', error.message);
      throw error;
    }
  }

  // Upload page to hosting service
  async uploadPageToHosting(pageId, htmlContent) {
    try {
      // In production, this would upload to your hosting service
      // For now, we'll simulate the upload and use a mock hosting service
      
      const response = await fetch(`${this.hostingEndpoint}/api/pages/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_HOSTING_API_KEY}`
        },
        body: JSON.stringify({
          pageId,
          htmlContent,
          timestamp: Date.now()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Hosting upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.pageUrl;
      
    } catch (error) {
      // Fallback: Save to Supabase storage
      console.warn('Primary hosting failed, using fallback storage');
      return await this.uploadToSupabaseStorage(pageId, htmlContent);
    }
  }

  // Fallback: Upload to Supabase storage
  async uploadToSupabaseStorage(pageId, htmlContent) {
    try {
      const fileName = `${pageId}.html`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('bridge-pages')
        .upload(fileName, htmlContent, {
          contentType: 'text/html',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('bridge-pages')
        .getPublicUrl(fileName);
      
      return publicUrlData.publicUrl;
      
    } catch (error) {
      console.error('Supabase storage upload failed:', error);
      throw new Error('Failed to upload page to storage');
    }
  }

  // Save page metadata to database
  async savePageMetadata(pageId, userId, bridgePageData, pageUrl) {
    try {
      const { error } = await supabase
        .from('bridge_pages')
        .upsert({
          id: pageId,
          user_id: userId,
          title: bridgePageData.headline,
          slug: pageId,
          content: bridgePageData,
          page_url: pageUrl,
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Database save failed:', error);
      throw new Error('Failed to save page metadata');
    }
  }

  // Test if the generated page is accessible
  async testPageAccessibility(pageUrl) {
    try {
      const response = await fetch(pageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Page accessibility test failed:', error);
      return false;
    }
  }

  // Update generation status for UI feedback
  updateGenerationStatus(pageId, status, error = null) {
    const statusUpdate = {
      pageId,
      status,
      timestamp: Date.now(),
      error
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
}

export default new PageGenerationService();